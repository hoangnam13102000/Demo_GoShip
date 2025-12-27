<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentStatus extends Model
{
    protected $fillable = [
        'code',
        'name',
    ];

    // Quan hệ với Shipments (hiện trạng thái hiện tại)
    public function shipments()
    {
        return $this->hasMany(Shipment::class, 'current_status_id');
    }

    // Quan hệ với lịch sử trạng thái
    public function histories()
    {
        return $this->hasMany(ShipmentStatusHistory::class, 'status_id');
    }
}
