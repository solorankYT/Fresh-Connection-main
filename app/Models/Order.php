<?php

namespace App\Models;

use App\Notifications\OrderStatusUpdated;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $with = ['promotion', 'items']; // Always load the promotion and items relationships

    protected $appends = [
        'formatted_subtotal', 
        'formatted_total', 
        'formatted_delivery_fee', 
        'formatted_discount',
        'promotion_details'
    ];

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'address',
        'barangay',
        'pin_address',
        'zip_code',
        'city',
        'region',
        'mobile_number',
        'subtotal',
        'delivery_fee',
        'total',
        'status',
        'payment_method',
        'invoice_path',
        'paid',
        'card_number_last4',
        'gcash_or_maya_account',
        'shipped_at',
        'delivered_at',
        'completed_at',
        'payment_proof',
        'promotion_id',
        'discount',
    ];

    /**ss
     * Get the order items for this order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getPromotionDetailsAttribute()
    {
        if ($this->promotion) {
            return [
                'code' => $this->promotion->code,
                'name' => $this->promotion->name,
                'discount_type' => $this->promotion->discount_type,
                'discount_value' => $this->promotion->discount_value,
                'formatted_discount' => $this->formatted_discount
            ];
        }
        return null;
    }

    public function getFormattedSubtotalAttribute()
    {
        return '₱' . number_format($this->subtotal, 2);
    }

    public function getFormattedDiscountAttribute()
    {
        if ($this->discount) {
            return '₱' . number_format($this->discount, 2);
        }
        return '₱0.00';
    }

    public function getFormattedTotalAttribute()
    {
        return '₱' . number_format($this->total, 2);
    }

    public function getFormattedDeliveryFeeAttribute()
    {
        return '₱' . number_format($this->delivery_fee, 2);
    }

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'promotion_id')->where('status', 'active');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderTracking(): HasMany
    {
        return $this->hasMany(OrderTracking::class);
    }

    protected static function booted()
    {
        // Send invoice only when order is placed
        static::created(function ($order) {
            if ($order->status === 'placed') {
                \App\Services\OrderMailer::sendInvoiceEmail($order);
            }
        });

        // Send notifications and invoice when order status changes to placed or delivered
        static::updated(function ($order) {
            if ($order->isDirty('status')) {
                // Send status update notification for all status changes
                $order->user->notify(new OrderStatusUpdated($order));
                
                // Send invoice only for placed and delivered status
                if (in_array($order->status, ['placed', 'delivered'])) {
                    \App\Services\OrderMailer::sendInvoiceEmail($order);
                }
            }
        });
    }
}