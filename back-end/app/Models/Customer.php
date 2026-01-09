<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'full_name',
        'phone',
        'address',
    ];

    // Quan hệ với Account
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    // Quan hệ với Shipments
    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
