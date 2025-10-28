<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AddOrderStatusValues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order_status:add-values';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add predefined values to the order_status table';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $statuses = ['placed', 'shipped', 'delivered', 'completed', 'returned', 'cancelled'];

        foreach ($statuses as $status) {
            DB::table('order_status')->insert([
                'status' => $status,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->info('Order status values added successfully.');
    }
}