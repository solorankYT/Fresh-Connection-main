<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'cart'; // Table name

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    protected $appends = ['formatted_total'];

    public function getFormattedTotalAttribute()
    {
        return '₱' . number_format($this->quantity * $this->product->final_price, 2);
    }

    protected $casts = [
        'product_id' => 'string', // ✅ Ensure UUID is treated as a string
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id'); // ✅ Specify primary key in products table
    }
}
