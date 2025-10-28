<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;

class RecalculateOrderTotals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:recalculate-totals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate and update the subtotal and total fields for all orders';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Recalculating order totals...');

        // Fetch all orders
        $orders = Order::with('orderItems')->get();

        foreach ($orders as $order) {
            // Calculate the subtotal as the sum of all order item totals
            $subtotal = $order->orderItems->sum('total');

            // Update the order's subtotal and total
            $order->update([
                'subtotal' => $subtotal,
                'total' => $subtotal + $order->delivery_fee,
            ]);

            $this->info("Order #{$order->id} updated: Subtotal = {$subtotal}, Total = " . ($subtotal + $order->delivery_fee));
        }

        $this->info('Order totals recalculated successfully.');

        return Command::SUCCESS;
    }
}