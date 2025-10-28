<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Promotion;
use App\Notifications\OrderStatusUpdated;
use App\Notifications\InvoiceGenerated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\InvoiceController;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        $cartItems = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();

        $user = Auth::user(); // Get the authenticated user

        $activePromotion = session('active_promotion');

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'activePromotion' => $activePromotion,
            'auth' => [
                'user' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'street_address' => $user->street_address,
                    'barangay' => $user->barangay,
                    'postal_code' => $user->postal_code ? (string) $user->postal_code : null, // Convert to string
                    'city' => $user->city,
                    'state' => $user->state,
                    'phone_number' => $user->phone_number ? (string) $user->phone_number : null, // Convert to string
                ],
            ],
        ]);
    }

    public function applyPromo(Request $request)
    {
        try {
            Log::info('Applying promotion code at checkout', ['request' => $request->all()]);
            
            $validated = $request->validate([
                'code' => 'required|string'
            ]);

            $promotion = Promotion::where('code', $request->code)
                ->where('status', 'active')
                ->first();

            if (!$promotion) {
                Log::info('Promotion not found', ['code' => $request->code]);
                return response()->json([
                    'message' => 'Invalid promotion code'
                ], 404);
            }

            if ($promotion->status !== 'active') {
                Log::info('Promotion is not active');
                return response()->json([
                    'message' => 'This promotion code is not currently active'
                ], 400);
            }

            $currentDate = now();
            Log::info('Checking promotion dates', [
                'current_date' => $currentDate->format('Y-m-d H:i:s'),
                'start_date' => $promotion->start_date ? $promotion->start_date->format('Y-m-d H:i:s') : 'no start date',
                'end_date' => $promotion->end_date ? $promotion->end_date->format('Y-m-d H:i:s') : 'no end date',
                'timezone' => config('app.timezone')
            ]);

            if ($promotion->start_date && $promotion->start_date > $currentDate) {
                Log::info('Promotion has not started yet', [
                    'start_date' => $promotion->start_date->format('Y-m-d H:i:s'),
                    'current_date' => $currentDate->format('Y-m-d H:i:s'),
                    'comparison' => $promotion->start_date->gt($currentDate)
                ]);
                return response()->json([
                    'message' => 'This promotion code is not valid yet. It starts on ' . $promotion->start_date->format('M j, Y')
                ], 400);
            }

            if ($promotion->end_date && $promotion->end_date < $currentDate) {
                Log::info('Promotion has expired', [
                    'end_date' => $promotion->end_date->format('Y-m-d H:i:s'),
                    'current_date' => $currentDate->format('Y-m-d H:i:s')
                ]);
                return response()->json([
                    'message' => 'This promotion code expired on ' . $promotion->end_date->format('M j, Y')
                ], 400);
            }

            $cartTotal = Cart::where('user_id', Auth::id())
                ->with('product')
                ->get()
                ->reduce(function ($total, $item) {
                    return $total + ($item->product ? $item->quantity * $item->product->final_price : 0);
                }, 0);

            if ($cartTotal < $promotion->minimum_purchase) {
                Log::info('Minimum purchase not met', [
                    'cart_total' => $cartTotal,
                    'minimum_required' => $promotion->minimum_purchase
                ]);
                return response()->json([
                    'message' => "Minimum purchase amount of ₱{$promotion->minimum_purchase} required"
                ], 400);
            }

            session(['active_promotion' => $promotion]);

            return response()->json([
                'message' => 'Promotion applied successfully',
                'promotion' => $promotion
            ]);
        } catch (\Exception $e) {
            Log::error('Error applying promotion at checkout', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'An error occurred while applying the promotion'
            ], 500);
        }
    }

    public function removePromo()
    {
        try {
            session()->forget('active_promotion');
            return response()->json([
                'message' => 'Promotion removed successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error removing promotion at checkout', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'An error occurred while removing the promotion'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());    // Get cart items
    $cartItems = Cart::with('product')
        ->where('user_id', Auth::id())
        ->get();

    // Calculate subtotal before promotion
    $subtotal = $cartItems->sum(function ($item) {
        return ($item->quantity * $item->product->final_price) - $item->product->discount;
    });

    // Get active promotion from session
    $promotion = session('active_promotion');
    $discountAmount = 0;

    // Calculate promotion discount if applicable
    if ($promotion) {
        if ($promotion->discount_type === 'percentage') {
            $discountAmount = ($subtotal * $promotion->discount_value / 100);
        } else {
            $discountAmount = $promotion->discount_value;
        }
    }

    // Add delivery fee (example $5.00, replace with actual logic)
    $deliveryFee = 5.00;

    // Calculate final total with promotion discount
    $finalTotal = $subtotal - $discountAmount + $deliveryFee;

    // Payment status based on payment method
    $paymentStatus = $request->payment_method === 'cod' ? 'paid' : 'unpaid';

    // Create the order with the correct payment status and voucher details
    $order = Order::create([
        'user_id' => Auth::id(),
        'subtotal' => $subtotal,
        'discount' => $discountAmount,
        'promotion_id' => $promotion ? $promotion->id : null,
        'total' => $finalTotal,
        'delivery_fee' => $deliveryFee,
        'paid' => $paymentStatus,
        ...$validated,
    ]);

    // Create order tracking entry
    $tracking = OrderTracking::create([
        'order_id' => $order->id,
        'primary_status' => 'placed',
        'secondary_status' => '',
        'comments' => $paymentStatus === 'paid' ? 'Order placed successfully. Awaiting delivery.' : 'Order placed successfully. Awaiting GCash payment proof.',
        'updated_by' => Auth::id(),
    ]);

    // Create order items
    foreach ($cartItems as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'price' => $item->product->product_price,
            'vat_percentage' => $item->product->vat_percentage,
            'vat' => $item->product->vat,
            'vat_exemption' => $item->product->tax_exemption,
            'discount' => $item->product->discount ?? 0,
            'tax_percentage' => $item->product->tax_percentage,
            'tax' => $item->product->tax,
            'final_price' => $item->product->final_price,
            'total' => $item->quantity * $item->product->final_price,
        ]);
    }

    // Clear the cart
    Cart::where('user_id', Auth::id())->delete();

    // Send order confirmation and invoice immediately
    try {
        $user = Auth::user();
        
        // Send notifications
        $user->notify(new OrderStatusUpdated($order));
        $user->notify(new InvoiceGenerated($order));
        
        Log::info('Order confirmation and invoice sent', [
            'order_id' => $order->id,
            'user_email' => $user->email
        ]);
    } catch (\Exception $e) {
        Log::error('Failed to send order confirmation email or generate invoice', [
            'error' => $e->getMessage(),
            'order_id' => $order->id
        ]);
    }

    // Redirect to the tracking page with success message
    return redirect()->route('tracking', ['order_id' => $order->id])
        ->with('success', 'Order placed successfully! An invoice has been generated and sent to your email.');
}

private function validationRules(): array
{
    return [
        'first_name' => 'required|string|min:2',
        'last_name' => 'required|string|min:2',
        'address' => 'required|string|min:5',
        'zip_code' => 'required|string|min:4',
        'city' => 'required|string|min:2',
        'region' => 'required|string|min:2',
        'barangay' => 'required|string|min:2',
        'mobile_number' => 'required|string|min:10|max:15',
        'payment_method' => 'required|in:credit_card,gcash_or_maya,cod',
        'card_number' => 'nullable|string|size:16',
    ];
}

}
