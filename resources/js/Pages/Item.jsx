import AppLayout from "@/resources/js/Layouts/AppLayout";
import { Link, router, usePage } from '@inertiajs/react';
import { Minus, Plus, Search } from 'lucide-react';
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline";
import Footer from '../Components/Footer';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ReviewForm } from '@/components/ui/review-form';
import { ReviewList } from '@/components/ui/review-list';

export default function Item({ product, products, reviews }) {
    const { auth } = usePage().props; // Get user authentication status
    const [quantities, setQuantities] = useState({});
    const [filteredReviews, setFilteredReviews] = useState(reviews); // State for filtered reviews
    const [selectedRating, setSelectedRating] = useState(null); // State for selected star rating

    // Handle quantity change
    const handleQuantityChange = (id, amount) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + amount)
        }));
    };

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
    };

    const buyItem = (productId, quantity) => {
        if (!auth.user) {
            router.visit("/login"); // Redirect if not logged in
            return;
        }

        console.log("Adding to Cart:", { product_id: productId, quantity });

        router.post("/cart/add", { product_id: productId, quantity }, {
            preserveScroll: true,
            onSuccess: () => router.visit("/cart"),
        });
    };

    const filterReviews = (rating) => {
        setSelectedRating(rating); // Update the selected rating

        if (rating === null) {
            // Show all reviews if "All" is selected
            setFilteredReviews(reviews);
        } else {
            // Filter reviews by the selected rating
            const filtered = reviews.filter((review) => review.rating === rating);
            setFilteredReviews(filtered);
        }
    };

    return (
        <AppLayout>
            {/* Product Image Section */}
            <section>
                <div className="relative bg-cover bg-center text-white flex flex-col h-[150px] items-center"
                    style={{ backgroundImage: "url('/images/hero_section_bg.avif')" }}>
                </div>

                {/* Container with Centered Items */}
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center my-4 lg:px-20 md:px-12 px-4">

                    {/* Breadcrumb Navigation */}
                    <nav className="text-gray-700 flex items-center gap-2 text-center">
                        <Link href="/" className="text-gray-700 hover:underline">Home</Link>
                        <span>/</span>
                        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-700 hover:underline">
                            {product.category}
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-xl">{product.product_name}</span>
                    </nav>

                    {/* Search Bar */}
                    <div className="flex items-center border rounded-2xl px-3 py-1 bg-white">
                        <input type="text" placeholder="Search..." className="outline-none bg-white text-gray-700 w-full px-2 py-1"
                        />
                        <Search className="text-gray-500" size={18} />
                    </div>
                </div>
            </section>
            <hr className="border-gray-300"></hr>

            {/* Item Section */}
            <section className='mt-20 mb-12'>
                <div className="lg:px-20 md:px-12 px-4 flex">
                    <div className="w-1/3 flex justify-end lg:pr-12 md:pr-8">
                        {/* Product Image */}
                        <div className="h-42 w-36 lg:w-56 lg:h-64 md:w-48 md:h-56 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                            <img src={product.product_image ? `/storage/${product.product_image}` : "placeholder-image.png"} alt={product.product_name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                    </div>

                    <div className="w-2/3 pl-4">
                        {/* Product Info */}
                        <h3 className="text-2xl my-2  font-bold text-green-900">{product.product_name}
                            <span> (</span>
                            <span className="">{product.product_serving}</span>
                            <span>)</span></h3>
                        <p className="text-lg font-semibold">₱{Number(product.final_price).toFixed(2)}</p>
                        <p className="md:pt-8 text-sm pt-4">{product.product_description}</p>
                    </div>
                </div>

                {/* Add to Cart Section */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-gray-300 px-3 py-1 rounded w-28">
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

                        <button className="bg-green-900  text-white px-4 py-2 rounded whitespace-nowrap w-64 hover:cursor-pointer"
                            onClick={() => handleAddToCart(product.product_id, quantities[product.product_id] || 1)}>
                            Add to Cart
                        </button>
                    </div>

                    {/* More Veggies & Buy Section */}
                    <div className="flex items-center gap-4  w-96">
                        <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                            <button className="border border-gray-400 px-4 py-2 rounded items-center gap-1 w-64 hover:cursor-pointer">
                                ← More {product.category}
                            </button>
                        </Link>
                        <button onClick={() => buyItem(product.product_id, quantities[product.product_id] || 1)}
                            className="border border-gray-400 px-4 py-2 font-bold rounded w-32 hover:cursor-pointer">
                            Buy
                        </button>
                    </div>
                </div>
            </section>

            <hr className="border-gray-300"></hr>

            {/* Reviews Section */}
            <section className="py-8 lg:px-20 px-4">
                <h3 className="text-2xl font-semibold text-gray-800 pb-4">Reviews & Ratings</h3>

                {/* Add review form for authenticated users who have purchased the product */}
                {auth.user && product.purchased && !product.hasReviewed && (
                    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold mb-4">Write a Review</h4>
                        <ReviewForm
                            productId={product.product_id}
                            onSuccess={() => {
                                router.reload({ only: ['reviews', 'product'] });
                            }}
                        />
                    </div>
                )}
                <div className="bg-gray-200 text-sm p-4 flex rounded-md">
                    <div className="flex flex-col items-center justify-center gap-2 text-center w-1/4">
                        <div>
                            <p>
                                <span className="text-lg font-bold">{product.product_rating}</span> out of 5
                            </p>
                        </div>
                        <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                                i < Math.floor(product.product_rating) ? (
                                    <SolidStarIcon key={i} className="h-5 w-5 text-yellow-500" />
                                ) : (
                                    <OutlineStarIcon key={i} className="h-5 w-5 text-gray-400" />
                                )
                            ))}
                        </div>
                    </div>

                    {/* Star Filter Buttons */}
                    <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-3 gap-2 text-center w-3/4">
                        <button
                            className={`rounded-sm border border-gray-300 px-2 py-1 ${
                                selectedRating === null ? "bg-green-900 text-white" : "bg-white text-gray-500"
                            }`}
                            onClick={() => filterReviews(null)} // Show all reviews
                        >
                            All
                        </button>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <button
                                key={rating}
                                className={`rounded-sm border border-gray-300 px-2 py-1 ${
                                    selectedRating === rating ? "bg-green-900 text-white" : "bg-white text-gray-500"
                                }`}
                                onClick={() => filterReviews(rating)}
                                aria-label={`Filter by ${rating} stars`}>
                                {rating} Stars
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="mt-8">
                    {filteredReviews.length > 0 ? (
                        <ReviewList
                            reviews={filteredReviews}
                            className="space-y-4"
                        />
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            No reviews found for the selected rating.
                        </p>
                    )}
                </div>
            </section>

            <hr className="border-gray-300"></hr>

            {/* Product List */}
            <section className='py-12 lg:px-20 px-4'>
                <h3 className="text-2xl text-gray-800">You may also like </h3>
                <div className="flex justify-center">
                    <div className=" grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-12 max-w-6xl ">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.product_id} className="mt-4 p-4 min-h-80 max-w-32 flex flex-col justify-between hover:shadow hover:scale-110 transition-all rounded-lg">

                                    {/* Product Image */}
                                    <Link href={`/item/${product.product_id}`} className=''>
                                        <div className="w-full h-24 max-w-24 min-w-24 bg-gray-300 rounded-sm mb-3 flex items-center justify-center">
                                            <img src={product.product_image ? `/storage/${product.product_image}` : "/placeholder-image.png"} alt={product.product_name} className="w-full h-full object-cover rounded-sm" />
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

            <hr className="border-gray-300"></hr>

            {/* Shop by Category */}
            <section className="py-16 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-800 text-center">Shop by Category</h2>
                <div className="flex flex-wrap justify-center gap-6 mt-8 max-w-4xl">
                    {[
                        { name: "Fruits", image: "/images/categories/fruits.avif" },
                        { name: "Vegetables", image: "/images/categories/vegetables.avif" },
                        { name: "Seafood", image: "/images/categories/seafood.avif" },
                        { name: "Meat", image: "/images/categories/meat.avif" },
                        { name: "Rice & Grains", image: "/images/categories/rice.avif" },
                        { name: "Herbs & Spices", image: "/images/categories/spices.avif" },
                        { name: "Beverages", image: "/images/categories/beverages.avif" },
                        { name: "Other Items", image: "/images/categories/others.avif" }
                    ].map((category, index) => (
                        <Link
                            key={index}
                            href={`/products?category=${encodeURIComponent(category.name)}`}
                            className="relative flex items-center justify-center px-6 py-4 rounded-lg shadow-md text-md h-[200px] w-[200px] hover:bg-green-900 hover:text-white transition-all text-center text-white font-bold"
                            style={{
                                backgroundImage: `url(${category.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-30 hover:opacity-50 transition-opacity rounded-lg"></div>
                            <span className="relative z-10">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </AppLayout>
    );
}
