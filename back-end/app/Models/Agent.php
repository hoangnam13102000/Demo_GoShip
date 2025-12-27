<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'branch_id',
        'contact_number',
        'status',
    ];

    // Quan hệ với account
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    // Quan hệ với branch
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    // Quan hệ với shipments
    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
