import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input"; // Adjust the import path based on your project structure
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const VAT_PERCENTAGE = 12; // Default VAT percentage

export default function AddProduct({ onClose }) { // Added onClose prop
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        product_name: "",
        category: null, // Updated to use react-select
        product_description: "",
        product_serving: "",
        product_price: "",
        final_price: "", // Added final_price field
        stocks: "",
        expiration_date: "",
        storage_temperature: "", 
        requires_temperature_control: false, 
        status: { value: "active", label: "Active" },
        vat_exempt: false, // Added VAT exemption field
    });
    const [errors, setErrors] = useState({});
    const [vatPercentage, setVatPercentage] = useState(0); // Added VAT percentage state
    const [categoryOptions, setCategoryOptions] = useState([
        { value: "Fruits", label: "Fruits" },
        { value: "Vegetables", label: "Vegetables" },
        { value: "Seafood", label: "Seafood" },
        { value: "Meat", label: "Meat" },
        { value: "Rice & Grains", label: "Rice & Grains" },
        { value: "Herbs & Spices", label: "Herbs & Spices" },
        { value: "Beverages", label: "Beverages" },
    ]);
    const [newCategory, setNewCategory] = useState("");

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            toast.error("Category name cannot be empty.");
            return;
        }

        if (categoryOptions.some((option) => option.value.toLowerCase() === newCategory.toLowerCase())) {
            toast.error("Category already exists.");
            return;
        }

        const newOption = { value: newCategory, label: newCategory };
        setCategoryOptions((prev) => [...prev, newOption]);
        setFormData((prev) => ({ ...prev, category: newOption }));
        setNewCategory("");
        toast.success("Category added successfully!");
    };

    const onDrop = (acceptedFiles) => {
        const validFiles = acceptedFiles.filter((file) =>
            ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
        );

        if (images.length + validFiles.length > 3) {
            alert("You can only upload up to 3 images.");
            return;
        }

        const newImages = validFiles.map((file) => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImages).then((loadedImages) => {
            setImages((prev) => [...prev, ...loadedImages]);
        });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/jpg": [],
        },
        maxFiles: 3 - images.length,
    });

    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            let updatedFormData = { ...prev, [name]: value };

            const vat = prev.vat_exempt ? 0 : VAT_PERCENTAGE; // Adjust VAT based on exemption

            if (name === "final_price") {
                // Recalculate base price when final price changes
                const finalPrice = parseFloat(value) || 0;
                const basePrice = finalPrice / (1 + vat / 100);
                updatedFormData.product_price = basePrice.toFixed(2);
            } else if (name === "product_price") {
                // Recalculate final price when base price changes
                const basePrice = parseFloat(value) || 0;
                const finalPrice = basePrice * (1 + vat / 100);
                updatedFormData.final_price = finalPrice.toFixed(2);
            }

            return updatedFormData;
        });
    };

    const handleVatExemptChange = (checked) => {
        setFormData((prev) => {
            const vat = checked ? 0 : VAT_PERCENTAGE; // Set VAT to 0 if exempt, otherwise 12%
            const basePrice = parseFloat(prev.product_price) || 0;
            const finalPrice = checked
                ? basePrice // If exempt, final price equals base price
                : basePrice * (1 + VAT_PERCENTAGE / 100);

            return {
                ...prev,
                vat_exempt: checked,
                final_price: finalPrice.toFixed(2),
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Create FormData object
        const formDataObj = new FormData();
        formDataObj.append("product_name", formData.product_name);
        formDataObj.append("category", formData.category?.value || "");
        formDataObj.append("product_description", formData.product_description);
        formDataObj.append("product_serving", formData.product_serving);
        formDataObj.append("final_price", formData.final_price);
        formDataObj.append("vat_percentage", formData.vat_exempt ? 0 : VAT_PERCENTAGE); // Send correct VAT percentage
        formDataObj.append("vat_exempt", formData.vat_exempt === true); // Ensure boolean value
        formDataObj.append('expiration_date', formData.expiration_date || null);
        formDataObj.append(
            'requires_temperature_control',
            formData.requires_temperature_control ? '1' : '0'
        );
        formDataObj.append('storage_temperature', formData.storage_temperature || '');
        formDataObj.append("stocks", formData.stocks);
        formDataObj.append("status", formData.status.value);

        // Convert base64 images to files and append
        images.forEach((base64Image, index) => {
            if (base64Image) {
                const imageBlob = dataURLtoBlob(base64Image);
                const imageFile = new File([imageBlob], `image${index}.jpg`, { type: "image/jpeg" });

                // Append with correct key name
                if (index === 0) formDataObj.append("product_image", imageFile);
                if (index === 1) formDataObj.append("product_image_1", imageFile);
                if (index === 2) formDataObj.append("product_image_2", imageFile);
            }
        });

        router.post("/admin/manage-products", formDataObj, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Product created successfully!");
                onClose();
            },
            onError: (error) => {
                console.error("Error creating product:", error);
                setErrors(error);
            },
            forceFormData: true,
        });
    };

    // Helper function to convert base64 to blob
    const dataURLtoBlob = (dataURL) => {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        if (!["image/jpeg", "image/png", "image/jpg"].includes(mime)) {
            throw new Error("Invalid MIME type");
        }
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.product_name)
            errors.product_name = "Product name is required.";
        if (!formData.category)
            errors.category = "Category is required.";
        if (!formData.product_price || formData.product_price <= 0)
            errors.product_price = "Price must be greater than 0.";
        if (!formData.stocks || formData.stocks < 0)
            errors.stocks = "Stocks cannot be negative.";
        return errors;
    };

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    return (
        <aside className="bg-white w-[500px] rounded-2xl flex h-full">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <header className="p-4 bg-white flex text-sm items-center sticky border-b rounded-t-lg top-0">
                    <ChevronLeftIcon className="w-8 h-8 cursor-pointer p-1 rounded-sm hover:bg-gray-100" onClick={onClose} />
                    <p className="px-4">Add new product</p>
                </header>
                <div className="flex flex-col px-4 py-4 flex-grow overflow-y-auto">
                    {/* image section */}
                    <section className="py-4">
                        <div className="flex gap-4 flex-wrap">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-32 h-32 object-cover border rounded"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {images.length < 3 && (
                                <div
                                    {...getRootProps()}
                                    className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded cursor-pointer"
                                >
                                    <input {...getInputProps()} />
                                    <p className="text-center text-gray-500">
                                        Drop your image here, or{" "}
                                        <span className="text-green-700">
                                            Click to browse
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            You can upload up to 3 images. The image format is
                            .jpg, .jpeg, .png and a minimum size of 300 × 300px
                            (For optimal images use a minimum size of 700 × 700
                            px).
                        </p>
                    </section>

                    {/* General Information section */}
                    <section>
                        <h3 className="border-b py-2">General Information</h3>
                        <div className="py-2">
                            <label className="text-sm font-light">
                                Product name
                            </label>
                            <Input
                                type="text"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleInputChange}
                                placeholder="Rib eye steak"
                            />
                            {errors.product_name && (
                                <p className="text-red-500 text-xs">
                                    {errors.product_name}
                                </p>
                            )}
                        </div>
                        <div className="flex w-full  gap-x-2 py-2">
                            <div>
                                <label className="text-sm font-light">
                                    Product category
                                </label>
                                <Select
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: categoryOptions.find(
                                                (option) => option.value === value
                                            ),
                                        }))
                                    }
                                    value={formData.category?.value || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-red-500 text-xs">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                            <div className="flex-grow">
                                <label className="text-sm font-light">Add new category</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="Meat"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddCategory}

                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="py-2">
                            <label className="text-sm font-light">
                                Product description
                            </label>
                            <Textarea
                                name="product_description"
                                value={formData.product_description}
                                onChange={handleInputChange}
                                placeholder="Meat"
                                className="border rounded-md w-full px-3 py-1"
                            />
                        </div>

                         <div className="py-2">

                            <Checkbox
                                name="requires_temperature_control"
                                checked={formData.requires_temperature_control || false}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        requires_temperature_control: checked === true,
                                    
                                    }))
                                   
                                }
                                className="mr-2"

                            />
                                
                            <label className="text-sm font-light">
                                Requires Temperature Control?
                            </label>

                            {formData.requires_temperature_control && (
                            <div className="flex items-center gap-2">
                             <label className="text-sm font-light">
                                        Temeprature Requirment
                            </label>

                            <Input
                                type="text"
                                name="storage_temperature"
                                value={formData.storage_temperature || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        storage_temperature: e.target.value,
                                    }))
                                }
                                placeholder="e.g. 0-4°C"
                                className="border rounded-md w-full px-3 py-1"
                            />
                            </div>
                            )}
                        </div>

                        <div className="py-2">
                            <label className="text-sm font-light">
                                Expiration Date
                            </label>
                            <Input
                                type="date"
                                name="expiration_date"
                                value={formData.expiration_date || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        expiration_date: e.target.value,
                                    }))
                                }
                                className="border rounded-md w-full px-3 py-1"
                            />
                        </div>



                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <div className="py-2">
                                    <label className="text-sm font-light">Product Serving</label>
                                    <Input
                                        type="text"
                                        name="product_serving"
                                        value={formData.product_serving}
                                        onChange={handleInputChange}
                                        placeholder="Meat"
                                    />
                                </div>
                                <div className="py-2">
                                    <label className="text-sm font-light">Status</label>
                                    <Select
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                status: statusOptions.find((option) => option.value === value),
                                            }))
                                        }
                                        value={formData.status?.value || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="py-2">
                                    <label className="text-sm font-light">VAT Percentage</label>
                                    <Input
                                        type="number"
                                        name="vat_percentage"
                                        value={VAT_PERCENTAGE}
                                        readOnly // Make the field read-only
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div className="flex items-center py-2">
                                    <Checkbox
                                        name="vat_exempt"
                                        checked={formData.vat_exempt || false}
                                        onCheckedChange={handleVatExemptChange}
                                        className="mr-2"
                                    />
                                    <label className="text-sm text-gray-600">VAT Exempt</label>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <div className="py-2">
                                    <label className="text-sm font-light">Stocks</label>
                                    <Input
                                        type="number"
                                        name="stocks"
                                        value={formData.stocks}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                    />
                                    {errors.stocks && (
                                        <p className="text-red-500 text-xs">{errors.stocks}</p>
                                    )}
                                </div>
                                <div className="py-2">
                                    <label className="text-sm font-light">Base Price</label>
                                    <Input
                                        type="number"
                                        name="product_price"
                                        value={formData.product_price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                    />
                                    {errors.product_price && (
                                        <p className="text-red-500 text-xs">{errors.product_price}</p>
                                    )}
                                </div>
                                <div className="py-2">
                                    <label className="text-sm font-light">Final Price</label>
                                    <Input
                                        type="number"
                                        name="final_price"
                                        value={formData.final_price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                    />
                                    {errors.final_price && (
                                        <p className="text-red-500 text-xs">{errors.final_price}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <footer className="flex item-center gap-2 px-4 py-4 border-t rounded-b-lg bg-white border-gray-300 sticky bottom-0">
                    <button
                        type="submit"
                        className="w-full bg-green-900 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-black"
                    >
                        Create Product
                    </button>
                </footer>
            </form>
        </aside>
    );
}
