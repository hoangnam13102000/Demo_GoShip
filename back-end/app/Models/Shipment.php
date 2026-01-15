<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function agent()
    {
        return $this->belongsTo(Account::class, 'agent_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'current_branch_id');
    }

    public function currentStatus()
    {
        return $this->belongsTo(ShipmentStatus::class, 'current_status_id');
    }

    public function shipmentService()
    {
        return $this->belongsTo(
            ShipmentService::class,
            'shipment_service_code',
            'code'
        );
    }

    public function bill()
    {
        return $this->hasOne(Bill::class);
    }


    public function trackingHistory()
    {
        return $this->hasMany(Tracking::class);
    }
}
