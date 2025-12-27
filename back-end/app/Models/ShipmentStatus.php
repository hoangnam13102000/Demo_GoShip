<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentStatus extends Model
{
    protected $fillable = [
        'code',
        'name',
    ];

    public function shipments()
    {
        return $this->hasMany(Shipment::class, 'current_status_id');
    }

    public function histories()
    {
        return $this->hasMany(ShipmentStatusHistory::class, 'status_id');
    }
}
