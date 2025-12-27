<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id',
        'status',
        'changed_at',
        'note',
    ];

    // Quan hệ với Shipment
    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }
}
