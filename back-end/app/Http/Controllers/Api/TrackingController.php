<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tracking;

class TrackingController extends Controller
{
    /**
     * Read-only tracking history
     */
    public function index($shipmentId)
    {
        $tracking = Tracking::with([
            'status:id,name',
            'fromBranch:id,name',
            'toBranch:id,name',
        ])
            ->where('shipment_id', $shipmentId)
            ->orderBy('created_at')
            ->get();

        return response()->json($tracking);
    }
}
