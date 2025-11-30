<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('promotion_id')->nullable()->constrained('promotions')->onDelete('set null');

            // Customer info
            $table->string('first_name');
            $table->string('last_name');
            $table->string('address');
            $table->string('barangay')->nullable();
            $table->string('pin_address')->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('mobile_number', 20);

            // Financials
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            // Order + Payment
            $table->enum('status', [
                'pending', 
                'placed', 
                'shipped', 
                'delivered', 
                'completed', 
                'cancelled'
            ])->default('pending');

            $table->string('payment_method')->nullable(); // cash, gcash, card, etc.
            $table->enum('payment_status', ['pending', 'approved', 'rejected', 'payment_review'])->default('pending');
            $table->string('card_number_last4', 4)->nullable();
            $table->string('gcash_or_maya_account')->nullable();
            $table->string('invoice_path')->nullable();
            $table->string('payment_proof')->nullable();

            // Timestamps for order progress
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
