<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'shipment_id',  // thêm
        'title',
        'message',
        'is_read',
        'sent_at',       // thêm
    ];

    // Quan hệ với Account
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    // Quan hệ với Shipment
    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }
}
