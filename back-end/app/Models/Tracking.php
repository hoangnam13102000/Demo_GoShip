<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tracking extends Model
{
    use HasFactory;

    protected $table = 'tracking';

    public $timestamps = true;

    protected $fillable = [
        'shipment_id',
        'status_id',
        'branch_id',
        'updated_by',
        'direction_flag',
        'note',
        'updated_at',
        
    ];

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }

    public function status()
    {
        return $this->belongsTo(ShipmentStatus::class, 'status_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function updater()
    {
        return $this->belongsTo(Account::class, 'updated_by');
    }
}
