import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, router } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ProductFeedback({ orderItem, onClose, onUpdate, open }) {
    const [consentGiven, setConsentGiven] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);
    const { data, setData, post, processing, errors } = useForm({
        item_id: orderItem?.id || '', // This is the order_item id
        rating: null,
        review: "", // Changed from comments to review
        review_image: null, // Changed from images array to single image
    });

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleRatingClick = (value) => {
        setData("rating", value);
    };

    const onDrop = (acceptedFiles) => {
        const uploadedFile = acceptedFiles[0];
        if (!uploadedFile) return;

        if (!["image/jpeg", "image/png"].includes(uploadedFile.type)) {
            toast.error('Please upload JPEG or PNG images only');
            return;
        }

        if (uploadedFile.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }
        
        // Create preview URL and update form data
        const previewUrl = URL.createObjectURL(uploadedFile);
        setPreviewUrls([previewUrl]); // Replace existing preview
        setData('review_image', uploadedFile); // Replace existing image
    };

    const removeImage = () => {
        // Clear the preview URL
        setPreviewUrls([]);
        // Clear the file from form data
        setData('review_image', null);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
        maxFiles: 1,
        multiple: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.rating) {
            toast.error("Please select a rating before submitting.");
            return;
        }

        if (!data.review) {
            toast.error("Please write a review before submitting.");
            return;
        }

        if (!consentGiven) {
            toast.error("Please agree to the review guidelines.");
            return;
        }

        console.log('All validations passed, preparing to submit');

        post('/product-reviews', data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Thank you for your review!');
                onUpdate?.();
                onClose?.();
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors).flat();
                errorMessages.forEach(msg => toast.error(msg));
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={() => onClose?.()}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <form 
                    onSubmit={handleSubmit}
            className="flex flex-col items-center h-full gap-6 p-4 sm:m-4 sm:p-6">
            <div className="text-center">
                <p className="text-lg font-bold">Product Review</p>
                <p className="text-sm font-light">
                    Share your experience with this product
                </p>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-4">
                <img
                    src={
                        orderItem.product.product_image
                            ? `/storage/${orderItem.product.product_image}`
                            : "/placeholder-image.png"
                    }
                    alt={orderItem.product.product_name}
                    className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                    <h3 className="font-semibold">{orderItem.product.product_name}</h3>
                    <p className="text-sm text-gray-500">{orderItem.product.description}</p>
                </div>
            </div>

            {/* Rating */}
            <div className="w-full">
                <p className="font-medium mb-2">Your Rating*</p>
                <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingClick(value)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                                data.rating === value
                                    ? "bg-green-900 text-white border-green-900"
                                    : "border-gray-300 hover:border-green-600"
                            }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="text-red-500 text-sm text-center mt-1">{errors.rating}</p>
                )}
            </div>

            {/* Review Text */}
            <div className="w-full">
                <p className="text-sm font-medium mb-1">Your Review*</p>
                <textarea
                    value={data.review}
                    onChange={(e) => setData('review', e.target.value)}
                    placeholder="Write your review here..."
                    className={`w-full p-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        errors.review ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                ></textarea>
                <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-500">
                        {(data.review || '').length}/500 characters
                    </p>
                    {errors.review && (
                        <p className="text-red-500 text-sm">{errors.review}</p>
                    )}
                </div>
            </div>

            {/* Image Upload */}
            <div className="w-full">
                <p className="font-medium mb-2">Add Photo (Optional)</p>
                <div className="flex gap-2">
                    {previewUrls.length > 0 ? (
                        <div className="relative">
                            <img
                                src={previewUrls[0]}
                                alt="Review photo"
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <div
                            {...getRootProps()}
                            className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                        >
                            <input {...getInputProps()} />
                            <span className="text-2xl text-gray-400">+</span>
                        </div>
                    )}
                </div>
                {errors.review_image && (
                    <p className="text-red-500 text-sm mt-1">{errors.review_image}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                    Supported formats: JPEG, PNG (max 2MB)
                </p>
            </div>

            {/* Consent */}
            <div className="w-full">
                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                        I agree that my review and rating will be publicly visible on the Fresh Connection website.
                        My name and profile information may be displayed alongside my review.
                    </span>
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={!consentGiven || processing}
                    
                    className={`px-6 py-2 rounded-lg ${
                        !consentGiven || processing
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-green-900 text-white hover:bg-green-800"
                    }`}
                >
                    {processing ? "Submitting..." : "Submit Review"}
                </button>
            </div>
        </form>
            </DialogContent>
        </Dialog>
    );
}