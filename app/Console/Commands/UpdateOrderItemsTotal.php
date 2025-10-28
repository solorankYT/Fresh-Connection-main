<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\OrderItem;

class UpdateOrderItemsTotal extends Command
{
    protected $signature = 'update:order-items-total';
    protected $description = 'Update the total column for all existing order items';

    public function handle()
    {
        $this->info('Updating total column for order items...');

        // Fetch all order items and update their total
        OrderItem::all()->each(function ($item) {
            $item->update([
                'total' => $item->quantity * $item->price, // Calculate total
            ]);
        });

        $this->info('Total column updated successfully!');
    }
}
