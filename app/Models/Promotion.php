<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Promotion extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'promotion';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'promotion_image',
        'discount_type',
        'discount_value',
        'code',
        'minimum_purchase',
        'start_date',
        'end_date',
        'usage_limit',
        'status',
    ];

    /**
     * Get the orders using this promotion.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'promotion_id');
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'discount_value' => 'float',
        'minimum_purchase' => 'float',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'usage_limit' => 'integer',
    ];



    /**
     * Check if the promotion is currently valid.
     *
     * @return bool
     */
    public function isValid()
    {
        $now = Carbon::now();
        
        if ($this->status !== 'active') {
            return false;
        }

        if ($now->lt($this->start_date) || $now->gt($this->end_date)) {
            return false;
        }

        if ($this->usage_limit !== null) {
            $usageCount = $this->orders()->count();
            if ($usageCount >= $this->usage_limit) {
                return false;
            }
        }

        return true;
    }

    /**
     * Scope a query to only include active promotions.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                     ->where('start_date', '<=', Carbon::now())
                     ->where(function ($query) {
                         $query->where('end_date', '>=', Carbon::now())
                               ->orWhereNull('end_date');
                     });
    }

    /**
     * Check if the promotion is currently active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               $this->start_date <= Carbon::now() && 
               ($this->end_date === null || $this->end_date >= Carbon::now());
    }

    /**
     * Check if the promotion has usage limits.
     *
     * @return bool
     */
    public function hasUsageLimit(): bool
    {
        return $this->usage_limit !== null;
    }

    /**
     * Calculate the discount amount for a given subtotal.
     *
     * @param float $subtotal
     * @return float
     */
    public function calculateDiscount(float $subtotal): float
    {
        if ($subtotal < $this->minimum_purchase) {
            return 0;
        }

        switch ($this->discount_type) {
            case 'percentage':
                return $subtotal * ($this->discount_value / 100);
            
            case 'fixed_amount':
                return min($this->discount_value, $subtotal);
                
            case 'free_shipping':
                // Logic for free shipping would depend on your shipping calculation
                return 0;
                
            default:
                return 0;
        }
    }
}
