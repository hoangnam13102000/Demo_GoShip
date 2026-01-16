<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tracking extends Model
{
    
    protected $table = 'trackings';

    protected $fillable = [
        'shipment_id',
        'status_id',
        'from_branch_id',
        'to_branch_id',
        'updated_by',
        'direction_flag',
        'note',
    ];

    /* =======================
     * RELATIONSHIPS
     * ======================= */

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ShipmentStatus::class, 'status_id');
    }

    public function fromBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'from_branch_id');
    }

    public function toBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'to_branch_id');
    }


    public function branch(): BelongsTo
    {
        return $this->direction_flag === 'IN'
            ? $this->toBranch()
            : $this->fromBranch();
    }
}
