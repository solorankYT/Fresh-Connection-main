import AppLayout from '@/resources/js/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import Footer from '../Components/Footer';
import toast from 'react-hot-toast';


export default function Home() {
    const { featuredProducts } = usePage().props; // ✅ Fetch from backend
    const scrollRef = useRef(null);
    const [quantities, setQuantities] = useState({});

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8; // Adjust for smooth scrolling

            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

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

        router.post("/cart/add", { product_id: productId, quantity }, {
            preserveScroll: true,
            onSuccess: () => toast.success("Product added to cart!"),
        });
    }

    return (
        <AppLayout>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white flex flex-col md:grid md:grid-cols-2 items-center"
                style={{ backgroundImage: "url('/images/hero_section_bg.avif')" }}
            >
                {/* Background overlay for left content */}
                <div className="absolute inset-0 bg-black opacity-35"></div>
                {/* Left side content with background overlay */}
                <div className="relative px-8 md:px-16 py-12 h-auto md:h-[360px] flex flex-col justify-center">

                    {/* Content */}
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl">The Fresh</h2>
                        <h1 className="text-4xl md:text-5xl font-bold">Connection</h1>
                        <p className="text-md md:text-lg mt-8">
                            Your trusted partner for fresh and quality produce delivered straight to your door.
                        </p>
                    </div>
                </div>

                {/* Right side button at the lower right */}
                <div className="p-6 md:p-8 h-auto md:h-[360px] flex justify-end items-end z-50">
                    <Link href="/products"
                        className="px-8 py-2 text-md md:text-lg bg-green-900 hover:bg-green-600 text-white rounded-lg transition-all">
                        All products
                    </Link>
                </div>
            </section>



            {/* Featured Products */}
            <section className="max-w-7xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center">Featured Products</h2>

                <div className="relative mt-8">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Scrollable Product List */}
                    <div
                        ref={scrollRef}
                        className="flex gap-12 overflow-x-auto scrollbar-hide scroll-smooth px-8"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {featuredProducts && featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <div key={product.product_id} className=" duration-300 ease-in-out mt-4 p-4 min-h-80 max-w-32 flex flex-col justify-between hover:shadow hover:scale-110 transition-all rounded-lg">
                                    {/* Product Image */}
                                    <Link href={`/item/${product.product_id}`} className=''>
                                        <div
                                            className="w-full h-24 max-w-24 min-w-24 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                                            <img src={
                                                product.product_image
                                                    ? `/storage/${product.product_image}`
                                                    : "/placeholder-image.png"
                                            } alt={product.product_name} className="w-full h-full object-cover rounded-lg" />
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
                            <p className="text-center text-gray-500 col-span-full">No featured products found.</p>
                        )}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>


            {/* Promo Section */}
            <section
                className="relative bg-cover bg-center text-white flex flex-col md:grid md:grid-cols-2 items-center"
                style={{ backgroundImage: "url('/images/promo-section_winter.avif')" }}
            >
                {/* Background overlay for full section */}
                <div className="absolute inset-0 bg-black opacity-50"></div>

                {/* Left side content */}
                <div className="relative px-8 md:px-16 py-12 h-auto md:h-[360px] flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold">Winter Deals</h1>
                    <h2 className="text-2xl md:text-3xl px-2">Buy 1 take 1 Promo</h2>
                    <p className="text-md md:text-lg mt-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                    </p>
                </div>

                {/* Right side (gray background) */}
                <div className="relative h-auto md:h-[360px] flex flex-grow">
                    <div className="w-1/16"></div>
                    <div className="w-13/32  bg-cover bg-center" style={{ backgroundImage: "url('/images/deals_meat.avif')" }}></div>
                    <div className="w-1/16"></div>
                    <div className="w-13/32  bg-cover bg-center" style={{ backgroundImage: "url('/images/deals_fish.avif')" }} ></div>
                    <div className="w-1/16"></div>
                </div>
            </section>


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


            {/* Thumbnail Section */}
            <section>
                <div className="bg-gray-300 h-auto md:h-[360px] flex flex-grow">
                    <div className="w-45/192 bg-cover bg-center" style={{ backgroundImage: "url('/images/thumbnail/first.avif')" }}></div>
                    <div className="w-1/48 bg-gray-50"></div>
                    <div className="w-45/192 bg-cover bg-center" style={{ backgroundImage: "url('/images/thumbnail/second.avif')" }}></div>
                    <div className="w-1/48 bg-gray-50"></div>
                    <div className="w-45/192 bg-cover bg-center" style={{ backgroundImage: "url('/images/thumbnail/3rd.avif')" }}></div>
                    <div className="w-1/48 bg-gray-50"></div>
                    <div className="w-45/192 bg-cover bg-center" style={{ backgroundImage: "url('/images/thumbnail/fourth.avif')" }}></div>
                </div>
            </section>


            {/* Testimonials */}
            <section className="max-w-7xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center">What Our Customers Say</h2>
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                    {Array(3).fill().map((_, index) => (
                        <div key={index} className="bg-white shadow-md p-6 rounded-lg text-center hover:shadow-xl transition-all">
                            <p className="text-gray-600 italic">"Amazing quality and fast delivery!"</p>
                            <h4 className="mt-4 font-bold text-gray-700">Customer {index + 1}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </AppLayout>
    );
}
