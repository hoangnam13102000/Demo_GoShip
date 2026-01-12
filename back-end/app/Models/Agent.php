<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// 👇 BẮT BUỘC IMPORT
use App\Models\Account;
use App\Models\Branch;
use App\Models\Shipment;

class Agent extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'phone',
        'address',
        'account_id',
        'branch_id',
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
