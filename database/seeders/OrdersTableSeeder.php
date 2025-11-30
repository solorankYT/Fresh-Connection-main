<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users with IDs 1-192 to choose from AND filter out users with missing data
        $users = User::whereIn('id', range(1, 192))
            ->whereNotNull('street_address')
            ->whereNotNull('city')
            ->whereNotNull('phone_number')
            ->whereNotNull('postal_code')
            ->get();
        
        // Make sure we have users to work with
        if ($users->count() == 0) {
            echo "No users with complete data found. Seeding aborted.\n";
            return;
        }
        
        // Metro Manila pin addresses
        $pinAddresses = [
            'Anonas St, Cor Pureza, Santa Mesa, Manila,, 1008 Metro Manila, Philippines',
            '283 P. Guevarra St, San Juan, 1500 Metro Manila, Philippines',
            '3270 1st St, Santa Mesa, Manila, Metro Manila, Philippines',
            '412 Shaw Blvd, Mandaluyong, 1550 Metro Manila, Philippines',
            '32 Timog Avenue, Quezon City, 1103 Metro Manila, Philippines',
            '78 Jupiter St, Makati, 1209 Metro Manila, Philippines',
            '1634 Taft Avenue, Malate, Manila, 1004 Metro Manila, Philippines',
            '521 Shaw Boulevard, Mandaluyong, 1552 Metro Manila, Philippines',
            '88 Maginhawa Street, UP Village, Quezon City, 1101 Metro Manila, Philippines',
            '726 Aurora Boulevard, Cubao, Quezon City, 1109 Metro Manila, Philippines',
            '2300 Pasong Tamo Extension, Makati, 1231 Metro Manila, Philippines',
            '354 Quirino Highway, Novaliches, Quezon City, 1116 Metro Manila, Philippines',
            '192 Dr. Sixto Antonio Ave, Pasig, 1603 Metro Manila, Philippines',
            '67 Congressional Avenue, Project 8, Quezon City, 1106 Metro Manila, Philippines',
            '134 West Avenue, Quezon City, 1104 Metro Manila, Philippines',
            '9 Annapolis Street, Greenhills, San Juan, 1502 Metro Manila, Philippines',
            '45 Marcos Highway, Marikina, 1800 Metro Manila, Philippines',
        ];

        // Default city names in Metro Manila
        $defaultCities = [
            'Manila', 
            'Quezon City', 
            'Makati', 
            'Pasig', 
            'Taguig', 
            'Mandaluyong',
            'San Juan',
            'Pasay',
            'Parañaque',
            'Marikina'
        ];
        
        // Payment methods
        $paymentMethods = ['cod', 'gcash_or_maya', 'credit_card'];
        
        // Create 50 orders
        for ($i = 0; $i < 500; $i++) {
            // Get a random user
            $user = $users->random();
            
            // Random values
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            $deliveryFee = rand(50, 150);
            
            // Create order
            $order = new Order();
            $order->user_id = $user->id;
            $order->first_name = $user->first_name;
            $order->last_name = $user->last_name;
            $order->address = $user->street_address;
            $order->pin_address = $pinAddresses[array_rand($pinAddresses)];
            $order->barangay = $user->barangay;
            $order->zip_code = $user->postal_code;
            $order->city = $user->city ?? $defaultCities[array_rand($defaultCities)];
            $order->region = 'National Capital Region';
            $order->mobile_number = $user->phone_number;
            $order->subtotal = 0;
            $order->delivery_fee = $deliveryFee;
            $order->total = 0;
            $order->status = 'completed';
            $order->payment_method = $paymentMethod;
            $order->payment_status = $paymentMethod === 'cod' ? 'approved' : 'pending';
            
            // Conditional fields based on payment method
            if ($paymentMethod === 'credit_card') {
                $order->card_number_last4 = rand(1000, 9999);
                $order->gcash_or_maya_account = null;
            } elseif ($paymentMethod === 'gcash_or_maya') {
                $order->card_number_last4 = null;
                $order->gcash_or_maya_account = $user->phone_number;
            } else {
                $order->card_number_last4 = null;
                $order->gcash_or_maya_account = null;
            }
            
            $order->shipped_at = null;
            $order->delivered_at = null;
            $order->completed_at = null;
            
            $order->save();
        }
    }
}