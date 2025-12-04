import AppLayout from '@/resources/js/Layouts/AppLayout';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { router, usePage } from "@inertiajs/react";
import Footer from '../Components/Footer';
import { GoogleMap, useLoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";

const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "0.5rem",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    transition: "box-shadow 0.3s ease",
};

const center = {
    lat: 14.5995, // Center of Metro Manila
    lng: 120.9842,
};

// Define Metro Manila bounds
const metroManilaBounds = {
    north: 14.9011, // Northernmost point
    south: 14.3961, // Southernmost point
    east: 121.1438, // Easternmost point
    west: 120.8569, // Westernmost point
};

const libraries = ["places"];

const checkoutSchema = z.object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    address: z.string().min(5, "Address is required"),
    barangay: z.string().min(2, "Barangay is required"),
    pin_address: z.string().optional(),
    zip_code: z.string().min(4, "Invalid ZIP code"), // Ensure it's a string
    city: z.string().min(2, "City is required"),
    region: z.string().min(2, "Region is required"),
    mobile_number: z.string().min(10, "Invalid mobile number").max(15, "Too long"), // Ensure it's a string
    payment_method: z.enum(["credit_card", "gcash_or_maya", "cod"], {
        required_error: "Select a payment method",
    }),
    card_number: z
        .string()
        .regex(/^\d{16}$/, "Card number must be 16 digits")
        .optional(),
    expiration_date: z.string().optional(),
    security_code: z.string().optional(),
    name: z.string().optional(),
    account_number: z.string().optional(),
    use_shipping_as_billing: z.boolean().optional(),
});

const regions = [
    "Ilocos Region",
    "Cagayan Valley",
    "Central Luzon",
    "CALABARZON",
    "MIMAROPA",
    "Bicol Region",
    "Western Visayas",
    "Central Visayas",
    "Eastern Visayas",
    "Zamboanga Peninsula",
    "Northern Mindanao",
    "Davao Region",
    "SOCCSKSARGEN",
    "Caraga",
    "Cordillera Administrative Region (CAR)",
    "National Capital Region (NCR)",
    "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)"
];

