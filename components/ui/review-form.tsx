'use client';

import * as React from 'react';
import { useState } from 'react';
import { StarRating } from './star-rating';
import { Button } from './button';
import { Textarea } from './textarea';
import { ImagePlus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { router } from '@inertiajs/react';

interface ReviewFormProps {
  productId: number;
  initialRating?: number;
  initialComments?: string;
  initialImages?: string[];
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

interface FormErrors {
  [key: string]: string | string[];
}

export function ReviewForm({
  productId,
  initialRating = 0,
  initialComments = '',
  initialImages = [],
  isEditing = false,
  onSuccess,
  onCancel,
  className = '',
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comments, setComments] = useState(initialComments);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    initialImages.map(image => `/storage/${image}`)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const totalImages = imagePreviewUrls.length + files.length - imagesToRemove.length;
    
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match(/^image\//)) {
        toast.error('Only image files are allowed');
        continue;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Images must be less than 2MB');
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      setNewImages(prev => [...prev, file]);
      setImagePreviewUrls(prev => [...prev, previewUrl]);
    };

    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const isExistingImage = index < initialImages.length;

    if (isExistingImage) {
      const imageToRemove = initialImages[index];
      setImagesToRemove(prev => [...prev, imageToRemove]);
    } else {
      const adjustedIndex = index - initialImages.length;
      setNewImages(prev => prev.filter((_, i) => i !== adjustedIndex));
    }

    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));

    // Revoke object URL to prevent memory leaks
    if (!isExistingImage) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comments.length < 10) {
      toast.error('Please write a review with at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('product_id', productId.toString());
    formData.append('rating', rating.toString());
    formData.append('comments', comments);

    newImages.forEach(image => {
      formData.append('images[]', image);
    });

    if (isEditing && imagesToRemove.length > 0) {
      imagesToRemove.forEach(image => {
        formData.append('remove_images[]', image);
      });
    }

    const url = isEditing ? `/reviews/${productId}` : '/reviews';
    const method = isEditing ? 'put' : 'post';

    router[method](url, formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success(isEditing ? 'Review updated!' : 'Review submitted!');
        if (onSuccess) onSuccess();
      },
      onError: (errors: FormErrors) => {
        for (const field in errors) {
          const message = errors[field];
          if (Array.isArray(message)) {
            message.forEach(msg => toast.error(msg));
          } else if (message) {
            toast.error(message);
          }
        }
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Your Rating</label>
        <StarRating rating={rating} interactive onChange={setRating} size={24} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Your Review</label>
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          Minimum 10 characters required.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Add Photos (optional)</label>
        <div className="flex flex-wrap gap-2">
          {imagePreviewUrls.map((url, index) => (
            <div key={url} className="relative w-24 h-24">
              <img
                src={url}
                alt={`Review preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {imagePreviewUrls.length < 5 && (
            <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <ImagePlus className="text-gray-400" />
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Up to 5 images (max 2MB each)
        </p>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}