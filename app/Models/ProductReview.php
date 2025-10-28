<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    protected $table = 'product_feedback'; 

    protected $fillable = [
        'item_id',
        'user_id',
        'rating',
        'review',
        'review_image',
    ]; 

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class, 'item_id'); 
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
