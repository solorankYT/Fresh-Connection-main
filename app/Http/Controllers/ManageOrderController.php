<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Notifications\InvoiceGenerated;

class ManageOrderController extends Controller
{
    public function index(Request $request): Response
    {

        // Get search and sort parameters
        $search = $request->input('search', '');
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $perPage = $request->input('per_page', 50);
        
        // Start query builder
        $query = Order::with(['user', 'orderItems.product', 'orderTracking', 'promotion']);
        
        // Apply search filter if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                // Search by order ID
                $q->where('id', 'like', "%{$search}%")
                  // Search by status
                  ->orWhere('status', 'like', "%{$search}%")
                  // Search by total
                  ->orWhere('total', 'like', "%{$search}%")
                  // Search by payment method
                  ->orWhere('payment_method', 'like', "%{$search}%")
                  // Search by user details
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('first_name', 'like', "%{$search}%")
                               ->orWhere('last_name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply sorting
        $query->orderBy($sortField, $sortDirection);
        
        // Get paginated results
        $orders = $query->paginate($perPage);
        
        // Get order statuses
        $orderStatus = OrderStatus::select('*')->get();
        
        // Get monthly order data for the last 6 months
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        // Query raw data for orders grouped by month
        $monthlyOrderData = DB::table('orders')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('YEAR(created_at) as year'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Format data for the chart
        $chartData = [];
        $monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Initialize with 0 counts for all 6 months
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthKey = $month->month;
            $yearKey = $month->year;

            $dataPoint = [
                'month' => $monthNames[$monthKey - 1],
                'orders' => 0,
                'monthKey' => $monthKey,
                'yearKey' => $yearKey
            ];

            $chartData[] = $dataPoint;
        }

        // Fill in actual counts
        foreach ($monthlyOrderData as $data) {
            foreach ($chartData as &$point) {
                if ($point['monthKey'] == $data->month && $point['yearKey'] == $data->year) {
                    $point['orders'] = $data->count;
                    break;
                }
            }
        }

        // Remove the utility keys
        foreach ($chartData as &$point) {
            unset($point['monthKey']);
            unset($point['yearKey']);
        }

        // Get top 5 customers by order total from last 6 months
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $topCustomers = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.email',
                'users.user_image',
                'users.created_at',
                DB::raw('COUNT(orders.id) as order_count'),
                DB::raw('SUM(orders.total) as total_spent')
            )
            ->where('orders.created_at', '>=', $sixMonthsAgo)
            ->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.email', 'users.user_image','users.created_at')
            ->orderBy('total_spent', 'desc')
            ->limit(5)
            ->get();

        // Get top 5 products from the last 6 months
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.product_id')
            ->select(
                'products.product_id',
                'products.product_name',
                'products.product_image',
                'products.product_price',
                'products.category',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total) as total_revenue')
            )
            ->where('orders.created_at', '>=', $sixMonthsAgo)
            ->groupBy('products.product_id', 'products.product_name', 'products.product_image', 'products.product_price', 'products.category')
            ->orderBy('total_revenue', 'desc')
            ->limit(5)
            ->get();


        return Inertia::render('admin/ManageOrders', [
            'orders' => $orders,
            'orderStatus' => $orderStatus,
            'chartData' => $chartData,
            'topCustomers' => $topCustomers,
            'topProducts' => $topProducts,
            // Add search parameters for maintaining state
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $updatedOrders = $request->input('orders', []);

        foreach ($updatedOrders as $orderData) {
            $order = Order::find($orderData['id']);
            if ($order) {
                $updateData = [
                    'status' => $orderData['status'] ?? $order->status,
                    'total' => $orderData['total'] ?? $order->total,
                ];

                // Set timestamps based on the status
                if (isset($orderData['status'])) {
                    switch ($orderData['status']) {
                        case 'shipped':
                            $updateData['shipped_at'] = now();
                            break;
                        case 'delivered':
                            $updateData['delivered_at'] = now();
                            break;
                        case 'completed':
                            $updateData['completed_at'] = now();
                            break;
                    }
                }

                $order->update($updateData);
            }
        }

        return redirect()->back()->with('message', 'Orders updated successfully!');
    }

    public function updateOrderItems(Request $request, $orderId)
    {
        $order = Order::find($orderId);

        if (!$order) {
            return redirect()->back()->with('error', 'Order not found.');
        }

        $orderItems = $request->input('order_items', []);

        foreach ($orderItems as $itemData) {
            $orderItem = $order->orderItems()->find($itemData['id']);
            if ($orderItem) {
                $quantity = $itemData['quantity'] ?? $orderItem->quantity;
                $price = $itemData['price'] ?? $orderItem->price;
                $discount = $itemData['discount'] ?? $orderItem->discount;
                $vat = $itemData['vat'] ?? $orderItem->vat;
                $tax = $itemData['tax'] ?? $orderItem->tax;

                $orderItem->update([
                    'quantity' => $quantity,
                    'price' => $price,
                    'discount' => $discount,
                    'vat' => $vat,
                    'tax' => $tax,
                    'total' => ($quantity * $price) - $discount + $vat + $tax,
                ]);
            }
        }

        // Recalculate the total for the order
        $subtotal = $order->orderItems->sum('total');
        $order->update([
            'subtotal' => $subtotal,
            'total' => $subtotal + $order->delivery_fee,
        ]);

        return redirect()->back()->with('message', 'Order items updated successfully!');
    }

    public function updateOrderStatus(Request $request, $orderId)
    {
        $validatedData = $request->validate([
            'primary_status' => 'nullable|string|max:255|required_without_all:secondary_status,comments',
            'secondary_status' => 'nullable|string|max:255|required_without_all:primary_status,comments',
            'comments' => 'nullable|string|required_without_all:primary_status,secondary_status',
        ]);

        $order = Order::find($orderId);

        if (!$order) {
            return redirect()->back()->with('error', 'Order not found.');
        }

        // Create a new OrderTracking entry
        $order->orderTracking()->create([
            'primary_status' => $validatedData['primary_status'],
            'secondary_status' => $validatedData['secondary_status'],
            'comments' => $validatedData['comments'],
            'updated_by' => auth()->id(), // Assuming you have authentication
        ]);

        // Update the order's status only if primary_status is provided
        if (!empty($validatedData['primary_status'])) {
            $order->update(['status' => $validatedData['primary_status']]);
        }

        return redirect()->back()->with('message', 'Order status updated successfully!');
    }

    public function destroy($id)
    {
        $order = Order::find($id);

        if ($order) {
            $order->delete();
            return redirect()->back()->with('message', 'Order deleted successfully!');
        }

        return redirect()->back()->with('error', 'Order not found.');
    }

    public function confirmOrder(Request $request, $orderId)
    {
        $order = Order::find($orderId);

        if (!$order) {
            return redirect()->back()->with('error', 'Order not found.');
        }

        if ($order->paid === 'paid') {
            return redirect()->back()->with('message', 'Order is already paid.');
        }

        $order->update(['paid' => 'paid']);

        $order->orderTracking()->create([
            'primary_status' => 'confirmed',
            'secondary_status' => '',
            'comments' => 'Order has been confirmed.',
        ]);

        try {
            // Send invoice notification
            $order->user->notify(new InvoiceGenerated($order));
            Log::info('Invoice sent for confirmed order', ['order_id' => $order->id]);
        } catch (\Exception $e) {
            Log::error('Failed to send invoice for confirmed order', [
                'error' => $e->getMessage(),
                'order_id' => $order->id
            ]);
        }

        return redirect()->back()->with('message', 'Order confirmed successfully and invoice has been generated!');
    }
}
