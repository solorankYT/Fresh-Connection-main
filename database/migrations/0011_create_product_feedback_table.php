<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_feedback', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('item_id')
                ->constrained('order_items')
                ->onDelete('cascade');

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Review details
            $table->unsignedTinyInteger('rating')->comment('1-5 star rating');
            $table->text('review')->nullable();
            $table->string('review_image')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_feedback');
    }
};
