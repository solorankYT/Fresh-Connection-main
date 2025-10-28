<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('product_id')->primary();
            $table->string('product_name');
            $table->text('product_description')->nullable();
            $table->string('product_serving')->nullable();
            $table->decimal('product_price', 10, 2)->default(0);
            $table->decimal('vat_percentage', 5, 2)->nullable();
            $table->decimal('vat', 10, 2)->nullable();
            $table->decimal('tax_percentage', 5, 2)->nullable();
            $table->decimal('tax', 10, 2)->nullable();
            $table->decimal('other_tax', 10, 2)->nullable();
            $table->decimal('final_price', 10, 2)->default(0);
            $table->string('category')->nullable();
            $table->string('sub_category')->nullable();
            $table->decimal('product_rating', 3, 2)->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('stocks')->default(0);
            $table->date('expiration_date')->nullable();
            $table->string('storage_temperature')->nullable();
            $table->boolean('requires_temperature_control')->default(false);
            $table->string('product_image')->nullable();
            $table->string('product_image_1')->nullable();
            $table->string('product_image_2')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
