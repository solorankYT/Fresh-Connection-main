<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // Create regular customers
        $faker = Faker::create('en_PH'); // Use Filipino locale if available
        
        // List of Metro Manila cities
        $cities = [
            'Manila',
            'Quezon City',
            'Caloocan',
            'Las Piñas',
            'Makati',
            'Malabon',
            'Mandaluyong',
            'Marikina',
            'Muntinlupa',
            'Navotas',
            'Parañaque',
            'Pasay',
            'Pasig',
            'San Juan',
            'Taguig',
            'Valenzuela'
        ];

        $barangays = [
            'San Jose', 'San Miguel', 'San Isidro', 'San Antonio', 'San Roque',
            'Santa Cruz', 'Santa Maria', 'Santo Niño', 'Santa Rosa', 'Santa Ana',
            'Poblacion', 'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4',
            'Bagong Silang', 'Malibay', 'Bangkal', 'Magallanes', 'Greenhills',
            'Wack Wack', 'Addition Hills', 'Barangka', 'Damar', 'Hagdang Bato',
            'Hulo', 'Malamig', 'Mauway', 'Plainview', 'Pleasant Hills',
            'Burol', 'Dalandan', 'Panghulo', 'Potrero', 'Tugatog',
            'Alaminos', 'Ayala Alabang', 'Bayanan', 'Cupang', 'Putatan',
            'Bagbag', 'Commonwealth', 'Batasan Hills', 'Holy Spirit', 'Payatas'
        ];

        // Create 30 customer users
        for ($i = 0; $i < 20; $i++) {
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;
            $city = $cities[array_rand($cities)];
            $barangay = $barangays[array_rand($barangays)];

        
            User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => strtolower($firstName . '.' . $lastName . '@example.com'),
                'password' => Hash::make('password'),
                'phone_number' => '9' . rand(100000000, 999999999),
                'country' => 'Philippines',
                'postal_code' => rand(1000, 1800),
                'city' => $city,
                'barangay' => $barangay,
                'state' => 'Metro Manila',
                'street_address' => $faker->streetAddress,
                'role' => 'customer',
                'status' => 'active',
            ]);
        }
    }
}
