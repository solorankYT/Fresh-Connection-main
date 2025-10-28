<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SetVatPercentage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vat:set-percentage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set the VAT percentage to 12 for all products and order items';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Update VAT percentage in the products table
        DB::table('products')->update(['vat' => 12]);

        // Update VAT percentage in the order_items table
        DB::table('order_items')->update(['vat' => 12]);

        $this->info('VAT percentage has been set to 12 for all products and order items.');

        return Command::SUCCESS;
    }
}
