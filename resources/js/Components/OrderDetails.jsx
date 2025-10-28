import { ChevronLeftIcon, PencilSquareIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { router } from "@inertiajs/react";
import toast, { useToasterStore } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton"

const formatDate = (dateString) => {
    if (!dateString) return "---";
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
        new Date(dateString)
    );
};

export default function OrderDetails({ order, orders, onClose, onNextOrder, orderStatus }) {
    const [activeTab, setActiveTab] = useState("summary"); // Track the active tab
    const [currentOrder, setCurrentOrder] = useState(order); // Local state for the current order
    const [isEditing, setIsEditing] = useState(false); // Track editing state
    const [isUpdating, setIsUpdating] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    
    const openImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageOpen(true);
    };

    const closeImage = () => {
        setImageOpen(false);
        setSelectedImage("");
    };

    const [statusForm, setStatusForm] = useState({
        primary_status: "",
        secondary_status: "",
        comments: "",
    });

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
        setStatusForm((prev) => ({ ...prev, [name]: value }));
    };

        const handleConfirmOrder = (orderId) => {
            router.post(`/order/${orderId}/confirm`, {
                onSuccess: () => {
                    toast.success("Order confirmed and marked as paid!");
                    setCurrentOrder({ ...currentOrder, paid: 'paid' }); // Update the local state
                },
                onError: (error) => {
                    toast.error("Failed to confirm order.");
                    console.error(error);
                },
            });
        };


    const submitStatusUpdate = () => {
        setIsLoading(true);
        router.post(`/admin/manage-orders/${currentOrder.id}/update-status`, statusForm, {
            onSuccess: () => {
                // Add the new status update to the order history
                const newHistoryEntry = {
                    primary_status: statusForm.primary_status,
                    secondary_status: statusForm.secondary_status,
                    comments: statusForm.comments,
                    created_at: new Date().toISOString(), // Add the current timestamp
                };

                setCurrentOrder((prevOrder) => ({
                    ...prevOrder,
                    order_tracking: [...(prevOrder.order_tracking || []), newHistoryEntry],
                }));

                setIsUpdating(false);
                setStatusForm({ primary_status: "", secondary_status: "", comments: "" });
                toast.success("Order status updated successfully!");
            },
            onError: (error) => {
                console.error("Error updating status:", error);
                toast.error("Failed to update order status.");
            },
            onFinish: () => setIsLoading(false),
        });
    };

    // Update local state when the `order` prop changes
    useEffect(() => {
        setCurrentOrder(order);
    }, [order]);

    // Find the current order index
    const currentIndex = orders.findIndex((o) => o.id === currentOrder.id);

    // Handle Next Order button click
    const handleNextOrder = () => {
        if (currentIndex < orders.length - 1) {
            const nextOrder = orders[currentIndex + 1];
            onNextOrder(nextOrder); 
            toast.success("This order should be stored at a specific temperature before shipping.");
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...currentOrder.order_items];

        // Ensure the value is a valid number or default to 0
        updatedItems[index][field] = isNaN(value) || value === "" ? 0 : value;

        // Extract relevant fields
        const quantity = parseFloat(updatedItems[index].quantity) || 0;
        const basePrice = parseFloat(updatedItems[index].price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;
        const vatPercentage = parseFloat(updatedItems[index].vat_percentage) || 0;
        const taxPercentage = parseFloat(updatedItems[index].tax_percentage) || 0;
        let finalPrice = parseFloat(updatedItems[index].final_price) || 0;

        // Recalculate VAT and Tax
        const vat = (finalPrice * vatPercentage) / 100;
        const tax = (finalPrice * taxPercentage) / 100;

        // Handle recalculations based on the edited field
        if (field === "price") {
            // If base price is edited, recalculate final price
            finalPrice = basePrice + vat + tax - discount;
            updatedItems[index].final_price = finalPrice.toFixed(2);
        } else if (field === "final_price") {
            // If final price is edited, recalculate base price
            const recalculatedBasePrice = finalPrice - vat - tax + discount;
            updatedItems[index].price = recalculatedBasePrice.toFixed(2);
        }

        // Update VAT and Tax
        updatedItems[index].vat = vat.toFixed(2);
        updatedItems[index].tax = tax.toFixed(2);

        // Recalculate Total
        updatedItems[index].total = (quantity * finalPrice).toFixed(2);

        setCurrentOrder({ ...currentOrder, order_items: updatedItems });
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...currentOrder.order_items];
        updatedItems.splice(index, 1); // Remove the item at the specified index
        setCurrentOrder({ ...currentOrder, order_items: updatedItems });
    };

    const saveChanges = () => {
        setIsLoading(true);
        router.post(`/admin/manage-orders/${currentOrder.id}/update-items`, {
            order_items: currentOrder.order_items,
        }, {
            onSuccess: () => {
                setIsEditing(false);
                setErrors({});
                setIsLoading(false);
                toast.success("Changes saved successfully!", {
                    duration: 2000,
                    position: "bottom-left",
                });
            },
            onError: (backendErrors) => {
                console.error("Error saving changes:", backendErrors);
                setIsLoading(false);
            },
        });
    };

    return (
        <>
            <aside className={`bg-white w-2xl rounded-2xl flex flex-col h-full`}>

                {/* Header */}
                <header className={`p-4 flex text-sm items-center sticky border-b rounded-t-lg top-0`}>
                    <ChevronLeftIcon
                        className="w-8 h-8 cursor-pointer p-1 border rounded-sm hover:bg-gray-100"
                        onClick={onClose}
                    />
                    <p className="px-4 text-base flex-grow">Order #{currentOrder.id}</p>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium w-30 text-center ${order.status === "placed"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "shipped"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "delivered"
                                    ? "bg-purple-100 text-purple-700"
                                    : order.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : order.status === "returned"
                                                ? "bg-gray-100 text-gray-700"
                                                : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </header>

                {/* Item Section */}
                <section className={`px-4 py-2 overflow-y-auto h-3/7 border-b ${activeTab ? "" : "flex-grow transition-all duration-300"}`}>
                    <div className="py-2 border-b mb-2 flex flex-row gap-x-2 items-center">
                        {isUpdating ? (
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold">Update Status</h3>
                                <p className="text-sm font-light">Here you can update the status of the order</p>
                            </div>
                        ) : (
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold">Items</h3>
                                <p className="text-sm font-light">Here you can find the list of products</p>
                            </div>
                        )}
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="default"
                                    className="bg-green-900 w-16 text-white text-sm px-2 py-1 rounded-md shadow-xs"
                                    onClick={saveChanges}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="bg-gray-300 w-16 text-sm px-2 py-1 rounded-md shadow-xs"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : isUpdating ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="default"
                                    className="bg-green-900 w-16 text-white text-sm px-2 py-1 rounded-md shadow-xs"
                                    onClick={submitStatusUpdate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="bg-gray-300 w-16 text-sm px-2 py-1 rounded-md shadow-xs"
                                    onClick={() => setIsUpdating(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-x-2">
                                <Button
                                    variant="outline"
                                    className="border text-sm px-2 py-1 w-20 rounded-md shadow-xs"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsUpdating(true);
                                        setActiveTab("history");
                                    }}
                                >
                                    Update status
                                </Button>
                            </div>
                        )}

                    </div>

                    {isUpdating ? (
                        <div className="w-full py-2">
                            <div className="flex gap-x-2">
                                <div>
                                    <label className="text-sm font-light">Primary status</label>
                                    <Select
                                        onValueChange={(value) =>
                                            setStatusForm((prev) => ({ ...prev, primary_status: value }))
                                        }
                                        value={statusForm.primary_status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {orderStatus.map((status) => (
                                                <SelectItem key={status.id} value={status.status}>
                                                    {status.status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-grow">
                                    <label className="text-sm font-light">Secondary status</label>
                                    <Input
                                        type="text"
                                        name="secondary_status"
                                        value={statusForm.secondary_status}
                                        onChange={handleStatusChange}
                                        placeholder="Out for delivery"
                                    />
                                </div>
                            </div>
                            <div className="py-2">
                                <label className="text-sm font-light">Comments</label>
                                <Textarea
                                    name="comments"
                                    value={statusForm.comments}
                                    onChange={handleStatusChange}
                                    className="w-full h-24 border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            {/* <div className="flex gap-2 mt-4">
                                <Button
                                    variant="default"
                                    className="bg-green-900 w-16 text-white text-sm px-2 py-1 rounded-md shadow-xs"
                                    onClick={submitStatusUpdate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="bg-gray-300 w-16 text-sm px-2 py-1 rounded-md shadow-xs"
                                    onClick={() => setIsUpdating(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div> */}
                        </div>





                    ) : (


                        < div className="flex flex-col gap-4">
                            {currentOrder.order_items && currentOrder.order_items.length > 0 ? (
                                currentOrder.order_items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-2 p-4 border rounded-lg bg-gray-50"
                                    >
                                        {/* Product Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 bg-gray-300 rounded-lg">
                                                <img
                                                    src={
                                                        item.product?.product_image
                                                            ? `/storage/${item.product.product_image}`
                                                            : "placeholder-image.png"
                                                    }
                                                    alt={item.product?.product_name || "Product"}
                                                    className="w-full h-full object-cover rounded-lg border"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-green-900 text-white text-xs font-light w-6 h-6 flex items-center justify-center rounded-full">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {item.product?.product_name || "Product Name"} <span>({item.product?.product_serving || "N/A"})</span>
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.product?.category || "N/A"}
                                                </p>
                                                {  item.product?.storage_temperature && (
                                                    <p className="text-xs text-red-500">
                                                        Requires {item.product.storage_temperature} temperature
                                                    </p>
                                                )}
                                                {item.product?.expiration_date && (
                                                    <p className="text-xs text-gray-500">
                                                        Expiration Date: {formatDate(item.product.expiration_date)}
                                                    </p>
                                                )}

                                            </div>
                                        </div>

                                        {/* Editable Fields */}
                                        {isEditing && (
                                            <div className="grid grid-cols-6 gap-4">
                                                {/* Quantity */}
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-500 mb-1">Quantity</label>
                                                    <input
                                                        type="number"
                                                        value={item.quantity || ""}
                                                        onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                                                        className="text-sm font-light w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>

                                                {/* Base Price */}
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-500 mb-1">Base Price</label>
                                                    <input
                                                        type="number"
                                                        value={item.price || ""}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value) || 0;
                                                            handleItemChange(index, "price", value);
                                                        }}
                                                        className="text-sm font-light w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>

                                                {/* VAT Percentage */}
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-500 mb-1">VAT %</label>
                                                    <input
                                                        type="number"
                                                        value={item.vat_percentage || ""}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value) || 0;
                                                            handleItemChange(index, "vat_percentage", value);
                                                        }}
                                                        className="text-sm font-light w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                    <label className="text-xs text-gray-500 mt-1">
                                                        Vat: {((item.final_price || 0) * (item.vat_percentage || 0) / 100).toFixed(2)}
                                                    </label>
                                                </div>

                                                {/* Tax Percentage */}
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-500 mb-1">Tax %</label>
                                                    <input
                                                        type="number"
                                                        value={item.tax_percentage || ""}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value) || 0;
                                                            handleItemChange(index, "tax_percentage", value);
                                                        }}
                                                        className="text-sm font-light w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                    <label className="text-xs text-gray-500 mt-1">
                                                        Tax: {((item.final_price || 0) * (item.tax_percentage || 0) / 100).toFixed(2)}
                                                    </label>
                                                </div>

                                                {/* Discount */}
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-500 mb-1">Discount</label>
                                                    <input
                                                        type="number"
                                                        value={item.discount || ""}
                                                        onChange={(e) => handleItemChange(index, "discount", parseFloat(e.target.value) || 0)}
                                                        className="text-sm font-light w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>

                                                {/* Final Price */}
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-500 mb-1">Final Price</label>
                                                    <input
                                                        type="number"
                                                        value={item.final_price || ""}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value) || 0;
                                                            handleItemChange(index, "final_price", value);
                                                        }}
                                                        className="text-sm font-light w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Total */}
                                        <div className="text-right font-semibold text-gray-800">
                                            Total: P{item.total || "0.00"}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">
                                    No items found for this order.
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* Tabbed Section */}
                <section className={`max-h-3/7 flex flex-col gap-x-2 text-sm ${activeTab ? "flex-grow" : ""}`}>
                    {/* Tabs */}
                    <div className={`flex ${!activeTab ? "mt-auto" : ""}`}> {/* Move tabs down if no active tab */}
                        <button
                            className={`flex-1 py-2 text-center ${activeTab === "summary"
                                ? "border-b-2 border-green-900 font-semibold"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab(activeTab === "summary" ? null : "summary")} // Toggle visibility
                        >
                            Summary
                        </button>
                        <button
                            className={`flex-1 py-2 text-center ${activeTab === "history"
                                ? "border-b-2 border-green-900 font-semibold"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab(activeTab === "history" ? null : "history")} // Toggle visibility
                        >
                            Order History
                        </button>
                        <button
                            className={`flex-1 py-2 text-center ${activeTab === "orderconfirm"
                                ? "border-b-2 border-green-900 font-semibold"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab(activeTab === "orderconfirm" ? null : "orderconfirm")} // Toggle visibility
                        >
                            Order Confirmation
                        </button>
                        <button
                            className={`flex-1 py-2 text-center ${activeTab === "receiver"
                                ? "border-b-2 border-green-900 font-semibold"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab(activeTab === "receiver" ? null : "receiver")} // Toggle visibility
                        >
                            Receiver
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab && ( // Only show content if a tab is active
                        <div className="flex-grow overflow-y-auto p-4">
                            {activeTab === "summary" && (
                                <div className="p-4 bg-white border rounded-lg shadow-sm">
                                    <div className="flex items-center justify-center mb-4">
                                        <h3 className="text-lg font-semibold flex-grow">Order Summary</h3>
                                        {isEditing ? (
                                            <Select
                                                onValueChange={(value) =>
                                                    setCurrentOrder((prevOrder) => ({ ...prevOrder, paid: value }))
                                                }
                                                value={currentOrder.paid}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                                    <SelectItem value="paid">Paid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p
                                                className={`px-2 py-1 rounded-md w-20 text-center text-sm font-semibold ${
                                                    currentOrder.paid === "paid"
                                                        ? "bg-green-100 text-green-700 border border-green-300"
                                                        : "bg-red-100 text-red-700 border border-red-300"
                                                }`}
                                            >
                                                {currentOrder.paid === "paid" ? "Paid" : "Unpaid"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <p className="text-gray-500">Payment method</p>
                                        <p className="text-right text-gray-800">{currentOrder.payment_method || "none"}</p>
                                        <p className="text-gray-500">Sub Total</p>
                                        <p className="text-right text-gray-800">
                                            ₱{(() => {
                                                const subtotal = currentOrder.order_items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
                                                console.log('Subtotal:', subtotal);
                                                return subtotal.toFixed(2);
                                            })()}
                                        </p>

                                        <p className="text-gray-500">Tax</p>
                                        <p className="text-right text-gray-800">
                                            ₱{currentOrder.order_items.reduce((sum, item) => sum + parseFloat(item.tax || 0), 0).toFixed(2)}
                                        </p>

                                        <p className="text-gray-500">Individual Item Discounts</p>
                                        <p className="text-right text-gray-800">
                                            -₱{currentOrder.order_items.reduce((sum, item) => sum + parseFloat(item.discount || 0), 0).toFixed(2)}
                                        </p>

                                        {(currentOrder.discount && currentOrder.discount !== "0") && (
                                            <>
                                                <p className="text-gray-500">
                                                    {currentOrder.promotion ? (
                                        <>
                                            Promotion Code Discount
                                            <span className="text-xs ml-1">({currentOrder.promotion.code})</span>
                                        </>
                                    ) : (
                                        "Promotion Discount"
                                    )}
                                                </p>
                                                <p className="text-right text-gray-800">
                                                    -₱{parseFloat(currentOrder.discount || 0).toFixed(2)}
                                                </p>
                                            </>
                                        )}
                                        {currentOrder.promotion && !currentOrder.discount && (
                                            <>
                                                <p className="text-gray-500">
                                                    Promotion Code
                                                    <span className="text-xs ml-1">({currentOrder.promotion.code})</span>
                                                </p>
                                                <p className="text-right text-gray-800">
                                                    No discount applied
                                                </p>
                                            </>
                                        )}

                                        <p className="text-gray-500">Delivery Charge</p>
                                        <p className="text-right text-gray-800">
                                            ₱{currentOrder.delivery_fee || "0.00"}
                                        </p>

                                    </div>

                                    <hr className="my-4 border-gray-300" />

                                    <div className="flex justify-between items-center text-base font-semibold">
                                        <p className="text-gray-800">Total Amount</p>
                                        <p className="text-green-600">
                                            ₱{(() => {
                                                const subtotal = currentOrder.order_items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
                                                const deliveryFee = parseFloat(currentOrder.delivery_fee || 0);
                                                const voucherDiscount = parseFloat(currentOrder.discount || 0);
                                                const totalBeforeDiscount = subtotal + deliveryFee;
                                                const finalTotal = totalBeforeDiscount - voucherDiscount;
                                                
                                                console.log('Total Calculation:', {
                                                    subtotal,
                                                    deliveryFee,
                                                    voucherDiscount,
                                                    totalBeforeDiscount,
                                                    finalTotal
                                                });
                                                
                                                return finalTotal.toFixed(2);
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {activeTab === "history" && (
                                <section className="p-4 bg-white border rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4">Order History</h3>
                                    <ul className="space-y-4">
                                        {currentOrder.order_tracking?.map((event, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                {/* Timeline indicator */}
                                                {/* <div className="relative">
                                                    <div
                                                        className={`${
                                                            event.primary_status ? "w-4 h-4 " : "w-2 h-2"
                                                        } bg-gray-800 rounded-full border`}
                                                    ></div>
                                                    {index !== currentOrder.order_tracking.length - 1 && (
                                                        <div className="absolute top-4 left-1 w-0.5 h-full bg-gray-300"></div>
                       
                                                    )}
                                                </div> */}

                                                {/* Event details */}
                                                <div className="border w-full px-4 py-2 rounded-lg bg-gray-50">
                                                    {event.primary_status && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 flex items-center justify-center">
                                                                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                                                            </div>
                                                            <p className="font-medium text-gray-800">Order {event.primary_status}</p>
                                                        </div>
                                                    )}
                                                    {event.secondary_status && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 flex items-center justify-center">
                                                                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                                                            </div>
                                                            <p className="text-sm text-gray-800">{event.secondary_status}</p>
                                                        </div>
                                                    )}
                                                    {event.comments && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 flex items-center justify-center">
                                                                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                                                            </div>
                                                            <p className="text-sm text-gray-500">{event.comments}</p>
                                                        </div>

                                                    )}

                                                    {event.created_at && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 flex items-center justify-center">
                                                                <div className="w-1 h-1 rounded-full"></div>
                                                            </div>
                                                            <p className="text-xs text-gray-400">{formatDate(event.created_at)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                         {activeTab === "orderconfirm" && (
                            <div>
                                <h3 className="text-lg font-semibold">Order Confirmation</h3>

                                {currentOrder.paid === "payment_review" && currentOrder.payment_proof && (
                                    <div className="mt-4">
                                        <h4 className="text-md font-semibold">Payment Proof</h4>
                                        <p className="text-sm text-gray-500">
                                            Below is the payment proof uploaded by the user.
                                        </p>

                                        <img
                                            src={`/storage/${currentOrder.payment_proof}`}
                                            alt="Payment Proof"
                                            className="mt-2 w-64 h-64 object-cover rounded-lg cursor-pointer"
                                            onClick={() => openImage(`/storage/${currentOrder.payment_proof}`)} 
                                        />
                                    </div>
                                )}

                                {currentOrder.paid === "paid" && (
                                    <div className="mt-4">
                                          <img
                                            src={`/storage/${currentOrder.payment_proof}`}
                                            alt="Payment Proof"
                                            className="mt-2 w-64 h-64 object-cover rounded-lg cursor-pointer"
                                            onClick={() => openImage(`/storage/${currentOrder.payment_proof}`)} 
                                        />
                                        <h4 className="text-md font-semibold">Order Confirmed</h4>
                                        <p className="text-sm text-gray-500">
                                            The order has been confirmed and marked as paid.
                                        </p>
                                    </div>
                                )}

                                {currentOrder.paid === "Unpaid" && (
                                    <div className="mt-4">
                                       <h1>User dosen't have a proof of payment yet</h1>
                                    </div>
                                )}

                                {currentOrder.paid === "payment_review" && (
                                    <div className="mt-4">
                                        <Button
                                            variant="default"
                                            className="bg-green-900 text-white px-4 py-2 rounded-md shadow hover:bg-green-800 transition-colors"
                                            onClick={() => handleConfirmOrder(currentOrder.id)} 
                                        >
                                            Confirm Order
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors ml-2"
                                            onClick={() => {
                                                toast.error("Order confirmation rejected.");
                                                setActiveTab(null);
                                            }}
                                        >
                                            Reject Order
                                        </Button>
                                    </div>
                                )}

                                {imageOpen && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                                        onClick={closeImage}
                                    >
                                        <div
                                            className="relative"
                                            onClick={(e) => e.stopPropagation()} 
                                        >
                                            <button
                                                onClick={closeImage}
                                                className="absolute top-4 right-4 text-white text-3xl"
                                            >
                                                &times;
                                            </button>
                                            <img
                                                src={selectedImage}
                                                alt="Full Size"
                                                className="max-w-full max-h-screen object-contain rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                            {activeTab === "receiver" && (
                                <div className="p-4 bg-white border rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                                        <p className="text-gray-500">Full Name</p>
                                        <p className="text-gray-800 text-right">
                                            {currentOrder.first_name || ""} {currentOrder.last_name || ""}
                                        </p>

                                        <p className="text-gray-500">Mobile Number</p>
                                        <p className="text-gray-800 text-right">{currentOrder.mobile_number || ""}</p>

                                        <p className="text-gray-500">Shipping Address</p>
                                        <p className="text-gray-800 text-right">
                                            {currentOrder.address || ""}, {currentOrder.barangay || ""}, {currentOrder.city || ""}, {currentOrder.region || ""}, {currentOrder.zip_code || ""}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
                <footer className="flex flex-row p-4 border-t sticky bottom-0 bg-white gap-x-2 items-center justify-between rounded-b-lg">
                    <p className="flex-grow px-2 py-1">
                        Order {currentIndex + 1} of {orders.length}
                    </p>
                    <div className="flex border px-2 py-1 gap-x-2 text-sm rounded-md shadow-xs items-center justify-center text-center">
                        <button
                            variant="outline"
                            onClick={handleNextOrder}
                            disabled={currentIndex >= orders.length - 1} // Disable if last order
                            className={`${currentIndex >= orders.length - 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:text-black"
                                }`}
                        >
                            Next Order
                        </button>
                        <ArrowRightIcon
                            className={`w-4 h-5 ${currentIndex >= orders.length - 1
                                ? "text-gray-400"
                                : "text-gray-500"
                                }`}
                        />
                    </div>
                </footer>
            </aside >
        </>
    );
}