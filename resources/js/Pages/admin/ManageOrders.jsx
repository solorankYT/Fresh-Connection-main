import { Link, router } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import { Search, CalendarIcon, PackageIcon } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import OrderDetails from "@/resources/js/Components/OrderDetails"; // Import the OrderDetails component
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { HomeIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, useMemo, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, YAxis, Bar, BarChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import UserPlaceholder from "../../Components/UserPlaceholder";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { debounce } from 'lodash';

const lineChartConfig = {
    orders: {
        label: "Orders",
        color: "#14532d",
    },
};


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

export default function ManageOrders({ orders, orderStatus, chartData, paymentChartData, topCustomers, topProducts, filters }) {

    const [isLoading, setIsLoading] = useState(false);

    const summary = useMemo(() => {
        // Early return if orders or orders.data is undefined
        if (!orders || !orders.data) {
            return {
                totalOrders: 0,
                newOrders: 0,
                ongoingOrders: 0,
                completedOrders: 0,
                cancelledOrders: 0,
                returnedOrders: 0,
            };
        }

        return {
            totalOrders: orders.total || orders.data.length, // Use total from paginator when available
            newOrders: orders.data.filter((order) => order.status === "placed").length,
            ongoingOrders: orders.data.filter((order) => !["placed", "completed", "cancelled", "returned"].includes(order.status)).length,
            completedOrders: orders.data.filter((order) => order.status === "completed").length,
            cancelledOrders: orders.data.filter((order) => order.status === "cancelled").length,
            returnedOrders: orders.data.filter((order) => order.status === "returned").length,
        };
    }, [orders]);

    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const searchValueRef = useRef(filters.search || "");
    const [sortConfig, setSortConfig] = useState({
        key: filters.sort_field || "created_at",
        direction: filters.sort_direction || "desc",
    });
    const [isEditMode, setIsEditMode] = useState(false); // Edit mode state
    const [editedOrders, setEditedOrders] = useState({}); // Store edited orders
    const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order

    console.log(orderStatus);

    const fetchOrders = useCallback(async (sortConfigOverride = null, searchOverride = null) => {
        setIsLoading(true);

        const params = new URLSearchParams();

        const searchValue = searchOverride !== null ? searchOverride : searchValueRef.current;
        const sort = sortConfigOverride || sortConfig;

        if (searchValue) params.append('search', searchValue);
        params.append('sort_field', sort.key || 'created_at');
        params.append('sort_direction', sort.direction || 'desc');

        try {
            router.get('/admin/manage-orders', Object.fromEntries(params), {
                preserveScroll: true,
                onBefore: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
            setIsLoading(false);
        }
    }, [sortConfig]);

    const debouncedSearch = useMemo(() =>
        debounce((value) => {
            searchValueRef.current = value;
            fetchOrders(null, value);
        }, 500),
        [fetchOrders]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleSort = useCallback((key) => {
        const newSortConfig = {
            key,
            direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
        };
        setSortConfig(newSortConfig);
        fetchOrders(newSortConfig);
    }, [sortConfig, fetchOrders]);

    const handleEditModeToggle = useCallback(async () => {
        if (!isEditMode || Object.keys(editedOrders).length === 0) {
            setIsEditMode(!isEditMode);
            return;
        }

        try {
            await router.post('/admin/manage-orders/bulk-update', {
                orders: Object.values(editedOrders),
            }, {
                preserveState: true,
                preserveScroll: true,
            });
            setIsEditMode(false);
            setEditedOrders({});
            toast.success("Orders updated successfully!");
        } catch (error) {
            console.error("Error updating orders:", error);
            toast.error("Failed to update orders.");
        }
    }, [isEditMode, editedOrders]);

    const handleOrderEdit = (orderId, field, value) => {
        setEditedOrders((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                id: orderId,
                [field]: value,
            },
        }));
    };

    const handleDelete = useCallback((orderId, e) => {
        e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this order?')) {
            router.delete(`/admin/manage-orders/${orderId}`, {
                data: { id: orderId }, // Explicitly pass the orderId
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Order deleted successfully!"); // Show toast notification
                },
                onError: () => {
                    toast.error("Failed to delete order.");
                },
            });
        }
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order); // Set the selected order
        console.log("Selected Order:", order);
        // if (order.status === "shipped" || order.status === "placed") {
        //     toast.success("This order should be stored at a specific temperature before shipping.");
        // }
        toast.success("This order should be stored at a specific temperature before shipping.");
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null); // Clear the selected order
    };

    return (
        <AppLayout>
            <Breadcrumb className="mt-18 p-4 bg-white shadow-sm rounded-md mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/"><HomeIcon className=" w-4 h-4" /></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Manage Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* <summary className="px-4 py-2 mt-4 sticky top-16 border-b bg-gray-50 z-10">
                <div className=" flex items-center gap-4">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold">Order List</h3>
                        <p className="text-sm font-light">
                            Here you can find all orders
                        </p>
                    </div>
                    <Button

                        className="px-4 py-2 bg-green-900 rounded-sm min-w-32 text-white text-center"
                    >
                        Add Order
                    </Button>
                    <Button
                        onClick={handleEditModeToggle}
                        className="px-4 py-2 border border-green-900 bg-white text-black cursor-pointer rounded-sm min-w-32 text-center hover:text-white hover:bg-gray-800 transition-all"
                    >
                        {isEditMode ? "Save" : "Manage"}
                    </Button>
                </div>
                <div className="mt-4 py-4 flex gap-x-4">
                    <div className="flex-auto border rounded-sm px-4 py-2 bg-gray-50 border-gray-300 shadow-sm">
                        <h3 className="text-lg">Total Orders</h3>
                        <p className="font-bold">{summary.totalOrders}</p>
                        <p className="text-xs font-light">
                            Combined number of orders
                        </p>
                    </div>
                    <div className="flex-auto border rounded-sm px-4 py-2 bg-gray-50 border-gray-300 shadow-sm">
                        <h3 className="text-lg">New</h3>
                        <p className="font-bold">
                            {summary.newOrders}
                        </p>
                        <p className="text-xs font-light">
                            Total number of new placed orders
                        </p>
                    </div>
                    <div className="flex-auto border rounded-sm px-4 py-2 bg-gray-50 border-gray-300 shadow-sm">
                        <h3 className="text-lg">Ongoing</h3>
                        <p className="font-bold">
                            {summary.ongoingOrders}
                        </p>
                        <p className="text-xs font-light">
                            Total number of ongoing orders
                        </p>
                    </div>
                    <div className="flex-auto border rounded-sm px-4 py-2 bg-gray-50 border-gray-300 shadow-sm">
                        <h3 className="text-lg">Completed</h3>
                        <p className="font-bold">
                            {summary.completedOrders}
                        </p>
                        <p className="text-xs font-light">
                            Number of completed orders
                        </p>
                    </div>
                    <div className="flex-auto border rounded-sm px-4 py-2 bg-gray-50 border-gray-300 shadow-sm">
                        <h3 className="text-lg">Cancelled & Returned</h3>
                        <p className="font-bold">
                            {summary.cancelledOrders + summary.returnedOrders}
                        </p>
                        <p className="text-xs font-light">
                            number of cancelled and returned orders
                        </p>
                    </div>
                </div>
            </summary> */}

            {/* order list section */}
            <Card className="p-4 mb-4">
                <div className="flex flex-row gap-x-2">

                    {/* Search Bar */}
                    <div className="items-center flex-grow justify-center">

                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-60 relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="outline-none bg-transparent w-full text-sm"
                            />
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 absolute right-3"></div>
                            ) : (
                                <Search className="text-gray-500 absolute right-3" size={18} />
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={handleEditModeToggle}
                        className=""
                        variant="outline"
                    >
                        {isEditMode ? "Save" : <PencilSquareIcon className="w-6 h-6" />}
                    </Button>
                </div>

                <Table>
                    <TableCaption>List of Orders</TableCaption>
                    <TableHeader className="">
                        <TableRow>
                            <TableHead
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort("first_name")}
                            >
                                Customer Details
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort("id")}
                            >
                                Order ID & Created Date
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort("total")}
                            >
                                Amount
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort("supplier")}
                            >
                                Supplier
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort("status")}
                            >
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data && orders.data.length > 0 ? (
                            orders.data.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="font-medium"
                                    onClick={() => handleOrderClick(order)}
                                >
                                    {/* Customer Details */}
                                    <TableCell className="flex items-center space-x-2">
                                        <div className="flex items-center gap-4">
                                            {order.user ? (
                                                <>
                                                    <img
                                                        src={order.user.user_image ? `/storage/${order.user.user_image}` : "/images/user.png"}
                                                        alt="customer"
                                                        className="h-10 w-10 bg-white object-cover rounded-full border border-gray-300"
                                                    />
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">
                                                            {order.user.first_name} {order.user.last_name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">{order.user.email}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-500">No user data available</p>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Order ID and Created Date */}
                                    <TableCell>
                                        <p className="text-gray-800">{order.id}</p>
                                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                    </TableCell>

                                    {/* Order Amount */}
                                    <TableCell>
                                        <p className="text-gray-800">₱{order.total}</p>
                                        <p className="text-xs text-gray-500">{order.payment_method}</p>
                                    </TableCell>

                                    {/* Supplier */}
                                    <TableCell className="">
                                        <p className="text-gray-800">Fresh Supermarket</p>
                                    </TableCell>

                                    {/* Order Status */}
                                    <TableCell className="">
                                        {isEditMode ? (
                                            <Select
                                                value={editedOrders[order.id]?.status || order.status}
                                                onValueChange={(value) => handleOrderEdit(order.id, "status", value)}
                                            >
                                                <SelectTrigger className="w-30 mx-auto">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="placed">Placed</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    <SelectItem value="returned">Returned</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${order.status === "placed" ? "bg-blue-100 text-blue-700" :
                                                    order.status === "shipped" ? "bg-yellow-100 text-yellow-800" :
                                                        order.status === "delivered" ? "bg-purple-100 text-purple-800" :
                                                            order.status === "completed" ? "bg-green-100 text-green-800" :
                                                                order.status === "cancelled" ? "bg-red-100 text-red-800" :
                                                                    order.status === "returned" ? "bg-gray-100 text-gray-800" :
                                                                        "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                {orders.links && (
                    <div className="mt-4 flex items-center">
                        {/* <div className="text-sm text-gray-500">
                            Showing {orders.from || 0}-{orders.to || 0} of {orders.total} orders
                        </div> */}

                        <Pagination className="">
                            <PaginationContent>
                                {orders.links.map((link, i) => {
                                    // Skip the current page link as it will be rendered as PaginationLink
                                    if (link.label === '&laquo; Previous') {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationPrevious
                                                    href={link.url || '#'}
                                                    onClick={(e) => {
                                                        if (link.url) {
                                                            e.preventDefault();
                                                            router.get(link.url, {}, {
                                                            });
                                                        }
                                                    }}
                                                    className={!link.url ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>
                                        );
                                    } else if (link.label === 'Next &raquo;') {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationNext
                                                    href={link.url || '#'}
                                                    onClick={(e) => {
                                                        if (link.url) {
                                                            e.preventDefault();
                                                            router.get(link.url, {}, {
                                                            });
                                                        }
                                                    }}
                                                    className={!link.url ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>
                                        );
                                    } else if (link.label === '...') {
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    } else {
                                        // Regular page numbers
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    href={link.url || '#'}
                                                    onClick={(e) => {
                                                        if (link.url) {
                                                            e.preventDefault();
                                                            router.get(link.url, {}, {
                                                            });
                                                        }
                                                    }}
                                                    isActive={link.active}
                                                    className={!link.url ? "pointer-events-none opacity-50" : ""}
                                                >
                                                    {link.label.replace(/&laquo;|&raquo;/g, '')}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    }
                                })}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </Card>

            {/* Conditionally render OrderDetails with Framer Motion */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 flex justify-end z-50">
                        {/* Background overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-black"
                            onClick={closeOrderDetails}
                        ></motion.div>

                        {/* OrderDetails sliding in */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative z-10 w-2xl bg-white rounded-lg shadow-lg m-4"
                        >
                            <OrderDetails
                                order={selectedOrder}
                                orderStatus={orderStatus} // Pass the orderStatus prop
                                orders={orders.data} // Pass the list of orders
                                onClose={closeOrderDetails}
                                onNextOrder={(nextOrder) => setSelectedOrder(nextOrder)} // Handle next order
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AppLayout>
    )
}