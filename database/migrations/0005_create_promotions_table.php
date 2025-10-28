<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();

            // Promotion details
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('promotion_image')->nullable();

            // Discount details
            $table->enum('discount_type', ['percentage', 'fixed_amount', 'free_shipping'])->default('percentage');
            $table->decimal('discount_value', 10, 2)->default(0);
            $table->string('code')->unique();

            // Conditions
            $table->decimal('minimum_purchase', 10, 2)->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->integer('usage_limit')->nullable();

            // Status
            $table->enum('status', ['active', 'inactive', 'expired'])->default('inactive');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion');
    }
};
