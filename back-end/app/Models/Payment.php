<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_id',
        'method',
        'transaction_id',
        'amount',
        'status',
        'paid_at',
    ];

    // Quan hệ với Bill
    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
