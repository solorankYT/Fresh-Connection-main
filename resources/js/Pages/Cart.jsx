import AppLayout from '@/resources/js/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '@/resources/js/Components/Footer';
import { Button, buttonVariants } from "@/components/ui/button";
import toast from 'react-hot-toast';
import axios from 'axios';





export default function Cart() {
    const { cartItems, products, activePromotion: initialPromotion } = usePage().props;

    const subtotal = cartItems.reduce((acc, cart) => {
        return acc + (cart.product ? cart.quantity * cart.product.final_price : 0);
    }, 0).toFixed(2);

    const [quantities, setQuantities] = useState({});
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [activePromo, setActivePromo] = useState(initialPromotion);

    useEffect(() => {
        setActivePromo(initialPromotion);
    }, [initialPromotion]);

    // Function to calculate total after discount
    const calculateTotal = () => {
        try {
            if (!activePromo) return subtotal;

            const subtotalNum = parseFloat(subtotal);
            if (isNaN(subtotalNum)) return subtotal;
            
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

    // Function to handle applying promotion code
    const handleApplyPromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoError('Please enter a promotion code');
            return;
        }

        setIsApplyingPromo(true);
        setPromoError('');

        try {
            console.log('Attempting to apply promotion code:', promoCode);
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
            
            const response = await axios.post('/cart/apply-promo', 
                { code: promoCode },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    }
                }
            );
            
            console.log('Promotion response:', response.data);
            if (response.data.promotion) {
                setActivePromo(response.data.promotion);
                setPromoCode('');
                toast.success(response.data.message || 'Promotion code applied successfully!');
                
                // Force page refresh to update cart totals
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

    // Function to handle removing promotion code
    const handleRemovePromoCode = () => {
        fetch('/cart/remove-promo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(response => response.json())
        .then(data => {
            setActivePromo(null);
            toast.success('Promotion code removed');
        })
        .catch(error => {
            console.error('Error:', error);
            toast.error('Failed to remove promotion code');
        });
    };

    // Handle quantity change
    const handleQuantityChange = (id, amount) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + amount)
        }));
    };

    const { auth } = usePage().props; // Get user authentication status
    const handleAddToCart = (productId, quantity) => {
        if (!auth.user) {
            router.visit("/login"); // Redirect if not logged in
            return;
        }

        console.log("Adding to Cart:", { product_id: productId, quantity });


        router.post("/cart/add", { product_id: productId, quantity }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Item added to cart!'),
            onError: (errors) => {
                console.error('Error adding item to cart:', errors);
                toast.error('Failed to add item to cart');
            }
        });
    }


    const removeItem = (id) => {
        router.delete(`/cart/remove/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Item removed successfully');
                toast.success('Item removed from cart!');
            },
            onError: (errors) => {
                console.error('Error removing item:', errors);
            }
        });
    };



    return (
        <AppLayout>
            <div className='mt-20 bg-green-900'>
                <h2 className='p-4 text-3xl text-slate-100 font-semibold text-center'>Your Cart</h2>
            </div>

            <section>
                <div className='flex px-4 py-8 text-center font-light lg:mx-24 gap-4'>
                    <p className='w-2/5 text-start '>Product</p>
                    <p className='w-1/5 '>Unit Price</p>
                    <p className='w-1/5 '>Quantity</p>
                    <p className='w-1/5 text-end'>Total Price</p>
                </div>

                <hr className="border-gray-300"></hr>

                <div className='mt-4'>
                    {cartItems.length > 0 ? (
                        cartItems.map((cart) => (
                            <div className='lg:mx-24' key={cart.id}>
                                <div className='flex px-4 py-4 pt-8 text-center items-center gap-4'>
                                    <div className='w-2/5 flex items-center'>
                                        <Link href={`/item/${cart.product.product_id}`} className='w-1/3 hover:scale-110 transition-all'>
                                            <div >
                                                <img src={cart.product.product_image ? `/storage/${cart.product.product_image}` : "placeholder-image.png"} alt={cart.product.product_name} className='bg-gray-100 rounded-lg w-24 h-24 object-cover' />
                                            </div>
                                        </Link>
                                        <div className='w-2/3 p-2 text-start'>
                                            <h3 className='text-lg'>{cart.product.product_name}
                                                <span> ({cart.product.product_serving})</span>
                                            </h3>
                                            <button onClick={() => removeItem(cart.id)}
                                                className='text-sm font-light text-red-900 hover:underline hover:cursor-pointer'>remove</button>
                                        </div>
                                    </div>

                                    <p className='w-1/5 p-2'>₱{cart.product.final_price}</p>
                                    <p className='w-1/5 p-2'>{cart.quantity}</p>
                                    <p className='w-1/5 p-2 text-end font-semibold'>₱{cart.product ? (cart.quantity * cart.product.final_price).toFixed(2) : "N/A"}</p>
                                </div>
                                <hr className="border-gray-300"></hr>
                            </div>
                        ))
                    ) : (
                        <p className='w-full py-2 text-center text-gray-300'>No items found</p>
                    )}
                </div>

                <div className='lg:mx-24 mt-8 px-4 mb-16'>
                    {/* Promotion Code Section */}
                    <div className='mb-6 flex justify-end items-center gap-4'>
                        <div className='flex flex-col items-end gap-2'>
                            <div className='flex gap-2'>
                                <input
                                    type="text"
                                    placeholder="Enter promotion code"
                                    className="border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <Button
                                    onClick={handleApplyPromoCode}
                                    disabled={isApplyingPromo}
                                    variant="outline"
                                    className="text-sm"
                                >
                                    {isApplyingPromo ? 'Applying...' : 'Apply'}
                                </Button>
                            </div>
                            {promoError && (
                                <p className="text-red-500 text-sm">{promoError}</p>
                            )}
                            {activePromo && (
                                <div className="flex items-center gap-2">
                                    <p className="text-green-600 text-sm">
                                        Code <span className="font-semibold">{activePromo.code}</span> applied!
                                    </p>
                                    <button
                                        onClick={handleRemovePromoCode}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className='text-end'>
                        <p className='font-light py-2'>Subtotal: <span className='pl-12 text-xl font-bold'>₱{subtotal}</span></p>
                        {activePromo && (
                            <>
                                <p className='font-light py-2 text-green-600'>
                                    Promotion Applied: <span className='pl-12 text-xl font-bold'>
                                        {activePromo.name}
                                    </span>
                                </p>
                                <p className='font-light py-2 text-green-600'>
                                    Discount: <span className='pl-12 text-xl font-bold'>
                                        -{activePromo.discount_type === 'percentage' 
                                            ? `${activePromo.discount_value}%` 
                                            : `₱${parseFloat(activePromo.discount_value).toFixed(2)}`}
                                        {" "}
                                        ({activePromo.discount_type === 'percentage' 
                                            ? `₱${(parseFloat(subtotal) * activePromo.discount_value / 100).toFixed(2)}`
                                            : ''})
                                    </span>
                                </p>
                            </>
                        )}
                        <p className='font-light py-2 border-t border-gray-200 mt-2'>
                            Total: <span className='pl-12 text-2xl font-bold text-green-900'>
                                ₱{calculateTotal()}
                            </span>
                        </p>
                        <p className='font-extralight text-gray-500 py-2'>Tax included and delivery calculated at checkout</p>

                        {cartItems.length > 0 ? (
                            <Button asChild
                                className="text-slate-100 text-lg rounded-lg py-6 px-16 bg-green-900 hover:cursor-pointer transition-all hover:bg-gray-800"
                            > 
                                <Link href="/checkout">CHECKOUT</Link>
                            </Button>
                        ) : (
                            <Button
                                className="text-slate-100 text-lg rounded-lg py-6 px-16 bg-gray-300 transition-all"
                            >
                                CHECKOUT
                            </Button>
                        )}
                    </div>
                </div>
                <hr className="border-gray-300"></hr>

            </section>

            {/* Product List */}
            <section className='py-12 lg:px-20 px-4'>
                <h3 className="text-2xl text-gray-800">You may also like </h3>
                <div className="flex justify-center">
                    <div className=" grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-12 max-w-6xl ">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.product_id} className="mt-4 p-4 min-h-80 max-w-32 flex flex-col justify-between hover:shadow hover:scale-110 transition-all rounded-lg">

                                    {/* Product Image */}
                                    <Link href={`/item/${product.product_id}`}>
                                        <div className="w-full h-24 max-w-24 min-w-24 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                                            <img src={product.product_image ? `/storage/${product.product_image}` : "placeholder-image.png"} alt={product.product_name} className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <h3 className="text-lg pl-1">{product.product_name}</h3>
                                    <p className="text-gray-500 pl-1">{product.product_serving}</p>
                                    <p className="text-lg pl-1">₱{Number(product.final_price).toFixed(2)}</p>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleQuantityChange(product.product_id, -1)} className="p-2 rounded-md w-1/3 flex justify-center items-center">
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-semibold w-1/3 text-center">
                                            {quantities[product.product_id] || 1}
                                        </span>
                                        <button onClick={() => handleQuantityChange(product.product_id, 1)} className="p-2 w-1/3 flex justify-center items-center">
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button onClick={() => handleAddToCart(product.product_id, quantities[product.product_id] || 1)}
                                        className="w-full bg-green-900 text-white py-1 rounded-md hover:bg-green-700 transition text-sm">
                                        Add to Cart
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">No products found.</p>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </AppLayout>
    )
}