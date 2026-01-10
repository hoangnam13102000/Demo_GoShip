<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentService extends Model
{
    use HasFactory;

    protected $table = 'shipment_services';

    protected $fillable = [
        'code',
        'name',
        'description',
        'base_price',
        'max_weight',
        'estimated_delivery_time',
        'features',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'base_price' => 'float',
        'max_weight' => 'float',
    ];
    public function shipments()
    {
        return $this->hasMany(Shipment::class, 'shipment_service_id');
    }
}

