<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tracking extends Model
{
    protected $fillable = [
        'shipment_id',
        'from_branch_id',
        'to_branch_id',
        'status_id',
        'direction_flag',
        'updated_by',
        'note'
    ];

    public function fromBranch()
    {
        return $this->belongsTo(Branch::class, 'from_branch_id');
    }

    public function toBranch()
    {
        return $this->belongsTo(Branch::class, 'to_branch_id');
    }

    public function status()
    {
        return $this->belongsTo(ShipmentStatus::class);
    }

    public function updater()
    {
        return $this->belongsTo(Account::class, 'updated_by');
    }
}

