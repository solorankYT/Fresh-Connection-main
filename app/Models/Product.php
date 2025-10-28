<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $primaryKey = 'product_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'product_id',
        'product_name',
        'product_description',
        'product_serving',
        'product_price',
        'vat_percentage',
        'vat',
        'tax_percentage',
        'tax',
        'other_tax',
        'final_price',
        'category',
        'sub_category',
        'product_rating',
        'status',
        'stocks',
        'expiration_date',
        'storage_temperature',
        'requires_temperature_control',
        'product_image',
        'product_image_1',
        'product_image_2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            if (empty($product->product_id)) {
                $product->product_id = Str::uuid();
            }
        });
    }
}
