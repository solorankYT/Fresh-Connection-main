<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;


class ProductReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = ProductReview::with([
                'user:id,first_name,last_name',
                'orderItem.product'
            ])
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review' => $review->review,
                    'review_image' => $review->review_image,
                    'created_at' => $review->created_at,
                    'user' => $review->user ? [
                        'id' => $review->user->id,
                        'first_name' => $review->user->first_name,
                        'last_name' => $review->user->last_name,
                    ] : null
                ];
            });

        return response()->json($reviews);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:order_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:500',
            'review_image' => 'nullable|file|image|mimes:jpeg,png,jpg|max:2048', // Validate file
        ]);

        // Add user_id to validated data
        $validated['user_id'] = auth()->id();

        // Handle image upload
        if ($request->hasFile('review_image')) {
            $validated['review_image'] = $request->file('review_image')->store('reviews', 'public');
        }

        // Create the review and load the user relationship
        $review = ProductReview::create($validated);
        $review->load(['user:id,first_name,last_name']);

        // Return a JSON response with the created review
        return back()->with([
            'success' => 'Review submitted successfully!',
            'review' => $review
        ]);

        return redirect()->back()->with('success', 'Thank you for your feedback!');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductReview $productReview)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductReview $productReview)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductReview $productReview)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductReview $productReview)
    {
        //
    }
}
