import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Footer from '../Components/Footer';
import { useCallback, useState, useEffect } from 'react';
import ProductFeedback from '@/resources/js/Components/ProductFeedback';
import toast from 'react-hot-toast';
import AppLayout from '@/resources/js/Layouts/AppLayout';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';


export default function Tracking({ orderItems, orderDetails, currentOrderId, reviews }) {
    const currentOrder = orderDetails.find(order => order.id === parseInt(currentOrderId));
    const [paymentProof, setPaymentProof] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        toast.success("Reminder: This order will be stored at the correct temperature before shipping.");
    }, []);

    const handleBuyAgain = () => {
        router.post(`/orders/${currentOrderId}/buy-again`, {}, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success('Items added to cart successfully!');
                    router.visit('/cart');
                } else {
                    toast.error(response.message || 'Failed to add items to cart');
                }
            },
            onError: (error) => {
                console.error('Error adding to cart:', error);
                toast.error(error.message || 'Failed to add items to cart');
            },
            preserveScroll: true
        });
    };

    const { register, handleSubmit: formHandleSubmit } = useForm();
     const handleFileChange = (e) => {
        setPaymentProof(e.target.files[0]);
        setValue("payment_proof", e.target.files[0]);  // Set the file in react-hook-form
    };

    const onSubmit = async (data) => {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("payment_proof", paymentProof);

        try {
            const response = await fetch(`/order/${currentOrderId}/upload-proof`, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
            });

            const result = await response.json();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Something went wrong while uploading your proof.");
        }

        setIsUploading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

  
    // Dynamically generate progress stages from orderTracking
    const progressStages = currentOrder?.order_tracking
    ?.filter(event => event.primary_status) // Exclude events with null primary_status
    .map(event => ({
        label: event.primary_status,
        date: formatDate(event.created_at),
    })) || [];

    const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleRateClick = (orderItem) => {
        setSelectedProduct(orderItem); // Set the selected product
    };

    const closeFeedback = () => {
        setSelectedProduct(null); // Clear the selected product
    };

    const handleSubmit = useCallback(() => {
        setSelectedProduct(null);
    });

    const hasReview = (orderItemId) => {
        return reviews.some(review => review.item_id === orderItemId);
    };

    // Add this function to check if rating is allowed
    const canRate = (orderItemId) => {
        return currentOrder?.status === 'delivered' && !hasReview(orderItemId);
    };

    return (
        <AppLayout>
            <div className='flex flex-col px-4 mt-16 py-4 gap-4'>
                <div className='flex items-center gap-4'>
                    <Link href="/profile" className="px-4 flex-grow">
                        ← Back to Orders
                    </Link>
                    <div className="flex flex-col items-end">
                        <p>Order ID: {currentOrderId}</p>
                        <p className="text-sm text-gray-600">Order time: {formatDate(currentOrder?.created_at)}</p>
                    </div>
                    <p className='text-2xl font-light'> | </p>
                    <p className='pr-4'>status: <span className='font-bold'>order {currentOrder?.status || 'N/A'}</span></p>
                </div>
                <div className="flex justify-between px-4 text-sm text-gray-600">
                    <p>{orderItems?.length || 0} items: {currentOrder?.formatted_total}</p>
                    <p>Delivery: {currentOrder?.delivery_fee ? currentOrder?.formatted_delivery_fee : '---'}</p>
                    {currentOrder?.discount > 0 && (
                        <p>Discount: {currentOrder?.formatted_discount}</p>
                    )}
                </div>
            </div>

            <hr className="border-gray-300"></hr>

            {/* Progress Bar */}
            <div className="p-8">
                <div className="flex items-center">
                    {progressStages.map((stage, index) => (
                        <div key={index} className="flex flex-col items-center w-1/4">
                            {/* Circle */}
                            <div
                                className={`w-10 h-10 rounded-full border-4 ${stage.date !== '---' ? 'border-gray-800' : 'border-gray-300'
                                    } flex items-center justify-center bg-white`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full ${stage.date !== '---' ? 'bg-gray-800' : 'bg-gray-300'
                                        }`}
                                ></div>
                            </div>
                            {/* Label */}
                            <p className="text-sm mt-4 text-center font-medium">{stage.label}</p>
                            <p className="text-xs text-gray-500">{stage.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <hr className="border-gray-300"></hr>
<div className="p-8">
    {currentOrder?.paid === 'unpaid' && (
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Upload Payment Proof</h3>
            <p className="text-gray-600 text-lg mb-4">Please upload the payment proof for your order to proceed with the verification process.</p>
            <form onSubmit={formHandleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
                <div>
                    <input
                        type="file"
                        {...register("payment_proof", { required: "Payment proof is required." })}
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-800 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-between items-center">
                    {isUploading ? (
                        <button
                            type="button"
                            disabled
                            className="bg-gray-500 text-white py-2 px-6 rounded-lg w-full flex justify-center items-center space-x-2 cursor-not-allowed"
                        >
                            <svg
                                className="animate-spin w-5 h-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <span>Uploading...</span>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 transition duration-300"
                        >
                            Upload Payment Proof
                        </button>
                    )}
                </div>
            </form>
        </div>
    )}
</div>



            <div className='p-4 bg-gray-100'>
                <div className='flex px-4 py-2 items-center '>
                    <p className='flex-grow'>Thank you for using The Fresh Connections</p>
                    <button 
                        onClick={() => {
                            router.post(`/orders/${currentOrder.id}/buy-again`);
                        }}
                        className='text-white px-8 py-2 rounded-sm bg-green-900 w-36 hover:bg-green-800 transition duration-200'
                    >
                        Buy Again
                    </button>
                </div>
                <hr className="border-gray-300"></hr>
                <div className='flex flex-col gap-2 justify-end text-center items-end px-4 py-2'>
                    <Link className='text-white px-4 py-2 rounded-sm bg-gray-300 w-36'>Contact Seller</Link>
                    <Link className='text-white px-4 py-2 rounded-sm bg-gray-300 w-36'>View E-Invoice</Link>
                </div>
            </div>
            <hr className="border-gray-500 border-dashed"></hr>
            <div className='p-4 flex'>
                <div className='border-r p-4 border-gray-300 flex-grow break-words '>
                    <h3 className='py-4 text-lg font-bold'>Delivery Address</h3>
                    <p>{currentOrder.first_name || ""} {currentOrder.last_name || ""}</p>
                    <p className='pb-2'>{currentOrder.mobile_number}</p>
                    <p className='font-light'>{currentOrder.address}</p>
                    <p className='font-light'>{currentOrder.city}, {currentOrder.region}</p>
                </div>
                <div className='py-4 px-8 flex-grow'>
                    <h3 className='py-4 text-lg'>Status Summary</h3>
                    <ul className='space-y-4'>
                        {currentOrder?.order_tracking?.map((event, index) => (
                            <li key={index} className="flex items-start gap-4">
                                {/* Timeline Indicator */}
                                {/* <div className="relative flex items-center">
                                    <div
                                        className={`${
                                            event.primary_status ? "w-4 h-4" : "w-2 h-2"
                                        } bg-gray-800 rounded-full border`}
                                    ></div>
                                    {index !== currentOrder.order_tracking.length - 1 && (
                                        <div className="absolute top-4 left-1 w-0.5 h-full bg-gray-300"></div>
                                    )}
                                </div> */}

                                {/* Event Details */}
                                <div className="border w-full px-4 py-2 rounded-lg bg-gray-100 grid grid-cols-2">
                                    <div>
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
                                    </div>
                                    {event.created_at && (
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="text-xs text-gray-400">{formatDate(event.created_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='text-gray-500 p-4 flex justify-end items-start'>
                    <p className='text-right'>Fresh Express</p>
                </div>
            </div>
            <hr className="border-gray-300"></hr>
            <div className='p-4'>
                {orderItems && orderItems.length > 0 ? (
                    orderItems.map((orderItem) => (
                        <div key={orderItem.id}>
                            <div className="flex items-center gap-4 p-4">
                                <div className='w-16 h-16 bg-gray-300 border rounded-lg overflow-hidden'>
                                    {orderItem.product ? (
                                        <img
                                            src={orderItem.product.product_image ? `/storage/${orderItem.product.product_image}` : '/placeholder-image.png'}
                                            alt={orderItem.product?.product_name || 'Product Image'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">No product available</p>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-medium">{orderItem.product?.product_name || 'Product name not available'} ({orderItem.product?.product_serving || 'N/A'})</p>
                                    <p className="text-sm text-gray-500">Quantity: {orderItem.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* <button
                                        onClick={() => handleBuyAgain(orderItem)}
                                        className="bg-green-900 text-white px-4 py-2 rounded-sm hover:bg-black transition-colors"
                                    >
                                        Buy Again
                                    </button> */}
                                    <p className='text-sm font-light'>category: {orderItem.product?.category || 'N/A'}</p>
                                    <p className="text-sm font-light">x{orderItem.quantity || 0}</p>
                                </div>
                                                                <div className='flex-grow lg:pr-16 justify-end'>
                                    <p className='text-end'>{orderItem.formatted_total}</p>
                                </div>
                                <Button
                                    onClick={() => {
                                        if (hasReview(orderItem.id)) {
                                            toast.error('You have already rated this product');
                                        } else if (currentOrder?.status !== 'delivered') {
                                            toast.error('You can only rate delivered orders');
                                        } else {
                                            handleRateClick(orderItem);
                                        }
                                    }}
                                    className={`text-sm font-light text-center w-20 ${
                                        !canRate(orderItem.id) 
                                            ? 'bg-gray-300 text-white cursor-not-allowed' 
                                            : 'bg-green-900 text-white hover:bg-slate-800 cursor-pointer'
                                    }`}
                                    disabled={!canRate(orderItem.id)}
                                >
                                    rate
                                </Button>
                            </div>
                            <hr className="border-gray-300 mx-4"></hr>
                        </div>
                    ))
                ) : (
                    <p className="text-red-500">No order items found.</p>
                )}
            </div>

            {/* Product Feedback Modal */}
            {selectedProduct && (
                <ProductFeedback 
                    orderItem={selectedProduct}
                    open={true}
                    onUpdate={handleSubmit}
                    onClose={closeFeedback}
                />
            )}

            <div className='flex p-4'>
                <div className=' w-2/3 text-end px-4 space-y-2 font-light text-sm mb-16'>
                    <p>Items Subtotal</p>
                    <p>Delivery Fee</p>
                    <p>Discount</p>
                    <p className='font-bold text-base'>Order Total</p>
                    <p>Payment Method</p>
                </div>
                <div className=' w-1/3 text-end px-4 space-y-2 font-light text-sm lg:mr-16'>
                    <p>{currentOrder.formatted_subtotal}</p>
                    <p>{currentOrder.delivery_fee ? currentOrder.formatted_delivery_fee : '---'}</p>
                    <p>{currentOrder.discount > 0 ? currentOrder.formatted_discount : '---'}</p>
                    <p className='font-bold text-base'>{currentOrder.formatted_total}</p>
                    <p>{currentOrder.payment_method?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                </div>
            </div>

            <Footer />
        </AppLayout>
    );
}