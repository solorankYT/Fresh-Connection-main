<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderTracking;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OrderTrackingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all orders
        $orders = Order::all();
        
        if ($orders->isEmpty()) {
            $this->command->info('No orders found. Seeding aborted.');
            return;
        }
        
        $this->command->info("Seeding order tracking for {$orders->count()} orders...");
        
        // Create a progress bar
        $bar = $this->command->getOutput()->createProgressBar($orders->count());
        $bar->start();
        
        // Primary status options
        $primaryStatuses = ['placed', 'shipped', 'delivered', 'completed'];
        
        // Secondary status options keyed by primary status
        $secondaryStatuses = [
            'placed' => [
                'Order confirmed',
                'Payment received',
                'Processing',
                'Preparing for shipment'
            ],
            'shipped' => [
                'Package picked up by courier',
                'In transit',
                'Package arrived at sorting facility',
                'Out for delivery'
            ],
            'delivered' => [
                'Package delivered to recipient',
                'Left at door',
                'Signed by recipient'
            ],
            'completed' => [
                'Order fulfilled',
                'Customer feedback received',
                'Transaction complete'
            ]
        ];
        
        // Comments for each status
        $comments = [
            'placed' => [
                'Order has been placed successfully.',
                'Thank you for your order! We\'re processing it now.',
                'Your order is confirmed and payment has been received.',
                'We\'re preparing your items for shipment.'
            ],
            'shipped' => [
                'Your order has been shipped and is on its way!',
                'Package has been picked up by our delivery partner.',
                'Your package is in transit to your location.',
                'Delivery attempt will be made soon.'
            ],
            'delivered' => [
                'Your package has been delivered successfully.',
                'Package was left at the front door as requested.',
                'Package was received and signed for.',
                'Delivery complete. Thank you for shopping with us!'
            ],
            'completed' => [
                'Your order is now complete. We hope you enjoy your purchase!',
                'Order has been marked as completed. Thank you for your business!',
                'Transaction is now complete. Please shop with us again soon!',
                'Order fulfilled successfully. We appreciate your support!'
            ]
        ];
        
        foreach ($orders as $order) {
            // Get order creation date
            $baseDate = Carbon::parse($order->created_at);
            
            // Create entry for each primary status
            foreach ($primaryStatuses as $index => $status) {
                // Add some days to create chronological dates
                $statusDate = (clone $baseDate)->addDays($index);
                
                // Create the primary status entry
                OrderTracking::create([
                    'order_id' => $order->id,
                    'primary_status' => $status,
                    'secondary_status' => null,
                    'comments' => $comments[$status][array_rand($comments[$status])],
                    'updated_by' => 1,
                    'created_at' => $statusDate,
                    'updated_at' => $statusDate,
                ]);
                
                // Add 1-2 secondary status updates between primary ones (except for the last status)
                if ($index < count($primaryStatuses) - 1) {
                    // Determine how many secondary updates (1-2)
                    $secondaryCount = rand(1, 2);
                    
                    for ($i = 0; $i < $secondaryCount; $i++) {
                        // Calculate time between statuses and add a portion of it
                        $hoursToAdd = ($i + 1) * 8; // 8 or 16 hours after the primary status
                        $secondaryDate = (clone $statusDate)->addHours($hoursToAdd);
                        
                        // Get random secondary status for this primary status
                        $secondaryStatus = $secondaryStatuses[$status][array_rand($secondaryStatuses[$status])];
                        
                        // Create the secondary status entry
                        OrderTracking::create([
                            'order_id' => $order->id,
                            'primary_status' => $status,
                            'secondary_status' => $secondaryStatus,
                            'comments' => "Update: {$secondaryStatus}",
                            'updated_by' => 1,
                            'created_at' => $secondaryDate,
                            'updated_at' => $secondaryDate,
                        ]);
                    }
                }
            }
            
            // Update the order status to match the final tracking status
            $order->status = end($primaryStatuses);
            $order->save();
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->command->getOutput()->newLine(2);
        $this->command->info('Order tracking seeded successfully!');
    }
}
