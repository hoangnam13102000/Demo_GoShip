<?php

namespace App\Services;

use App\Models\Shipment;
use App\Models\Tracking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use DomainException;

class ShipmentTransferService
{
    public function transfer(
        Shipment $shipment,
        int $toBranchId,
        int $statusId,
        ?string $note = null
    ): void {
        DB::transaction(function () use (
            $shipment,
            $toBranchId,
            $statusId,
            $note
        ) {

            $fromBranchId = $shipment->current_branch_id;

            /* =========================
             * GUARD RULES (DDD)
             * ========================= */
            if ($fromBranchId === $toBranchId) {
                throw new DomainException(
                    'Không thể chuyển đến cùng chi nhánh'
                );
            }

            /* =========================
             * PREVENT DUPLICATE TRANSFER
             * ========================= */
            $alreadyTransferred = Tracking::where([
                'shipment_id' => $shipment->id,
                'direction_flag' => 'IN',
                'to_branch_id' => $toBranchId,
                'status_id' => $statusId,
            ])->exists();

            if ($alreadyTransferred) {
                return;
            }

            /* =========================
             * OUT TRACKING
             * ========================= */
            Tracking::create([
                'shipment_id'    => $shipment->id,
                'status_id'      => $statusId,
                'from_branch_id' => $fromBranchId,
                'to_branch_id'   => null,
                'direction_flag' => 'OUT',
                'note'           => $note ?? 'Xuất kho',
                'updated_by'     => Auth::id(),
            ]);

            /* =========================
             * IN TRACKING
             * ========================= */
            Tracking::create([
                'shipment_id'    => $shipment->id,
                'status_id'      => $statusId,
                'from_branch_id' => $fromBranchId,
                'to_branch_id'   => $toBranchId,
                'direction_flag' => 'IN',
                'note'           => $note ?? 'Nhập kho',
                'updated_by'     => Auth::id(),
            ]);

            /* =========================
             * UPDATE AGGREGATE ROOT
             * ========================= */
            $shipment->update([
                'current_branch_id' => $toBranchId,
                'current_status_id' => $statusId,
            ]);
        });
    }
}
