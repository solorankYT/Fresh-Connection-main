import AppLayout from "@/resources/js/Layouts/AppLayout";
import { Search, Minus, Plus } from "lucide-react";
import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Footer from "../Components/Footer";
import Select from "react-select";
import toast from "react-hot-toast";

export default function Products() {
    const { categories, products, filters } = usePage().props; // Get data from backend

    // State for quantity management
    const [quantities, setQuantities] = useState({});
``
    // State for search query
    const [searchQuery, setSearchQuery] = useState("");

    // Options for react-select
    const categoryOptions = [{ value: "All Products", label: "All Products" }, ...(categories?.map(category => ({ value: category, label: category })) || [])];
    const sortOptions = [
        { value: "A-Z", label: "A-Z" },
        { value: "Z-A", label: "Z-A" },
        { value: "Price: Low to High", label: "Price: Low to High" },
        { value: "Price: High to Low", label: "Price: High to Low" }
    ];

    // Dynamically filter products based on search query
    const filteredProducts = products.data
    .filter((product) => product.status === "active")
    .filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle category change
    const handleCategoryChange = (e) => {
        router.get(window.location.pathname, {
            category: e.target.value,
            sort: filters.sort
        }, { preserveState: true });
    };

    // Handle sorting change
    const handleSortChange = (e) => {
        router.get(window.location.pathname, {
            category: filters.category,
            sort: e.target.value
        }, { preserveState: true });
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(window.location.pathname, {
            category: filters.category,
            sort: filters.sort,
            search: searchQuery
        }, { preserveState: true });
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

        router.post("/cart/add", { product_id: productId, quantity }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Item added to cart!'),
            onError: (errors) => {
                console.error('Error adding item to cart:', errors);
                toast.error('Failed to add item to cart');
            }
        });
    }

    return (
        <AppLayout>
            <section>
                <div className="relative bg-cover bg-center text-white flex flex-col h-[150px] items-center"
                    style={{ backgroundImage: "url('/images/hero_section_bg.avif')" }}>
                </div>

                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center my-4 lg:px-20 md:px-4">


                    {/* Category Dropdown
                    <div className="flex items-center gap-2">
                        <span>Category</span>
                        <select className="px-3 py-1 font-semibold text-lg" value={filters.category || "All Products"} onChange={handleCategoryChange}>
                            <option>All Products</option>
                            {categories?.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sorting Dropdown
                    <div className="flex items-center gap-2">
                        <span>Sort By</span>
                        <select className="font-semibold px-3 py-1" value={filters.sort || "A-Z"} onChange={handleSortChange}>
                            <option>A-Z</option>
                            <option>Z-A</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div> */}


                    {/* Category Dropdown */}
                    <div className="flex items-center gap-2">
                        <span>Category</span>
                        <Select
                            options={categoryOptions}
                            defaultValue={categoryOptions.find(option => option.value === (filters.category || "All Products"))}
                            onChange={(selectedOption) => handleCategoryChange({ target: { value: selectedOption.value } })}
                            className="w-48"
                        />
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-2">
                        <span>Sort By</span>
                        <Select
                            options={sortOptions}
                            defaultValue={sortOptions.find(option => option.value === (filters.sort || "A-Z"))}
                            onChange={(selectedOption) => handleSortChange({ target: { value: selectedOption.value } })}
                            className="w-48"
                        />
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center border rounded-2xl px-3 py-1 bg-white">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="outline-none bg-white text-gray-700 w-full px-2 py-1"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Search className="text-gray-500" size={18} />
                    </div>
                </div>

                <hr className="border-gray-300"></hr>

                {/* Product List */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 lg:gap-8 max-w-6xl py-4 md:mx-auto lg:mx-20">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => {
                                console.log("Product Image:", product.product_image);
                                return (
                                    <div key={product.product_id} className="mt-4 p-4 min-h-80 max-w-32 flex flex-col justify-between hover:shadow hover:scale-110 transition-all rounded-lg">

                                        {/* Product Image */}
                                        <Link href={`/item/${product.product_id}`} className="">
                                            <div className="w-full h-24 max-w-24 min-w-24 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
                                                <img
                                                    src={
                                                        product.product_image
                                                            ? `/storage/${product.product_image}`
                                                            : "/images/default_product_image.png"
                                                    }
                                                    alt={product.product_name}
                                                    onError={(e) => console.error("Image failed to load:", e.target.src)}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
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
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">No products found.</p>
                        )}
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center m-4">
                    {products.links.map((link, index) => (
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                preserveState
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`p-1 m-1 text-lg text-gray-700 ${link.active ? "text-green-900 text-xl font-bold" : "hover:bg-gray-100"}`}
                            />
                        ) : (
                            <span
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className="p-1 m-1 text-lg text-gray-400"
                            />
                        )
                    ))}
                </div>

            </section>
            {/* Footer */}
            <Footer />
        </AppLayout>
    );
}