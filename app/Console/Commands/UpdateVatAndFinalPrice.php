<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\OrderItem;

class UpdateVatAndFinalPrice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:vat-and-final-price';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update VAT and final price for products and order items';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Updating VAT and final price for products...');
        
        // Update VAT and final_price for products
        Product::all()->each(function ($product) {
            $vat = $product->product_price * 0.12; // 12% VAT
            $finalPrice = $product->product_price + $vat;

            $product->update([
                'vat' => $vat,
                'final_price' => $finalPrice,
            ]);
        });

        $this->info('Products updated successfully.');

        $this->info('Updating VAT and final price for order items...');
        
        // Update VAT and final_price for order items
        OrderItem::all()->each(function ($orderItem) {
            $vat = $orderItem->price * 0.12; // 12% VAT
            $finalPrice = $orderItem->price + $vat;

            $orderItem->update([
                'vat' => $vat,
                'final_price' => $finalPrice,
            ]);
        });

        $this->info('Order items updated successfully.');

        return Command::SUCCESS;
    }
}