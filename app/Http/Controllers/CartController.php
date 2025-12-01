<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Copy items from a previous order to the cart
     */
    public function buyAgain(Request $request, $orderId)
    {
        \Log::info('Starting buyAgain process', ['orderId' => $orderId]);
        
        try {
            $order = Order::with('items.product')->findOrFail($orderId);
            \Log::info('Order found', ['order' => $order->toArray()]);
            
            // Check if the order belongs to the authenticated user
            if ($order->user_id !== Auth::id()) {
                \Log::error('Unauthorized access to order', ['user_id' => Auth::id(), 'order_user_id' => $order->user_id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to order'
                ], 403);
            }

            $addedItems = 0;
            // Add each item from the order to the cart
        foreach ($order->items as $item) {
            \Log::info('Processing order item', [
                'item_id' => $item->id,
                'product' => $item->product ? $item->product->toArray() : null
            ]);
            
            // Fetch the latest product data directly
            $product = Product::where('product_id', $item->product_id)->first();
            
            \Log::info('Product details', [
                'order_item_product_id' => $item->product_id,
                'product_found' => (bool)$product,
                'product_details' => $product ? $product->toArray() : null
            ]);
            
            if (!$product) {
                \Log::warning('Skipping item - product not found', [
                    'item_id' => $item->id,
                    'product_id' => $item->product_id
                ]);
                continue;
            }

            // Check if item already exists in cart
            $cartItem = Cart::where('user_id', Auth::id())
                ->where('product_id', $product->product_id)  // Use the fetched product's ID
                ->first();

            \Log::info('Checking existing cart item', [
                'user_id' => Auth::id(),
                'product_id' => $item->product_id,
                'exists' => (bool)$cartItem
            ]);

            try {
                if ($cartItem) {
                    // Update quantity if item exists
                    \Log::info('Updating existing cart item', [
                        'cart_item_id' => $cartItem->id,
                        'old_quantity' => $cartItem->quantity,
                        'adding_quantity' => $item->quantity
                    ]);
                    
                    $cartItem->update([
                        'quantity' => $cartItem->quantity + $item->quantity
                    ]);
                } else {
                    // Create new cart item
                    \Log::info('Creating new cart item', [
                        'user_id' => Auth::id(),
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity
                    ]);
                    
                    Cart::create([
                        'user_id' => Auth::id(),
                        'product_id' => $product->product_id,  // Use the fetched product's ID
                        'quantity' => $item->quantity
                    ]);
                }
                $addedItems++;
            } catch (\Exception $e) {
                \Log::error('Error adding/updating cart item', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e; // Re-throw to be caught by outer try-catch
            }
        }

            if ($addedItems > 0) {
                return redirect()->route('cart.index')->with('success', 'Items added to cart successfully');
            } else {
                return back()->with('error', 'No items could be added to cart. Products might be out of stock.');
            }
        } catch (\Exception $e) {
            \Log::error('Error in buyAgain', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while adding items to cart'
            ], 500);
        }
    }

    // ✅ Show the cart items for the authenticated user
    public function index(): Response
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with('product')
            ->get();

        $products = Product::select('*')
            ->inRandomOrder()
            ->limit(12)
            ->get(); // Fetch products instead of pagination

        $activePromotion = $this->getActivePromotion();

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
            'products' => $products,
            'activePromotion' => $activePromotion
        ]);
    }

    // ✅ Add a product to the cart
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); // Redirect if not logged in
        }

        $request->validate([
            'product_id' => 'required|string|exists:products,product_id', // ✅ Ensure it's a string
            'quantity' => 'required|integer|min:1'
        ]);

        // ✅ Check if the product already exists in the user's cart
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', (string) $request->product_id) // ✅ Convert product_id to string
            ->first();

        if ($cartItem) {
            // Update the quantity if product already exists in cart
            $cartItem->update(['quantity' => $cartItem->quantity + $request->quantity]);
        } else {
            // Create a new cart entry
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => (string) $request->product_id, // ✅ Ensure product_id is stored as string
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Product added to cart!');
    }

  public function update(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,product_id',
        'quantity' => 'required|integer|min:1',
    ]);

    Cart::where('user_id', Auth::id())
        ->where('product_id', $request->product_id)
        ->update(['quantity' => $request->quantity]);

    return back();
}



    // ✅ Remove an item from the cart
    public function destroy($id)
    {
        $cartItem = Cart::where('id', $id)->where('user_id', Auth::id())->first();

        if ($cartItem) {
            $cartItem->delete();
            return back()->with('success', 'Item removed from cart.');
        }

        return back()->with('error', 'Item not found.');
    }

    /**
     * Apply a promotion code to the cart
     */
    public function applyPromo(Request $request)
    {
        try {
            Log::info('Applying promotion code', ['request' => $request->all()]);
            
            $validated = $request->validate([
                'code' => 'required|string'
            ]);

            Log::info('Searching for promotion', ['code' => $request->code]);
            $promotion = Promotion::where('code', $request->code)
                ->where('status', 'active')
                ->first();

            Log::info('Promotion search result', ['found' => (bool)$promotion]);
            
            if (!$promotion) {
                \Log::info('Promotion not found', ['code' => $request->code]);
                return response()->json([
                    'message' => 'Invalid promotion code'
                ], 404);
            }

        \Log::info('Found promotion', ['promotion' => $promotion->toArray()]);

        \Log::info('Validating promotion', ['promotion' => $promotion->toArray()]);
        if (!$promotion->isValid()) {
            \Log::info('Promotion is not valid');
            return response()->json(['message' => 'This promotion code is expired or inactive'], 400);
        }

            // Calculate cart total
            $cartTotal = Cart::where('user_id', Auth::id())
                ->with('product')
                ->get()
                ->reduce(function ($total, $item) {
                    return $total + ($item->product ? $item->quantity * $item->product->final_price : 0);
                }, 0);

            \Log::info('Cart total calculated', ['total' => $cartTotal]);
            if ($cartTotal < $promotion->minimum_purchase) {
                \Log::info('Minimum purchase not met', [
                    'cart_total' => $cartTotal,
                    'minimum_required' => $promotion->minimum_purchase
                ]);
                return response()->json([
                    'message' => "Minimum purchase amount of ₱{$promotion->minimum_purchase} required"
                ], 400);
            }

            // Store the promotion in the session
            \Log::info('Storing promotion in session');
            Session::put('active_promotion', $promotion);

            \Log::info('Promotion applied successfully');
            return response()->json([
                'message' => 'Promotion applied successfully',
                'promotion' => $promotion
            ]);
        } catch (\Exception $e) {
            \Log::error('Error applying promotion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'An error occurred while applying the promotion'
            ], 500);
        }
    }

    /**
     * Remove the promotion code from the cart
     */
    public function removePromo()
    {
        try {
            \Log::info('Removing promotion from cart');
            Session::forget('active_promotion');
            \Log::info('Promotion removed successfully');
            return response()->json(['message' => 'Promotion removed successfully']);
        } catch (\Exception $e) {
            \Log::error('Error removing promotion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'An error occurred while removing the promotion'
            ], 500);
        }
    }

    /**
     * Get active promotion for the current cart
     */
    private function getActivePromotion()
    {
        try {
            $promotion = Session::get('active_promotion');
            \Log::info('Getting active promotion', ['promotion' => $promotion]);
            return $promotion;
        } catch (\Exception $e) {
            \Log::error('Error getting active promotion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }
}
