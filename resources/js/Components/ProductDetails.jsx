import {
    ChevronLeftIcon,
    PlusCircleIcon,
    StarIcon,
    PencilIcon,
    CheckIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const VAT_PERCENTAGE = 12; // Default VAT percentage
const TAX_PERCENTAGE = 5; // Example tax percentage (adjust as needed)

export default function ProductDetails({ product, onUpdate, onClose }) {
    const [isEditMode, setIsEditMode] = useState(false);

    const form = useForm({
        id: product.product_id,
        product_name: product.product_name,
        product_description: product.product_description,
        product_serving: product.product_serving,
        stocks: product.stocks,
        category: product.category,
        sub_category: product.sub_category,
        product_price: product.product_price,
        vat: product.vat,
        tax: product.tax,
        tax_percentage: 0, // Default tax percentage
        final_price: product.final_price,
        expiration_date: product.expiration_date || null,
        requires_temperature_control: product.requires_temperature_control || false,
        storage_temperature: product.storage_temperature || "",
        status: product.status,
        product_image: null,
        tax_exemption: false,
    });

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Define the options
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= Math.floor(rating) ? (
                    <SolidStarIcon
                        key={i}
                        className="w-4 h-4 text-orange-500"
                    />
                ) : (
                    <StarIcon key={i} className="w-4 h-4 text-gray-400" />
                )
            );
        }
        return stars;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        form.setData((prev) => {
            let updatedData = { ...prev, [name]: value };

            const vat = prev.tax_exemption ? 0 : VAT_PERCENTAGE; // Adjust VAT based on exemption
            const taxPercentage = name === "tax_percentage" ? parseFloat(value) || 0 : parseFloat(prev.tax_percentage) || 0;
            const basePrice = parseFloat(prev.product_price) || 0;

            if (name === "final_price") {
                // Recalculate base price, VAT, and tax when final price changes
                const finalPrice = parseFloat(value) || 0;
                const basePrice = finalPrice / (1 + (vat + taxPercentage) / 100);
                updatedData.product_price = basePrice.toFixed(2);
                updatedData.vat = (basePrice * (vat / 100)).toFixed(2);
                updatedData.tax = (basePrice * (taxPercentage / 100)).toFixed(2);
            } else if (name === "product_price") {
                // Recalculate final price, VAT, and tax when base price changes
                const finalPrice = basePrice * (1 + (vat + taxPercentage) / 100);
                updatedData.final_price = finalPrice.toFixed(2);
                updatedData.vat = (basePrice * (vat / 100)).toFixed(2);
                updatedData.tax = (basePrice * (taxPercentage / 100)).toFixed(2);
            } else if (name === "tax_percentage") {
                // Recalculate tax when tax percentage changes
                updatedData.tax = (basePrice * (taxPercentage / 100)).toFixed(2);
                const finalPrice = basePrice * (1 + (vat + taxPercentage) / 100);
                updatedData.final_price = finalPrice.toFixed(2);
            }

            return updatedData;
        });
    };

    const handleTaxExemptionChange = (checked) => {
        form.setData((prev) => {
            const vat = checked ? 0 : VAT_PERCENTAGE; // Set VAT to 0 if exempt, otherwise 12%
            const tax = TAX_PERCENTAGE; // Fixed tax percentage
            const basePrice = parseFloat(prev.product_price) || 0;
            const finalPrice = checked
                ? basePrice * (1 + tax / 100) // If exempt, only tax is applied
                : basePrice * (1 + (vat + tax) / 100); // Apply both VAT and tax

            return {
                ...prev,
                tax_exemption: checked,
                final_price: finalPrice.toFixed(2),
                vat: checked ? "0.00" : (basePrice * (vat / 100)).toFixed(2), // VAT is 0 if exempt
                tax: (basePrice * (tax / 100)).toFixed(2), // Tax is always applied
            };
        });
    };

    const onDrop = (acceptedFiles, rejectedFiles) => {
        // Handle valid files
        if (acceptedFiles?.[0]) {
            form.setData("product_image", acceptedFiles[0]);
        }

        // Handle rejected files
        if (rejectedFiles.length > 0) {
            toast.error("Invalid file type. Please upload a JPEG or PNG image.");
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/jpg": [],
        },
        maxFiles: 1,
        multiple: false,
    });

    const handleSave = (e) => {
        e.preventDefault();

        // Create FormData object
        const formDataObj = new FormData();
        formDataObj.append('_method', 'PUT');
        formDataObj.append('product_name', form.data.product_name);
        formDataObj.append('product_description', form.data.product_description);
        formDataObj.append('product_serving', form.data.product_serving);
        formDataObj.append('stocks', form.data.stocks);
        formDataObj.append('category', form.data.category);
        formDataObj.append('sub_category', form.data.sub_category);
        formDataObj.append('expiration_date', form.data.expiration_date || null);
        formDataObj.append(
            'requires_temperature_control',
            form.data.requires_temperature_control ? '1' : '0'
        );
        formDataObj.append('storage_temperature', form.data.storage_temperature || '');
        formDataObj.append('product_price', form.data.product_price);
        formDataObj.append('vat', form.data.tax_exemption ? 0 : VAT_PERCENTAGE);
        formDataObj.append('tax_exemption', form.data.tax_exemption || false);
        formDataObj.append('final_price', form.data.final_price);
        formDataObj.append('status', form.data.status);

        // Append image if exists
        if (form.data.product_image) {
            formDataObj.append('product_image', form.data.product_image);
        }

        router.post(`/admin/manage-products/${form.data.id}`, formDataObj, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                toast.success("Product updated successfully!");
                setIsEditMode(false);

                // Call the onUpdate callback with the updated product data
                if (onUpdate) {
                    onUpdate({
                        ...form.data,
                        product_image: form.data.product_image instanceof File
                            ? URL.createObjectURL(form.data.product_image)
                            : form.data.product_image,
                    });
                }
            },
        });
    };

    // Image display helper
    const getImageUrl = () => {
        // If the image is a File object, create a temporary URL
        if (form.data.product_image instanceof File) {
            return URL.createObjectURL(form.data.product_image);
        }

        // If the product has a valid image URL, return it
        if (product.product_image) {
            return `/storage/${product.product_image}`;
        }

        // Fallback to a placeholder image if no valid image is available
        return "/placeholder-image.png";
    };

    return (
        <aside className="bg-white w-[500px] rounded-2xl flex flex-col h-full">
            <header className="p-4 bg-white flex text-sm items-center sticky border-b rounded-t-lg top-0">
                <ChevronLeftIcon className="w-8 h-8 cursor-pointer p-1 rounded-sm hover:bg-gray-100" onClick={onClose} />
                <p className="px-4">Product details</p>
                <p
                    className={`px-3 py-1 rounded-lg w-20 ml-auto text-base text-center text-white ${product.status === "active"
                        ? "bg-green-500"
                        : product.status === "inactive"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                >
                    {product.status}
                </p>
            </header>
            <section className="p-4 flex gap-4">
                {isEditMode ? (
                    <div className="flex gap-4 flex-wrap">
                        {form.data.product_image && (
                            <div className="relative">
                                <img
                                    src={getImageUrl()}
                                    alt="Product"
                                    className="w-32 h-32 object-cover border rounded"
                                />
                                <button
                                    onClick={() => form.setData('product_image', null)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {!form.data.product_image && (
                            <div
                                {...getRootProps()}
                                className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <p className="text-center text-gray-500">
                                    Drop image here, or{" "}
                                    <span className="text-green-700">
                                        Click to browse
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <img
                        src={getImageUrl()}
                        alt=""
                        className="h-60 w-60 bg-gray-500 rounded-lg object-cover"
                    />
                )}
            </section>
            <section className="px-4 py-2 flex-grow overflow-y-auto">
                <h3 className="mb-2">General Information</h3>
                <hr className="border-gray-300"></hr>

                <div className="flex-col gap-y-4 flex py-2">
                    <div className="flex items-center">
                        <div className="flex flex-col gap-y-1">
                            <h3 className="text-sm font-light">
                                Product name:{" "}
                                {isEditMode ? (
                                    <Input
                                        type="text"
                                        name="product_name"
                                        value={form.data.product_name}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                ) : (
                                    <span className="font-bold text-base">
                                        {product.product_name}
                                    </span>
                                )}
                            </h3>
                            <p className="flex items-center gap-1 text-sm text-gray-500">
                                {renderStars(product.product_rating)}
                                <span>{product.product_rating}</span>
                                <span>| 100 Reviews</span>
                            </p>
                            <div className="flex flex-row gap-1 py-1 font-light">
                                <div className="inline-block px-3 py-1 bg-gray-300 rounded-sm text-sm">
                                    1524 sold
                                </div>
                                <div className="inline-block px-3 py-1 bg-gray-300 rounded-sm text-sm">
                                    {product.stocks} stocks
                                </div>
                            </div>
                        </div>
                        <p className="ml-auto px-3 py-1 bg-green-900 rounded-lg text-white">
                            ₱{product.final_price}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-light">
                            Product serving:{" "}
                            {isEditMode ? (
                                <Input
                                    type="text"
                                    name="product_serving"
                                    value={form.data.product_serving}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            ) : (
                                <span className="font-medium">
                                    {product.product_serving}
                                </span>
                            )}
                        </p>
                        <p className="text-sm font-light">
                            Category:{" "}
                            {isEditMode ? (
                                <Input
                                    type="text"
                                    name="category"
                                    value={form.data.category}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            ) : (
                                <span className="font-medium">
                                    {product.category}
                                </span>
                            )}
                        </p>
                        <p className="text-sm font-light">
                            Sub-category:{" "}
                            {isEditMode ? (
                                <Input
                                    type="text"
                                    name="sub_category"
                                    value={form.data.sub_category}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            ) : (
                                <span className="font-medium">
                                    {product.sub_category}
                                </span>
                            )}
                        </p>
                    </div>
                    <p className="text-sm font-light">
                        Product description:{" "}
                        {isEditMode ? (
                            <Textarea
                                name="product_description"
                                value={form.data.product_description}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        ) : (
                            <span className="font-medium">
                                {product.product_description}
                            </span>
                        )}
                    </p>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-light">
                            <label className="font-medium">
                                Expiration Date:
                            </label>{" "}
                            {isEditMode ? (
                                <Input
                                    type="date"
                                    name="expiration_date"
                                    value={form.data.expiration_date || "N/A"}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            ) : (
                                <span className="font-medium">
                                    {formatDate(product.expiration_date)}
                                </span>
                            )}
                        </p>
                    </div>

                  <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-light">
                        <span className="font-medium">Temperature Control:</span>
                    </label>

                    {isEditMode ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="requires_temperature_control"
                                    checked={form.data.requires_temperature_control || false}
                                    onCheckedChange={(checked) => {
                                    form.setData("requires_temperature_control", checked === true);
                                    }}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="requires_temperature_control" className="text-sm">
                                    Requires Temperature Control?
                                </label>
                            </div>

                            {form.data.requires_temperature_control && (
                                <Input
                                    type="text"
                                    name="storage_temperature"
                                    value={form.data.storage_temperature || ""}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    placeholder="e.g. 0-4°C"
                                />
                            )}
                        </div>
                    ) : (
                        <span className="text-sm font-medium">
                            {product.storage_temperature || "N/A"}
                        </span>
                    )}
                </div>
            </div>


                {isEditMode && (
                    <div className="mt-4">
                        <h3 className="mb-2">Price Breakdown</h3>
                        <hr className="border-gray-300"></hr>
                        <div className="flex flex-col gap-y-2 py-2">
                            <p className="text-sm font-light">
                                Base Price:{" "}
                                <Input
                                    type="number"
                                    name="product_price"
                                    value={form.data.product_price}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </p>
                            <p className="text-sm font-light">
                                VAT (12%):{" "}
                                <Input
                                    type="number"
                                    name="vat"
                                    value={form.data.vat || ""}
                                    readOnly // Make this field read-only since it's calculated
                                    className="w-full bg-gray-100 cursor-not-allowed"
                                />
                            </p>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="tax_exemption"
                                    checked={form.data.tax_exemption || false}
                                    onCheckedChange={(checked) => handleTaxExemptionChange(checked)}
                                    className="h-4 w-4 ml-2"
                                />
                                <label htmlFor="tax_exemption" className="text-sm font-light">
                                    VAT Exempt
                                </label>
                            </div>
                            <div className="flex w-full gap-2">
                                <p className="text-sm font-light">
                                    Tax Percentage (%):{" "}
                                    <Input
                                        type="number"
                                        name="tax_percentage"
                                        value={form.data.tax_percentage || ""}
                                        onChange={handleInputChange} // Allow editing of tax percentage
                                        className="w-full"
                                    />
                                </p>
                                <p className="text-sm font-light flex-grow">
                                    Tax:{" "}
                                    <Input
                                        type="number"
                                        name="tax"
                                        value={form.data.tax || ""}
                                        readOnly // Dynamically calculated
                                        className="w-full bg-gray-100 cursor-not-allowed"
                                    />
                                </p>
                            </div>
                            <p className="text-sm font-light">
                                Final Price:{" "}
                                <Input
                                    type="number"
                                    name="final_price"
                                    value={form.data.final_price || ""}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </p>
                        </div>
                    </div>
                )}
                <div className="">
                    <h3 className="my-2">Other Details</h3>
                    <hr className="border-gray-300"></hr>

                    <div className="flex-col gap-y-4 flex py-2">
                        <div>
                            <p className="text-sm font-light">
                                Product ID:{" "}
                                <span className="font-medium">
                                    {product.product_id}
                                </span>
                            </p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <p className="text-sm font-light">
                                Created at:{" "}
                                <span className="font-medium">
                                    {formatDate(product.created_at)}
                                </span>
                            </p>
                            <p className="text-sm font-light">
                                Updated at:{" "}
                                <span className="font-medium">
                                    {formatDate(product.updated_at)}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-light">
                                Supplier:{" "}
                                <span className="font-medium">Fresh Market</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="flex item-center gap-2 px-4 py-4 border-t rounded-b-lg bg-white border-gray-300">
                {isEditMode ? (
                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center px-4 py-2 w-full border-green-900 border rounded-md cursor-pointer hover:bg-green-900 hover:text-white"
                    >
                        <CheckIcon className="w-4 h-4" />
                        <span className="px-1">Save</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center justify-center px-4 py-2 w-full border-green-900 border rounded-md cursor-pointer hover:bg-green-900 hover:text-white"
                    >
                        <PencilIcon className="w-4 h-4" />
                        <span className="px-1">Edit</span>
                    </button>
                )}
            </footer>
        </aside>
    );
}
