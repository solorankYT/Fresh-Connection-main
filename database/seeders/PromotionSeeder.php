<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use Carbon\Carbon;


class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $promotions = [
            [
                'name' => 'Weekend Special',
                'description' => 'Get 15% off your entire order this weekend!',
                'discount_type' => 'percentage',
                'discount_value' => 15.00,
                'code' => 'WEEKEND15',
                'minimum_purchase' => 30.00,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(2),
                'usage_limit' => 100,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'New Customer Discount',
                'description' => '$10 off your first order',
                'discount_type' => 'fixed_amount',
                'discount_value' => 10.00,
                'code' => 'WELCOME10',
                'minimum_purchase' => 20.00,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addYear(),
                'usage_limit' => null,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Buy 2 Get 1 Free',
                'description' => 'Buy 2 items from our bakery selection and get 1 free',
                'discount_type' => 'percentage',
                'discount_value' => 1.00,
                'code' => 'BAKERY321',
                'minimum_purchase' => 0.00,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addMonths(3),
                'usage_limit' => 500,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Free Shipping',
                'description' => 'Free shipping on all orders over $75',
                'discount_type' => 'free_shipping',
                'discount_value' => 0.00,
                'code' => 'BAKERY3211',
                'minimum_purchase' => 75.00,
                'start_date' => Carbon::now(),
                'end_date' => null,
                'usage_limit' => null,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Summer Sale',
                'description' => '20% off all summer essentials',
                'discount_type' => 'percentage',
                'discount_value' => 20.00,
                'code' => 'SUMMER20',
                'minimum_purchase' => 0.00,
                'start_date' => Carbon::parse('2025-06-01'),
                'end_date' => Carbon::parse('2025-08-31'),
                'usage_limit' => 1000,
                'status' => 'inactive',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('promotions')->insert($promotions);
    }
}
