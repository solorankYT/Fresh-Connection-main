<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTracking extends Model
{
    // Specify the table name
    protected $table = 'order_tracking';

    protected $fillable = [
        'order_id',
        'primary_status',
        'secondary_status',
        'comments',
        'updated_by',
    ];

    /**
     * Define the relationship with the Order model.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
