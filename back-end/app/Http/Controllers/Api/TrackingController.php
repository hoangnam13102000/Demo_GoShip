<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tracking;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class TrackingController extends Controller
{
    /**
     * Danh sách tracking theo shipment
     */
    public function index($shipmentId)
    {
        $tracking = Tracking::with([
                'status:id,code,name',
                'branch:id,name',
                'updater:id,name'
            ])
            ->where('shipment_id', $shipmentId)
            ->orderBy('updated_at', 'asc')
            ->get();

        return response()->json($tracking);
    }

    /**
     * Thêm log tracking mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipment_id'     => 'required|exists:shipments,id',
            'status_id'       => 'required|exists:shipment_statuses,id',
            'branch_id'       => 'nullable|exists:branches,id',
            'direction_flag'  => 'required|in:IN,OUT',
            'note'            => 'nullable|string|max:500',
        ]);

        $tracking = Tracking::create([
            'shipment_id'    => $validated['shipment_id'],
            'status_id'      => $validated['status_id'],
            'branch_id'      => $validated['branch_id'] ?? null,
            'direction_flag' => $validated['direction_flag'],
            'note'           => $validated['note'] ?? null,
            'updated_by'     => Auth::id(),
            'updated_at'     => Carbon::now(),
        ]);

        // cập nhật trạng thái hiện tại của shipment
        Shipment::where('id', $validated['shipment_id'])
            ->update([
                'current_status_id' => $validated['status_id']
            ]);

        return response()->json([
            'message' => 'Tracking updated successfully',
            'data'    => $tracking
        ], 201);
    }
}
