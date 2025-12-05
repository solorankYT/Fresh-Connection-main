<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SalesReportExport;
use Barryvdh\DomPDF\Facade\Pdf;

class SalesReportController extends Controller
{
    public function products()
    {
        $sales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.product_id')
            ->select(
                'products.product_id',
                'products.product_name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.total) as total_revenue')
            )
            ->groupBy('products.product_id', 'products.product_name')
            ->orderBy('total_sold', 'desc')
            ->get();

        return inertia('Reports/SalesReport', [
            'sales' => $sales
        ]);
    }

  
    // public function exportExcel()
    // {
    //     return Excel::download(new SalesReportExport, 'sales_report.xlsx');
    // }

    // Export PDF
    public function exportPDF()
    {
        $sales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.product_id')
            ->select(
                'products.product_name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.total) as total_revenue')
            )
            ->groupBy('products.product_name')
            ->get();

        $pdf = Pdf::loadView('pdf.sales_report', compact('sales'));

        return $pdf->download('sales_report.pdf');
    }
}
