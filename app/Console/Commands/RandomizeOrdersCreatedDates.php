<?php

namespace App\Console\Commands;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RandomizeOrdersCreatedDates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:randomize-orders-created-dates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Randomize order dates from November 2024 to present';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to randomize order dates...');
        
        // Define date range (November 1, 2024 to present)
        $startDate = Carbon::create(2024, 11, 1, 0, 0, 0);
        $endDate = Carbon::now();
        
        // Get all orders
        $orders = Order::all();
        
        $this->info("Found {$orders->count()} orders to update.");
        
        $bar = $this->output->createProgressBar($orders->count());
        $bar->start();
        
        foreach ($orders as $order) {
            // Generate a random date between start and end dates
            $randomDate = Carbon::createFromTimestamp(
                rand($startDate->timestamp, $endDate->timestamp)
            );
            
            // Also generate a random time for the same day
            $randomHour = rand(8, 20); // Between 8 AM and 8 PM
            $randomMinute = rand(0, 59);
            $randomSecond = rand(0, 59);
            
            $randomDate->setTime($randomHour, $randomMinute, $randomSecond);
            
            // Update created_at and updated_at
            DB::table('orders')
                ->where('id', $order->id)
                ->update([
                    'created_at' => $randomDate,
                    'updated_at' => $randomDate,
                ]);
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
        $this->info('Orders dates have been randomized successfully!');
        
        return Command::SUCCESS;
    }
}
