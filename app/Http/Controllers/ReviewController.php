<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($product_id)
    {
        $reviews = ProductReview::where('item_id', $product_id)
            ->with('user:id,first_name,last_name')  
            ->latest()
            ->get();

        if (request()->wantsJson()) {
            return response()->json($reviews);
        }

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            \Log::info('Review submission started');
            \Log::info('Request data:', [
                'all' => $request->all(),
                'product_id' => $request->input('product_id'),
                'rating' => $request->input('rating'),
                'comments' => $request->input('comments'),
                'has_images' => $request->hasFile('images'),
                'content_type' => $request->header('Content-Type'),
            ]);
            
            $validator = Validator::make($request->all(), [
                'product_id' => ['required', 'exists:products,id'],
                'rating' => ['required', 'integer', 'min:1', 'max:5'],
                'comments' => ['required', 'string', 'min:10', 'max:500'],
                'images.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'], // We'll only use the first image
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return back()->withErrors($validator->errors());
            }

            $validated = $validator->validated();

            // Verify user has purchased and received the product
            $hasPurchased = OrderItem::whereHas('order', function ($query) {
                    $query->where('user_id', Auth::id())
                        ->where('status', 'delivered');
                })
                ->where('product_id', $request->product_id)
                ->exists();

            if (!$hasPurchased) {
                \Log::warning('Review attempt without purchase:', [
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id
                ]);
                return back()->withErrors([
                    'error' => 'You can only review products you have purchased and received.'
                ]);
            }

            // Check if user has already reviewed this product
            $existingReview = ProductReview::where('user_id', Auth::id())
                ->where('item_id', $request->product_id)
                ->first();

            if ($existingReview) {
                \Log::warning('Duplicate review attempt:', [
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id
                ]);
                return back()->withErrors([
                    'error' => 'You have already reviewed this product.'
                ]);
            }

            // Handle image uploads
            $images = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('reviews', 'public');
                    $images[] = $path;
                }
            }

            // Create review
            $review = ProductReview::create([
                'user_id' => Auth::id(),
                'item_id' => $request->product_id,
                'rating' => $request->rating,
                'review' => $request->comments,
                'review_image' => $images[0] ?? null, // Only store the first image since product_feedback only supports one image
            ]);

            \Log::info('Review created:', $review->toArray());

            return back()->with('success', 'Review submitted successfully.');
            
        } catch (\Exception $e) {
            \Log::error('Review submission error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors([
                'error' => 'Failed to submit review. Please try again.'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductReview $review)
    {
        \Log::info('Update review request:', [
            'request_data' => $request->all(),
            'review_id' => $review->id,
            'current_user' => Auth::id(),
            'review_user' => $review->user_id
        ]);

        // Verify ownership
        if ($review->user_id !== Auth::id()) {
            \Log::warning('Unauthorized review update attempt', [
                'user_id' => Auth::id(),
                'review_id' => $review->id,
                'review_user_id' => $review->user_id
            ]);
            return back()->with('error', 'You are not authorized to update this review.');
        }

        try {
            $validated = $request->validate([
                'rating' => ['required', 'integer', 'min:1', 'max:5'],
                'review' => ['required', 'string', 'min:10', 'max:500'],
                'review_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:2048']
            ]);

            \Log::info('Validated data:', $validated);

            // Handle new image upload
            $newImagePath = null;
            if ($request->hasFile('review_image')) {
                \Log::info('Processing image upload');
                // Delete old image if it exists
                if ($review->review_image) {
                    Storage::disk('public')->delete($review->review_image);
                }
                // Store new image
                $newImagePath = $request->file('review_image')->store('reviews', 'public');
                \Log::info('New image path:', ['path' => $newImagePath]);
            }

            // Update review
            $updateData = [
                'rating' => $validated['rating'],
                'review' => $validated['review']
            ];

            if ($newImagePath) {
                $updateData['review_image'] = $newImagePath;
            }

            \Log::info('Final update data:', $updateData);

            \Log::info('Updating review with data:', $updateData);
            
            $review->update($updateData);

            return back()->with('success', 'Review updated successfully.');

        } catch (\Exception $e) {
            \Log::error('Review update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductReview $review)
    {
        // Verify ownership
        if ($review->user_id !== Auth::id()) {
            return back()->with('error', 'You are not authorized to delete this review.');
        }

        try {
            // Delete associated image
            if ($review->review_image) {
                Storage::disk('public')->delete($review->review_image);
            }

            $review->delete();
            return back()->with('success', 'Review deleted successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete review. Please try again.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductReview $review)
    {
        \Log::info('Edit review page request:', [
            'review_id' => $review->id,
            'current_user' => Auth::id(),
            'review_user' => $review->user_id
        ]);

        // Verify ownership
        if ($review->user_id !== Auth::id()) {
            \Log::warning('Unauthorized review edit page access', [
                'user_id' => Auth::id(),
                'review_id' => $review->id,
                'review_user_id' => $review->user_id
            ]);
            return back()->with('error', 'You are not authorized to edit this review.');
        }

        return Inertia::render('Reviews/Edit', [
            'review' => $review
        ]);
    }

    /**
     * Get the average rating for a product
     */
    public function getAverageRating($product_id)
    {
        $stats = Review::where('product_id', $product_id)
            ->selectRaw('COUNT(*) as total_reviews, AVG(rating) as average_rating')
            ->first();

        return response()->json([
            'average_rating' => $stats->average_rating ? round($stats->average_rating, 1) : 0,
            'total_reviews' => (int) $stats->total_reviews
        ]);
    }
}
