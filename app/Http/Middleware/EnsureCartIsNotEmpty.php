<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;

class EnsureCartIsNotEmpty
{
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is authenticated and has items in the cart
        $cartItems = Cart::where('user_id', Auth::id())->exists();

        if (!$cartItems) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty. Please add items to proceed to checkout.');
        }

        return $next($request);
    }
}
