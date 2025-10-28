<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    // ✅ Fetch a single product by ID
    public function show($id)
    {
        $product = Product::where('product_id', $id)->firstOrFail();

        $products = Product::inRandomOrder()
            ->limit(12)
            ->get(); // Fetch products instead of pagination

        // Fetch reviews for the product
        $reviews = ProductReview::with(['orderItem.order', 'user:id,first_name,last_name'])
            ->whereHas('orderItem', function ($query) use ($id) {
                $query->where('product_id', $id);
            })
            ->latest()
            ->get();

        return Inertia::render('Item', [
            'product' => $product,
            'products' => $products,
            'reviews' => $reviews,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query', '');

        // Fetch products matching the search query
        $productSearch = Product::where('product_name', 'LIKE', '%' . $query . '%')
            ->get();

        return response()->json([
            'productSearch' => $productSearch,
        ]);
    }
}
