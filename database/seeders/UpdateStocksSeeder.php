<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateStocksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Product::all()->each(function ($product) {
            $product->stocks = rand(0, 100); // Assign a random number between 0 and 100
            $product->save();
        });
    }
}
