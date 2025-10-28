<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'vat_exemption', 
        'vat_percentage',
        'vat',
        'discount', // Discount applied to this item
        'tax_percentage',
        'tax', // Tax applied to this item
        'total', // Total cost for this order item
        'final_price',
    ];

    protected $appends = [
        'formatted_price',
        'formatted_total',
        'formatted_discount',
        'formatted_final_price'
    ];

    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->price, 2);
    }

    public function getFormattedTotalAttribute()
    {
        return '₱' . number_format($this->total, 2);
    }

    public function getFormattedDiscountAttribute()
    {
        return '₱' . number_format($this->discount ?? 0, 2);
    }

    public function getFormattedFinalPriceAttribute()
    {
        return '₱' . number_format($this->final_price, 2);
    }

    protected $casts = [
        'product_id' => 'string', // Ensure this matches the UUID format
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id'); // ✅ Specify primary key in products table
    }
}
