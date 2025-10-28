<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;

class DashboardController extends Controller
{
   public function index()
{
    $summary = [
        'totalProducts' => \App\Models\Product::count(),
        'activeProducts' => \App\Models\Product::where('status', 'active')->count(),
        'inactiveProducts' => \App\Models\Product::where('status', 'inactive')->count(),
        'outOfStockProducts' => \App\Models\Product::where('stocks', 0)->count(),
    ];

     $summaryUser = [
            'totalUsers' => User::count(),
            'activeUsers' => User::where('status', 'active')->count(),
            'inactiveUsers' => User::where('status', 'inactive')->count(),
        ];

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


    return Inertia::render('admin/Dashboard', [
        'summary' => $summary,
        'chartData' => $chartData,
        'topCustomers' => $topCustomers,
        'topProducts' => $topProducts,
        'summaryUser' => $summaryUser,
    ]);
}

}
