<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class ManageProductsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query();

        // Apply search filter
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            $query->where('product_name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
        }

        // Apply sorting
        $validSortKeys = ['product_name', 'category', 'final_price', 'stocks', 'status'];
        $sortKey = $request->input('sort_key', 'product_name'); // Default to 'product_name'
        $sortDirection = $request->input('sort_direction', 'asc') === 'desc' ? 'desc' : 'asc';

        if (in_array($sortKey, $validSortKeys)) {
            $query->orderBy($sortKey, $sortDirection);
        }

        // Paginate the results
        $products = $query->paginate(10);

        // Calculate summary
        $summary = [
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('status', 'active')->count(),
            'inactiveProducts' => Product::where('status', 'inactive')->count(),
            'outOfStockProducts' => Product::where('stocks', 0)->count(),
        ];

        return Inertia::render('admin/ManageProducts', [
            'products' => $products,
            'summary' => $summary,
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('admin/EditProduct', [
            'product' => $product
        ]);
    }

    public function store(Request $request)
    {
        // Cast 'vat_exempt' to boolean
        $request->merge([
            'vat_exempt' => filter_var($request->input('vat_exempt'), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validatedData = $request->validate([
            'product_name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'product_description' => 'nullable|string',
            'product_serving' => 'nullable|string|max:255',
            'final_price' => 'required|numeric|min:0',
            'vat_exempt' => 'nullable|boolean',
            'stocks' => 'required|integer|min:0',
            'status' => 'required|string|in:active,inactive',
            'expiration_date' => 'nullable|date',
            'storage_temperature' => 'nullable|string|max:255',
            'requires_temperature_control' => 'nullable|boolean',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_image_1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_image_2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Calculate VAT and Base Price
        $finalPrice = $validatedData['final_price'];
        $vat = $validatedData['vat_exempt'] ? 0 : 12; // Set VAT to 0 if VAT exempt
        $basePrice = $vat > 0 ? $finalPrice / (1 + $vat / 100) : $finalPrice;

        // Handle image uploads
        $imagePaths = [];
        foreach (['product_image', 'product_image_1', 'product_image_2'] as $key) {
            if ($request->hasFile($key)) {
                $imagePaths[$key] = $request->file($key)->store('products', 'public');
            }
        }

        // Create the product
        Product::create([
            'product_name' => $validatedData['product_name'],
            'category' => $validatedData['category'],
            'product_description' => $validatedData['product_description'],
            'product_serving' => $validatedData['product_serving'],
            'final_price' => $finalPrice,
            'product_price' => $basePrice,
            'vat' => $vat,
            'stocks' => $validatedData['stocks'],
            'status' => $validatedData['status'],
            'expiration_date' => $validatedData['expiration_date'],
            'storage_temperature' => $validatedData['storage_temperature'],
            'requires_temperature_control' => $validatedData['requires_temperature_control'],
            'product_image' => $imagePaths['product_image'] ?? null,
            'product_image_1' => $imagePaths['product_image_1'] ?? null,
            'product_image_2' => $imagePaths['product_image_2'] ?? null,
        ]);

        // Redirect back with success message using Inertia
        return redirect()->route('admin.manage-products')->with('success', 'Product created successfully!');
    }

    public function update(Request $request, $product_id)
    {
        try {
            $product = Product::findOrFail($product_id);

            $validated = $request->validate([
                'product_name' => 'required|string|max:255',
                'product_description' => 'nullable|string',
                'product_serving' => 'nullable|string|max:255',
                'final_price' => 'required|numeric|min:0',
                'vat' => 'required|numeric|min:0|max:100',
                'stocks' => 'required|integer|min:0',
                'category' => 'nullable|string|max:255',
                'status' => 'required|in:active,inactive',
                'expiration_date' => 'nullable|date',
                'storage_temperature' => 'nullable|string|max:255',
                'requires_temperature_control' => 'nullable|boolean',
                'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'product_image_1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'product_image_2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Calculate product_price
            $finalPrice = $validated['final_price'];
            $vat = $validated['vat']; // Updated to use 'vat'
            $productPrice = $finalPrice - ($finalPrice * ($vat / 100));

            // Handle image uploads
            $imagePaths = [];
            foreach (['product_image', 'product_image_1', 'product_image_2'] as $key) {
                if ($request->hasFile($key)) {
                    $imagePaths[$key] = $request->file($key)->store('products', 'public');
                } else {
                    $imagePaths[$key] = $product->{$key};
                }
            }

            // Update the product
            $updated = $product->update(array_merge($validated, [
                'product_price' => $productPrice,
                'vat' => $vat, // Save the VAT value
            ], $imagePaths));
            Log::info('Product update result:', ['id' => $product_id, 'updated' => $updated]);

            return redirect()->back()->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating product:', ['message' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function bulkUpdate(Request $request)
    {
        $products = $request->input('products'); // Retrieve the array of products

        Log::info('Bulk update request data:', ['products' => $products]);

        if (!$products || !is_array($products)) {
            return redirect()->back()->withErrors(['error' => 'Invalid data format']);
        }

      foreach ($products as $productData) {
            Log::info('Processing product:', ['id' => $productData['product_id'], 'data' => $productData]);

            $product = Product::find($productData['product_id']);
            if (!$product) {
                Log::warning('Product not found for update:', ['id' => $productData['product_id']]);
                continue;
            }

            $mergedData = array_intersect_key($productData, array_flip($product->getFillable()));

            try {
                $validatedData = validator($mergedData, [
                    'final_price' => 'sometimes|numeric|min:0',
                    'stocks' => 'sometimes|integer|min:0',
                    'status' => 'sometimes|string|in:active,inactive',
                ])->validate();
            } catch (\Exception $e) {
                Log::error('Validation failed:', [
                    'id' => $productData['product_id'],
                    'error' => $e->getMessage(),
                ]);
                continue;
            }

            $updated = $product->update($validatedData);
            Log::info('Product update result:', [
                'id' => $productData['product_id'],
                'updated' => $updated,
            ]);
        }
        
        return redirect()->route('admin.manage-products')->with('success', 'Products updated successfully!');
    }

    public function destroy(Request $request, Product $product)
    {
        $productId = $request->input('product_id') ?? $product->product_id; // Retrieve id from request if not in route
        Log::info('Product ID:', ['product_id' => $productId]);

        $product = Product::find($productId);
        if ($product) {
            $product->delete();
            return redirect()->back()->with('success', 'Product deleted successfully.');
        }

        return redirect()->back()->withErrors(['error' => 'Product not found.']);
    }
}
