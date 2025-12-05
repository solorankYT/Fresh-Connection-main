<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     
        $orders = Order::all();        
        
        if ($orders->isEmpty()) {
            $this->command->info('No orders found within the specified range.');
            return;
        }
        
        // Get all products for random selection
        $products = Product::all();
        
        if ($products->isEmpty()) {
            $this->command->info('No products found in the database!');
            return;
        }
        
        $this->command->info("Seeding order items for {$orders->count()} orders...");
        
        // Create a progress bar - FIX: Use $this->command->getOutput() instead of $this->output
        $bar = $this->command->getOutput()->createProgressBar($orders->count());
        $bar->start();
        
        // Loop through each order and create 1-5 order items for it
        foreach ($orders as $order) {
            // Generate random number of items (5-15) for this order
            $itemCount = rand(5, 15);
            
            // Keep track of products already added to this order to avoid duplicates
            $addedProducts = [];
            
            for ($i = 0; $i < $itemCount; $i++) {
                // Get a random product that hasn't been added to this order yet
                do {
                    $product = $products->random();
                } while (in_array($product->product_id, $addedProducts) && count($addedProducts) < $products->count());
                
                // Add product to tracking array to avoid duplicates
                $addedProducts[] = $product->product_id;
                
                // Generate random quantity (1-9)
                $quantity = rand(1, 9);
                
                // Get price from product
                $price = $product->final_price;
                
                // Calculate VAT
                $vatPercentage = 12;
                $vat = $price * ($vatPercentage / 100);
                
                $finalPrice = $price + $vat;
                
                // Calculate total
                $total = $finalPrice * $quantity;
                
                // Create the order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->product_id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'vat_exemption' => 0,
                    'vat_percentage' => $vatPercentage,
                    'vat' => $vat,
                    'discount' => null,
                    'tax_percentage' => 0,
                    'tax' => 0,
                    'final_price' => $finalPrice,
                    'total' => $total,
                ]);
            }
            
            // Update the order totals
            $orderItems = OrderItem::where('order_id', $order->id)->get();
            $subtotal = $orderItems->sum('total');
            $order->subtotal = $subtotal;
            $order->total = $subtotal + $order->delivery_fee;
            $order->save();
            
            $bar->advance();
        }
        
        $bar->finish();
        // Also fix the newLine method
        $this->command->getOutput()->newLine(2);
        
        $this->command->info('Order items seeded successfully! All orders now have order items.');
    }
}
