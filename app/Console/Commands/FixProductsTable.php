<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // Add this import


class FixProductsTable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:fix-tax-values';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix VAT and tax values for all products in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to update product tax values...');
        
        // Get count of products
        $count = Product::count();
        $this->info("Found {$count} products to update.");
        
        if ($count === 0) {
            $this->error('No products found. Nothing to update.');
            return Command::FAILURE;
        }
        
        // Create a progress bar
        $bar = $this->output->createProgressBar($count);
        $bar->start();
        
        // Process all products in chunks to avoid memory issues
        Product::chunk(100, function($products) use ($bar) {
            foreach ($products as $product) {
                // Set the values
                $vatPercentage = 12;
                $vat = $product->product_price * ($vatPercentage / 100);
                
                // Update the product
                $product->update([
                    'vat_percentage' => $vatPercentage,
                    'vat' => $vat,
                    'tax_percentage' => 0,
                    'tax' => 0,
                    'other_tax' => 0,
                    'final_price' => $product->product_price + $vat
                ]);
                
                $bar->advance();
            }
        });
        
        $bar->finish();
        $this->newLine(2);
        
        // Check if 'tax_exemption' column exists
        if (!Schema::hasColumn('products', 'tax_exemption')) {
            $this->warn("Column 'tax_exemption' does not exist in the products table.");
            $this->info("To add it, you need to create a migration:");
            $this->line("php artisan make:migration add_tax_exemption_to_products_table");
        } else {
            // Update tax_exemption if column exists
            DB::table('products')->update(['tax_exemption' => 0]);
            $this->info("Updated 'tax_exemption' to 0 for all products.");
        }
        
        $this->info('All products have been updated successfully!');
        
        return Command::SUCCESS;
    }
}