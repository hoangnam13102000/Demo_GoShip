<?php

namespace App\Observers;

use App\Models\Tracking;
use App\Models\Shipment;

class TrackingObserver
{
    public function created(Tracking $tracking)
    {
        // Chỉ cập nhật chi nhánh khi nhập kho
        if (
            $tracking->direction_flag === 'IN' &&
            $tracking->to_branch_id
        ) {
            Shipment::where('id', $tracking->shipment_id)
                ->update([
                    'current_branch_id' => $tracking->to_branch_id
                ]);
        }
    }
}
