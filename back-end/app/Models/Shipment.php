<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number',
        'customer_id',
        'agent_id',

        'sender_name',
        'sender_address',
        'sender_city',
        'sender_phone',

        'receiver_name',
        'receiver_address',
        'receiver_city',
        'receiver_phone',

        'shipment_service_code',
        'weight',
        'charge',

        'current_status_id',
        'expected_delivery_date',
    ];

    // Quan hệ với Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Quan hệ với Agent
    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    // Quan hệ với Branch
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    // Quan hệ với trạng thái hiện tại
    public function currentStatus()
    {
        return $this->belongsTo(ShipmentStatus::class, 'current_status_id');
    }

    // Lịch sử trạng thái
    public function shipmentServices()
    {
        return $this->belongsTo(ShipmentService::class);
    }

    // Hóa đơn liên quan
    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    public function trackingHistory()
{
    return $this->hasMany(Tracking::class); 
}
}
