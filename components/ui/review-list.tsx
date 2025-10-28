'use client';

import * as React from 'react';
import { StarRating } from './star-rating';
import { usePage } from '@inertiajs/react';
import { Button } from './button';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { EditReviewModal } from './edit-review-modal';

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface Auth {
  user: User | null;
}

interface Review {
  id: number;
  user: User | null;
  rating: number;
  review: string | null;
  review_image: string | null;
  created_at: string;
}

interface PageProps {
  [key: string]: unknown;
  auth: {
    user: User | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
  className?: string;
}

export function ReviewList({ reviews, className = '' }: ReviewListProps) {
  const { auth } = usePage<PageProps>().props;
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isAuthenticated = auth?.user !== null && auth?.user !== undefined;

  const handleDelete = () => {
    if (!selectedReview || isSubmitting) return;

    setIsSubmitting(true);
    router.delete(`/reviews/${selectedReview.id}`, {
      onSuccess: () => {
        toast.success('Review deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedReview(null);
        setIsSubmitting(false);
      },
      onError: (errors: any) => {
        console.error('Delete failed:', errors);
        toast.error(errors.message || 'Failed to delete review');
        setDeleteDialogOpen(false);
        setIsSubmitting(false);
      },
      preserveScroll: true
    });
  };

  if (!reviews.length) {
    return (
      <div className={`text-center p-8 text-gray-500 ${className}`}>
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 border border-gray-200 rounded-lg space-y-4"
        >
          {/* Header: Rating, User, Date, and Actions */}
          <div className="flex items-start justify-between">
            <div>
              <StarRating rating={review.rating} size={16} />
              <p className="font-medium mt-1">
                {review.user ? `${review.user.first_name} ${review.user.last_name}` : 'Anonymous User'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>

            {isAuthenticated && review.user && auth.user.id === review.user.id && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-blue-500 transition-colors"
                  onClick={() => {
                    setSelectedReview(review);
                    setEditDialogOpen(true);
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-500 transition-colors"
                  onClick={() => {
                    setSelectedReview(review);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            )}
          </div>

          {/* Review Text */}
          {review.review && (
            <div className="mt-2">
              <p className="text-gray-700 whitespace-pre-line">{review.review}</p>
            </div>
          )}

          {/* Review Image */}
          {review.review_image && (
            <div className="mt-4">
              <img
                src={`/storage/${review.review_image}`}
                alt="Review photo"
                className="max-w-[200px] h-auto rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:bg-gray-100 transition-colors"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 transition-colors"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {selectedReview && (
        <EditReviewModal
          review={selectedReview}
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedReview(null);
          }}
        />
      )}
    </div>
  );
}
