<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Services\ShipmentTransferService;
use Illuminate\Http\Request;

class ShipmentTransferController extends Controller

{
    public function transfer(
        Request $request,
        ShipmentTransferService $service
    ) {
        $validated = $request->validate([
            'shipment_id'  => 'required|exists:shipments,id',
            'to_branch_id' => 'required|exists:branches,id',
            'status_id'    => 'required|exists:shipment_statuses,id',
            'note'         => 'nullable|string|max:255',
        ]);

        $shipment = Shipment::findOrFail($validated['shipment_id']);

        $service->transfer(
            $shipment,
            $validated['to_branch_id'],
            $validated['status_id'],
            $validated['note'] ?? null
        );

        return response()->json([
            'message' => 'Shipment transferred successfully'
        ]);
    }
}
