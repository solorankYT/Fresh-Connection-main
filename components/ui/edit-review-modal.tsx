import * as React from 'react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Review {
  id: number;
  rating: number;
  review: string;
  review_image?: string;
}

interface FormDataState {
  rating: number;
  comments: string;
  images: File | null;
}

interface ErrorResponse {
  message?: string;
}

interface EditReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

export function EditReviewModal({ review, isOpen, onClose }: EditReviewModalProps) {
  const [formData, setFormData] = useState<FormDataState>({
    rating: review.rating,
    comments: review.review || '',
    images: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, comments: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, images: e.target.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('rating', formData.rating.toString());
    submitData.append('review', formData.comments);  
    if (formData.images) {
        submitData.append('review_image', formData.images);  
    }

    // Log the data being sent
    console.log('Submitting review update:', {
        rating: formData.rating,
        review: formData.comments,
        hasImage: !!formData.images
    });

    router.post(`/reviews/${review.id}?_method=PUT`, submitData, {
        onSuccess: () => {
            toast.success('Review updated successfully');
            onClose();
            setIsSubmitting(false);
        },
        onError: (errors: ErrorResponse) => {
            console.error('Update failed:', errors);
            toast.error(errors.message || 'Failed to update review. Please try again.');
            setIsSubmitting(false);
        },
        preserveScroll: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <Label>Rating</Label>
            <div className="mt-2">
              <StarRating
                rating={formData.rating}
                onChange={handleRatingChange}
                interactive={true}
                size={24}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="comments">Review</Label>
            <div className="mt-2">
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={handleCommentsChange}
                rows={4}
                placeholder="Write your review here..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="images">New Image (Optional)</Label>
            <div className="mt-2">
              <Input
                id="images"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {review.review_image && (
            <div>
              <p className="font-medium mb-2">Current Image</p>
              <img
                src={`/storage/${review.review_image}`}
                alt="Current review"
                className="max-w-[150px] h-auto rounded-lg border border-gray-200 object-cover"
              />
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}