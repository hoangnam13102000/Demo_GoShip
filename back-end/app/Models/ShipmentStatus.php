<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentStatus extends Model
{
    protected $table = 'shipment_statuses';

    protected $fillable = [
        'code',
        'name',
    ];

    public $timestamps = false;

    public function shipments()
    {
        return $this->hasMany(Shipment::class, 'current_status_id');
    }
}