export default function Checkout() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GoogleMaps_API_Key,
        libraries, // Use the constant defined outside the component
    });


    const [selectedLocation, setSelectedLocation] = useState(null); // Store coordinates instead of a string
    const [selectedAddress, setSelectedAddress] = useState(""); // Store the address
    const [geocoder, setGeocoder] = useState(null); // Store the Geocoder instance
    const [markerPosition, setMarkerPosition] = useState(null); // Store marker position
    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);
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
    

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setSelectedAddress(place.formatted_address); // Store the address
                setMarkerPosition({ lat, lng }); // Update marker position

                // Center the map on the selected location
                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(15);
                }
            }
        }
    };

    const handleAddressInputChange = (e) => {
        const address = e.target.value;
        setSelectedAddress(address);

        if (geocoder && mapRef.current) {
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]?.geometry?.location) {
                    const location = results[0].geometry.location;
                    mapRef.current.panTo(location);
                    mapRef.current.setZoom(15);
                }
            });
        }
    };

    const handleMapClick = (event) => {
        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();

        // Update the marker position
        setMarkerPosition({ lat: clickedLat, lng: clickedLng });

        // Use the geocoder to get the address from the coordinates
        if (geocoder) {
            geocoder.geocode({ location: { lat: clickedLat, lng: clickedLng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const address = results[0].formatted_address;
                    setSelectedAddress(address);
                }
            });
        }
    };

    useEffect(() => {
        if (isLoaded) {
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, [isLoaded]);

    const { cartItems, auth, activePromotion: initialPromotion } = usePage().props;
    const user = auth?.user || {}; // Fallback to an empty object if no user is logged in

    // Promotion state
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [activePromo, setActivePromo] = useState(initialPromotion);

    useEffect(() => {
        setActivePromo(initialPromotion);
    }, [initialPromotion]);

    const handleApplyPromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoError('Please enter a promotion code');
            return;
        }

        setIsApplyingPromo(true);
        setPromoError('');

        try {
            const response = await axios.post('/checkout/apply-promo', { code: promoCode });
            
            if (response.data.promotion) {
                setActivePromo(response.data.promotion);
                setPromoCode('');
                toast.success(response.data.message || 'Promotion code applied successfully!');
                window.location.reload();
            } else {
                setPromoError(response.data.message || 'Invalid promotion code');
                toast.error(response.data.message || 'Failed to apply promotion code');
            }
        } catch (error) {
            console.error('Error applying promotion:', error.response?.data || error);
            setPromoError(error.response?.data?.message || 'Error applying promotion code');
            toast.error(error.response?.data?.message || 'Failed to apply promotion code');
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleRemovePromo = async () => {
        try {
            await axios.post('/checkout/remove-promo');
            setActivePromo(null);
            toast.success('Promotion removed successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error removing promotion:', error);
            toast.error('Failed to remove promotion');
        }
    };

    const calculateTotal = () => {
        try {
            const subtotalNum = parseFloat(subtotal);
            if (!activePromo || isNaN(subtotalNum)) return subtotal;
            
            if (activePromo.minimum_purchase && subtotalNum < parseFloat(activePromo.minimum_purchase)) {
                return subtotalNum.toFixed(2);
            }

            let discount = 0;
            const discountValue = parseFloat(activePromo.discount_value);
            
            if (isNaN(discountValue)) return subtotal;

            if (activePromo.discount_type === 'percentage') {
                discount = subtotalNum * (discountValue / 100);
            } else {
                discount = discountValue;
            }

            return Math.max(0, subtotalNum - discount).toFixed(2);
        } catch (error) {
            console.error('Error calculating total:', error);
            return subtotal;
        }
    };

    const subtotal = cartItems.reduce((acc, cart) => {
        return acc + (cart.product ? cart.quantity * cart.product.final_price : 0);
    }, 0).toFixed(2);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            address: user.street_address || "",
            barangay: user.barangay || "",
            pin_address: "", // Optional field
            zip_code: user.postal_code ? String(user.postal_code) : "", // Convert to string
            city: user.city || "",
            region: user.state || "",
            mobile_number: user.phone_number ? String(user.phone_number) : "", // Convert to string
        },
    });

    const selectedPayment = watch("payment_method");    

    const onSubmit = (data) => {
         let payment_status = 'pending';
            if (data.payment_method === 'cod') {
            payment_status = 'approved';
    }
        const submissionData = {
            ...data,
            payment_status: payment_status,
            total_amount: calculateTotal(), // Include the discounted total
            subtotal: subtotal, // Include original subtotal
            promotion_id: activePromo ? activePromo.id : null, // Include promotion ID if one is applied
            discount_amount: activePromo ? (subtotal - calculateTotal()) : 0, // Calculate the discount amount
        };

        router.post("/checkout", submissionData);
    };


    const PaymentOption = ({ value, label, children }) => (
        <div>
            <label className={`flex items-center px-4 py-4 border border-gray-300 ${selectedPayment === value ? "bg-green-900 text-white" : ""}`}>
                <input
                    type="radio"
                    value={value}
                    {...register("payment_method")}
                    className="mr-2 form-radio h-4 w-4 text-green-900"
                />
                {label}
            </label>
            {selectedPayment === value && <div className="py-4 space-y-2 px-4">{children}</div>}
        </div>
    );

    return (
        <AppLayout>
            <div className="mt-20 bg-green-900 mb-4">
                <h2 className="p-4 text-3xl text-slate-100 font-semibold text-center">Checkout</h2>
            </div>

            <hr className="border-gray-300"></hr>

            {/* Ensure Google Maps components are only rendered if the script is loaded */}
            {isLoaded ? (
                <section className="my-4 grid lg:grid-cols-2 gap-4">
                    {/* Left Column - Delivery Form */}
                    <div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4 px-8 py-4 border-gray-300 border rounded-sm shadow-md ml-4"
                        >
                            <h2 className="text-xl font-bold">Delivery</h2>
                            <div className="grid grid-col-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">First Name</label>
                                    <input
                                        {...register("first_name")}
                                        placeholder="e.g., John"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full"
                                    />
                                    {errors.first_name && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.first_name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Last Name</label>
                                    <input
                                        {...register("last_name")}
                                        placeholder="e.g., Doe"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full"
                                    />
                                    {errors.last_name && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.last_name.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-medium mb-1 block">Region</label>
                                    <input
                                        {...register("region")}
                                        value="National Capital Region (NCR)"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full bg-gray-100"
                                        readOnly
                                    />
                                    {errors.region && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.region.message}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium mb-1 block">ZIP Code</label>
                                    <input
                                        {...register("zip_code")}
                                        placeholder="e.g., 1000"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full"
                                    />
                                    {errors.zip_code && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.zip_code.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">City</label>
                                    <input
                                        {...register("city")}
                                        placeholder="e.g., Manila"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full"
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.city.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-medium mb-1 block">Barangay</label>
                                    <input
                                        {...register("barangay")}
                                        placeholder="Tatalon"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full"
                                    />
                                    {errors.barangay && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.barangay.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-medium mb-1 block">Address</label>
                                    <input
                                        {...register("address")}
                                        placeholder="e.g., 123 Main St, Barangay 1"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.address.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-medium mb-1 block">Mobile Number</label>
                                    <input
                                        {...register("mobile_number")}
                                        placeholder="e.g., 09171234567"
                                        className="border border-gray-300 px-4 py-2 rounded-sm w-full"
                                    />
                                    {errors.mobile_number && (
                                        <p className="text-red-500 text-sm mt-1">*{errors.mobile_number.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="py-4">
                                <h2 className="text-xl font-bold">Payment</h2>
                                <p className="text-xs font-light">All transactions are secure and encrypted.</p>

                                <div className="space-y-0 mt-4 border-x rounded-sm border-gray-300">
                                   <PaymentOption value="credit_card" label="Card">
                                        <div className="p-6 bg-gray-100 border rounded-md">
                                            <h3 className="text-lg font-medium">Bank Transfer Details</h3>
                                            <p className="text-sm text-gray-600 mt-2">Please use the following card details to complete your payment via bank transfer:</p>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm font-medium">Cardholder Name:</div>
                                                    <div className="text-sm font-bold">Pauline Fesalbon</div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm font-medium">Account Number:</div>
                                                    <div className="text-sm font-bold">0680 0610 1162</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 text-xs text-slate-700">
                                                <p>* After completing the transfer, please provide your payment reference number to us for confirmation.</p>
                                            </div>
                                        </div>
                                    </PaymentOption>    


                                    <PaymentOption value="gcash_or_maya" label="Gcash or Maya">
                                        <div className="flex gap-4">
                                            <div>
                                                <label className="text-sm font-medium">GCash</label>
                                                <Card className="w-64 h-64 flex justify-center items-center bg-gray-100 rounded-lg ">
                                                    <CardContent className="relative w-full h-full">
                                                        <img
                                                            src="/images/payment/qr.jpg"
                                                            alt="Thumbnail"
                                                            className="cursor-pointer object-cover rounded-lg"
                                                            onClick={() => openImage("/images/payment/qr.jpg")}
                                                        />
            
                                                        {/* Full-screen Modal (Lightbox) */}
                                                        {imageOpen && (
                                                            <div
                                                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center"
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
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Maya</label>
                                                <Card className="w-64 h-64 flex justify-center items-center bg-gray-100 rounded-lg ">
                                                    <CardContent className="relative w-full h-full">
                                                        <img
                                                            src="/images/payment/qr.jpg"
                                                            alt="Thumbnail"
                                                            className="cursor-pointer object-cover rounded-lg"
                                                            onClick={() => openImage("/images/payment/qr.jpg")}
                                                        />
            
                                                        {/* Full-screen Modal (Lightbox) */}
                                                        {imageOpen && (
                                                            <div
                                                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center"
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
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                        <p className='text-xs text-slate-700'>*Please ensure you have the Gcash or Maya app installed on your device.</p>
                                        <p className='text-xs text-slate-700'>* After completing the transfer, please provide your payment reference number to us for confirmation.</p>
                                    </PaymentOption>

                                    <PaymentOption value="cod" label="Cash on Delivery" />
                                </div>
                                {errors.payment_method && (
                                    <p className="text-red-500 text-sm mt-2">*{errors.payment_method.message}</p>
                                )}
                                <button
                                    type="submit"
                                    className="bg-green-900 text-white py-2 px-4 my-4 rounded-sm w-full hover:bg-black hover:cursor-pointer"
                                >
                                    Pay now
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Items (Cart or Order Summary) */}
                    <div className="px-8 py-4 border-gray-300 border rounded-sm shadow-md mr-4">
                        {/* Promotion Code Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-4">Promotion Code</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter promotion code"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                    onClick={handleApplyPromoCode}
                                    disabled={isApplyingPromo}
                                    className="bg-green-900 text-white px-4 py-2 rounded-sm hover:bg-black disabled:bg-gray-400"
                                >
                                    {isApplyingPromo ? 'Applying...' : 'Apply'}
                                </button>
                            </div>
                            {promoError && (
                                <p className="text-red-500 text-sm mt-2">{promoError}</p>
                            )}
                            {activePromo && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-sm">
                                        <div>
                                            <p className="font-semibold text-green-800">{activePromo.name}</p>
                                            <p className="text-sm text-green-600">
                                                {activePromo.discount_type === 'percentage'
                                                    ? `${activePromo.discount_value}% off`
                                                    : `₱${activePromo.discount_value} off`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleRemovePromo}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Items Section */}
                        <h3 className="text-xl font-bold mb-4">Items</h3>
                        <div>
                            {cartItems.length > 0 ? (
                                cartItems.map((cart) => (
                                    <div className="flex text-center items-center py-2" key={cart.id}>
                                        <div className="relative w-16 h-16 bg-gray-300 rounded-lg">
                                            <img
                                                src={cart.product.product_image ? `/storage/${cart.product.product_image}` : "placeholder-image.png"}
                                                alt={cart.product.product_name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute -top-2 -right-2 bg-green-900 text-white text-xs font-light w-6 h-6 flex items-center justify-center rounded-full">
                                                {cart.quantity}
                                            </div>
                                        </div>
                                        <h3 className="px-4 flex-grow text-start">
                                            {cart.product.product_name}
                                            <span> ({cart.product.product_serving})</span>
                                        </h3>
                                        <p className="text-right font-light">
                                            ₱{cart.product ? parseFloat(cart.quantity * cart.product.final_price).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "N/A"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>error</p>
                            )}
                            <div className="flex">
                                <p className="text-sm font-light flex-grow">Subtotal of {cartItems.length} items</p>
                                <p>₱{parseFloat(subtotal).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            </div>
                            <div className="flex py-1">
                                <p className="text-sm font-light flex-grow">Delivery</p>
                                <p className="text-sm font-light">Enter Shipping Address</p>
                            </div>
                            <div className="flex py-4 mb-4">
                                <p className="text-lg font-bold flex-grow">Total</p>
                                <p className="text-lg font-bold">₱{parseFloat(calculateTotal()).toLocaleString('en-PH', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}</p>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <p>Loading map...</p>
            )}
            <Footer />
        </AppLayout>
    );
}