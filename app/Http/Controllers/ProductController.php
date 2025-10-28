<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Fetch unique categories for dropdown
        $categories = Product::whereNotNull('category')->distinct()->pluck('category');

        $query = Product::query();

        // ✅ Apply category filter if selected
        if ($request->filled('category') && $request->category !== 'All Products') {
            $query->where('category', $request->category);
        }

        // ✅ Apply sorting logic
        switch ($request->input('sort', 'A-Z')) {
            case 'A-Z':
                $query->orderBy('product_name', 'asc');
                break;
            case 'Z-A':
                $query->orderBy('product_name', 'desc');
                break;
            case 'Price: Low to High':
                $query->orderBy('product_price', 'asc');
                break;
            case 'Price: High to Low':
                $query->orderBy('product_price', 'desc');
                break;
            default:
                $query->latest();
                break;
        }

        // ✅ Fetch paginated products (preserve filters in pagination links)
        $products = $query->select('*')
            ->paginate(36)
            ->appends(request()->query());


        return Inertia::render('Products', [
            'categories' => $categories,
            'products' => $products,
            'filters' => $request->only(['category', 'sort']) // ✅ Preserve filters in frontend
        ]);

    }
}
