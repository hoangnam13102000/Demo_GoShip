<?php

namespace App\Services;

use App\Models\Shipment;
use App\Models\Tracking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ShipmentTransferService
{
    public function transfer(
        Shipment $shipment,
        int $toBranchId,
        int $statusId,
        ?string $note = null
    ) {
        return DB::transaction(function () use (
            $shipment,
            $toBranchId,
            $statusId,
            $note
        ) {

            $fromBranchId = $shipment->current_branch_id;

            // 1️⃣ OUT
            Tracking::create([
                'shipment_id'    => $shipment->id,
                'status_id'      => $statusId,
                'from_branch_id' => $fromBranchId,
                'to_branch_id'   => $toBranchId,
                'direction_flag' => 'OUT',
                'note'           => $note ?? 'Xuất kho chuyển chi nhánh',
                'updated_by'     => Auth::id(),
            ]);

            // 2️⃣ IN
            Tracking::create([
                'shipment_id'    => $shipment->id,
                'status_id'      => $statusId,
                'from_branch_id' => $fromBranchId,
                'to_branch_id'   => $toBranchId,
                'direction_flag' => 'IN',
                'note'           => 'Nhập kho chi nhánh mới',
                'updated_by'     => Auth::id(),
            ]);

            return true;
        });
    }
}
