import AppLayout from "../../../../resources/js/Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { HomeIcon, TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import ProductDetails from "@/resources/js/Components/ProductDetails";
import AddProduct from "@/resources/js/Components/AddProduct";
import Loading from "@/resources/js/Components/Loading";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/resources/js/Components/ErrorBoundary";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
    Pagination,
    PaginationContent,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


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

export default function ManageProducts({ products: initialProducts, summary: overallSummary }) {
    const [products, setProducts] = useState(initialProducts.data); // Paginated product data
    const [pagination, setPagination] = useState({
        current_page: initialProducts.current_page,
        last_page: initialProducts.last_page,
        per_page: initialProducts.per_page,
    });
    const [isLoading, setIsLoading] = useState(false);

    // Use the summary from the backend
    const summary = overallSummary;

    const fetchProducts = async (page, sortConfigOverride = null) => {
        setIsLoading(true);
        try {
            const sortConfigToUse = sortConfigOverride || sortConfig;

            await router.get(`/admin/manage-products`, {
                search: searchQuery,
                sort_key: sortConfigToUse.key,
                sort_direction: sortConfigToUse.direction,
                page,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setProducts(page.props.products.data);
                    setPagination({
                        current_page: page.props.products.current_page,
                        last_page: page.props.products.last_page,
                        per_page: page.props.products.per_page,
                    });
                },
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Fetch products for the selected page
            fetchProducts(page);
        }
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedProducts, setEditedProducts] = useState({});

    // Memoize filtered and sorted products
    const filteredAndSortedProducts = useMemo(() => {
        let filteredProducts = products;

        if (searchQuery) {
            filteredProducts = filteredProducts.filter((product) =>
                product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortConfig.key) {
            filteredProducts = [...filteredProducts].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredProducts;
    }, [products, searchQuery, sortConfig]); // Recalculate when products, searchQuery, or sortConfig change

    const handleSort = useCallback((key) => {
        if (isEditMode) return; // Disable sorting in edit mode

        setSortConfig((current) => {
            const newSortConfig = {
                key,
                direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
            };

            // Reset to the first page and fetch products with the new sort config
            fetchProducts(1, newSortConfig);
            return newSortConfig;
        });
    }, [isEditMode]);

    const handleUpdate = useCallback((updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.product_id === updatedProduct.product_id
                    ? { 
                        ...product, 
                        ...updatedProduct, 
                        product_image: updatedProduct.product_image || product.product_image 
                    }
                    : product
            )
        );
        setSelectedProduct(null);
    }, []);


    const handleEditModeToggle = () => {
        if (isEditMode) {
            handleSaveChanges(); // Save changes when exiting edit mode
        } else {
            setIsEditMode(true); // Enter edit mode
        }
    };

    const handleSaveChanges = async () => {
        setIsLoading(true); // Show loading indicator
        try {
            // Convert editedProducts object to an array
            const updates = Object.values(editedProducts);

            // Log the updates to verify the data being sent
            console.log("Updates being sent to backend:", updates);

            // Send edited products to the backend using Inertia
            await router.put('/admin/manage-products/bulk-update', {
                products: updates, // Send as an array
            });

            // Reset to the first page and fetch the updated product list
            fetchProducts(1);

            toast.success("Changes saved successfully!"); // Show success notification
            setEditedProducts({}); // Clear edited products
            setIsEditMode(false); // Exit edit mode
        } catch (error) {
            console.error("Error saving changes:", error);
            toast.error("Failed to save changes. Please try again."); // Show error notification
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        fetchProducts(1); // Fetch products for the first page with the search query
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const closeSidebar = () => {
        setSelectedProduct(null);
    };

    const handleAddProductClick = () => {
        setIsAddingProduct(true);
    };

    const closeAddProduct = () => {
        setIsAddingProduct(false);
    };

    const handleProductEdit = (productId, field, value) => {
        setEditedProducts((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                product_id: productId,
                [field]: value,
            },
        }));
    };

    const [productToDelete, setProductToDelete] = useState(null); // Track the product to delete

    const confirmDelete = (productId) => {
        setProductToDelete(productId); // Set the product to delete
    };

    const handleDeleteConfirmed = () => {
        if (!productToDelete) return;

        router.delete(`/admin/manage-products/${productToDelete}`, {
            data: { product_id: productToDelete }, // Explicitly pass the productId
            preserveScroll: true,
            onBefore: () => setIsLoading(true),
            onSuccess: () => {
                // Remove the deleted product from the products state
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.product_id !== productToDelete)
                );
                toast.success("Product deleted successfully!"); // Show toast notification
                setIsLoading(false);
                setProductToDelete(null); // Reset the product to delete
            },
            onError: () => {
                setIsLoading(false);
                alert('Failed to delete product');
                setProductToDelete(null); // Reset the product to delete
            },
        });
    };

    return (
        <AppLayout>
            <ErrorBoundary>
                <Breadcrumb className="mt-18 p-4 bg-white shadow-sm rounded-md mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/"><HomeIcon className=" w-4 h-4" /></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Manage Product</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Products List section */}
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
                            onClick={handleAddProductClick}
                            className=""
                            variant="outline"
                        >
                            <PlusIcon className="w-6 h-6" />
                        </Button>
                        <Button
                            onClick={handleEditModeToggle}
                            className=""
                            variant="outline"
                        >
                            {isEditMode ? "Save" : <PencilSquareIcon className="w-6 h-6" />}
                        </Button>

                    </div>
                    {/* Converted Table */}
                    <Table>
                        <TableCaption>List of Products</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("product_name")}
                                >
                                    Product Name
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("product_id")}
                                >
                                    ID & Created Date
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("product_price")}
                                >
                                    Price
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort("stocks")}
                                >
                                    # of Stocks
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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map((product) => (
                                    <TableRow
                                        key={product.product_id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={!isEditMode ? () => handleProductClick(product) : undefined}
                                    >
                                        {/* Product Name & Image */}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {isEditMode && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    confirmDelete(product.product_id);
                                                                }}
                                                            >
                                                                <TrashIcon />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the product.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel
                                                                    onClick={() => setProductToDelete(null)}
                                                                >
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleDeleteConfirmed}>
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                                <img
                                                    src={product.product_image ? `/storage/${product.product_image}` : "/placeholder-image.png"}
                                                    alt={product.product_name}
                                                    className="h-10 w-10 bg-white object-cover rounded border border-gray-300"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {product.product_name} ({product.product_serving})
                                                    </p>
                                                    <p className="text-xs text-gray-500">{product.category}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Product ID & Created Date */}
                                        <TableCell>
                                            <p className="font-medium">{product.product_id}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(product.created_at)}
                                            </p>
                                        </TableCell>

                                        {/* Product Price */}
                                        <TableCell>
                                            {isEditMode ? (
                                                <Input
                                                    type="number"
                                                    value={editedProducts[product.product_id]?.final_price ?? product.final_price}
                                                    onChange={(e) => handleProductEdit(product.product_id, "final_price", e.target.value)}
                                                    className="w-20 border rounded-md px-2 py-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <>
                                                    <p className="font-medium">₱
                                                        {product.final_price}</p>
                                                    <p className="text-xs text-gray-500">per {product.product_serving}</p>
                                                </>
                                            )}
                                        </TableCell>

                                        {/* Product Stocks */}
                                        <TableCell>
                                            {isEditMode ? (
                                                <Input
                                                    type="number"
                                                    value={editedProducts[product.product_id]?.stocks ?? product.stocks}
                                                    onChange={(e) => handleProductEdit(product.product_id, "stocks", e.target.value)}
                                                    className="w-20 border rounded-md px-2 py-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <>
                                                    <p className="font-medium">{product.stocks}</p>
                                                    <p className="text-xs font-light">supplier</p>
                                                </>
                                            )}
                                        </TableCell>

                                        {/* Product Status */}
                                        <TableCell>
                                            {isEditMode ? (
                                                <Select
                                                    value={editedProducts[product.product_id]?.status || product.status}
                                                    onValueChange={(value) => handleProductEdit(product.product_id, "status", value)}
                                                >
                                                    <SelectTrigger className="">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${product.status === "active"
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <Pagination className="m-4">
                        <PaginationContent>
                            <PaginationPrevious
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                            />
                            {Array.from({ length: pagination.last_page }, (_, index) => (
                                <PaginationLink
                                    key={index + 1}
                                    isActive={pagination.current_page === index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            ))}
                            <PaginationNext
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                            />
                        </PaginationContent>
                    </Pagination>

                    {/* Product details and add product modals */}
                    <AnimatePresence>
                        {isAddingProduct && (
                            <div className="fixed inset-0 flex justify-end z-50">
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="relative z-10 m-4"
                                >
                                    <AddProduct onClose={closeAddProduct} /> {/* Pass onClose prop */}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.4 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 bg-black"
                                    onClick={closeAddProduct}
                                ></motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {selectedProduct && (
                            <div className="fixed inset-0 flex justify-end z-50">
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="relative z-10 m-4"
                                >
                                    <ProductDetails
                                        product={selectedProduct}
                                        onUpdate={handleUpdate}
                                        onClose={closeSidebar}
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.4 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 bg-black"
                                    onClick={closeSidebar}
                                ></motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                    {isLoading && <Loading />}
                </Card>
            </ErrorBoundary>
        </AppLayout>
    );
}
