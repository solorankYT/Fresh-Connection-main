<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // ✅ Fetch Featured Products for Home Page
        $featuredProducts = Product::where('sub_category', 'Featured Products')
            ->select('*')
            ->limit(10)
            ->get();

            
        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts
        ]);
    }
}
