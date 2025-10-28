<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateVatValues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vat:update-values';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set the VAT percentage to 12 and calculate VAT for all products and order items';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Set VAT percentage to 12 and calculate VAT for the products table
        DB::table('products')->update(['vat_percentage' => 12]);
        DB::table('products')->update(['vat' => DB::raw('final_price * vat_percentage / 100')]);

        // Set VAT percentage to 12 and calculate VAT for the order_items table
        DB::table('order_items')->update(['vat_percentage' => 12]);
        DB::table('order_items')->update(['vat' => DB::raw('final_price * vat_percentage / 100')]);

        $this->info('VAT percentage has been set to 12, and VAT has been calculated for all products and order items.');

        return Command::SUCCESS;
    }
}