<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number',   // đổi từ tracking_code
        'customer_id',
        'agent_id',
        'branch_id',         // thêm branch_id
        'current_status_id', // thêm current_status_id
        'sender_name',
        'sender_address',
        'sender_phone',
        'receiver_name',
        'receiver_address',
        'receiver_phone',
        'shipment_type',
        'weight',
        'charge',            // đổi từ fee
        'expected_delivery_date', // đổi từ delivery_date
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
}
