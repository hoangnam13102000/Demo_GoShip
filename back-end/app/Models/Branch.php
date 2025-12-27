<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',        // thêm city
        'address',
        'phone',
        'status',
    ];

    // Quan hệ với agents
    public function agents()
    {
        return $this->hasMany(Agent::class);
    }

    // Quan hệ với shipments
    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
