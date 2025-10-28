<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'first_name' => 'Default', // Change if needed
            'last_name' => 'Admin',   // Change if needed
            'username' => 'admin',    // Change the username here
            'email' => 'admin@example.com', // Change the email here
            'password' => Hash::make('password'), // Change the password here
        ]);
    }
}
