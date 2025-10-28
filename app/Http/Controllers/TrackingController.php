<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductReview;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\OrderTracking;

class TrackingController extends Controller
{
    public function index(Request $request): Response
    {
        $orderId = $request->query('order_id');

        $query = Order::where('user_id', Auth::id());

        
        if ($orderId) {
            $query->where('id', $orderId);
        }

        $orderDetails = $query->with(['orderItems.product', 'orderTracking'])->get();

        $orderItems = OrderItem::with('product')
            ->whereIn('order_id', $orderDetails->pluck('id'))
            ->get();

        $reviews = ProductReview::whereIn('item_id', $orderItems->pluck('id'))
            ->with('user:id,first_name,last_name')
            ->get();


        return Inertia::render('Tracking', [
            'orderItems' => $orderItems,
            'orderDetails' => $orderDetails,
            'currentOrderId' => $orderId,
            'reviews' => $reviews,
        ]);
    }

    public function uploadPaymentProof(Request $request, $orderId)
    {
        $order = Order::where('user_id', Auth::id())->find($orderId);

        if (!$order) {
            return back()->with('error', 'Order not found.');
        }

        if ($order->paid !== 'unpaid') {
            return back()->with('error', 'This order has already been paid or does not require payment proof.');
        }

        $validated = $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $filePath = $request->file('payment_proof')->store('payment_proofs', 'public');

        $order->update([
            'paid' => 'payment_review', 
            'payment_proof' => $filePath, 
        ]);

        OrderTracking::create([
            'order_id' => $order->id,
            'primary_status' => 'payment_review',
            'secondary_status' => '',
            'comments' => 'Payment proof uploaded, awaiting verification.',
            'updated_by' => Auth::id(),
        ]);

        return back()->with('success', 'Payment proof uploaded successfully. Your order is under review.');
    }




}
