<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'minimum_spend',
        'usage_limit',
        'times_used',
        'valid_from',
        'valid_until',
        'is_active'
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean'
    ];

    public function isValid()
    {
        $now = now();
        return $this->is_active &&
            $now->gte($this->valid_from) &&
            $now->lte($this->valid_until) &&
            ($this->usage_limit === null || $this->times_used < $this->usage_limit);
    }

    public function calculateDiscount($subtotal)
    {
        if (!$this->isValid() || $subtotal < $this->minimum_spend) {
            return 0;
        }

        if ($this->discount_type === 'percentage') {
            return ($subtotal * $this->discount_value) / 100;
        }

        return min($this->discount_value, $subtotal);
    }
}
