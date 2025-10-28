import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function EditReview({ review }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { data, setData, post, processing, errors } = useForm({
    rating: review.rating,
    comments: review.review,
    images: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('rating', data.rating);
    formData.append('comments', data.comments);
    if (selectedFiles.length > 0) {
      formData.append('images', selectedFiles[0]);
    }
    
    router.put(`/reviews/${review.id}`, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Review updated successfully');
        window.location.href = '/reviews/' + review.item_id;
      },
      onError: (errors) => {
        toast.error(errors.error || 'Failed to update review');
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setData('images', e.target.files);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Review</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="max-w-[200px] h-auto rounded-lg border border-gray-200"
            />
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}