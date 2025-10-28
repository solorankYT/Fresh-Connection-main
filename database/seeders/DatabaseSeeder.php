<?php

namespace Database\Seeders;

use App\Models\OrderTracking;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
public function run(): void
{
    $this->call([
        AdminSeeder::class,    
        UsersTableSeeder::class,   
        PromotionSeeder::class,   
        ProductSeeder::class,      
        OrdersTableSeeder::class,  
        OrderItemsSeeder::class,    
        OrderTrackingSeeder::class,  
        UpdateStocksSeeder::class,   
    ]);
}

}
