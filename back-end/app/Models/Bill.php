<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id',
        'base_amount',
        'weight_fee',
        'tax',
        'total_amount',
        'status',
    ];

    // Quan hệ với Shipment
    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }

    // Quan hệ với Payments
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
