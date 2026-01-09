<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShipmentService;
use Illuminate\Http\Request;

class ShipmentServiceController extends Controller
{
    /**
     * GET /api/shipment-services
     * Dùng cho HomePage
     */
    public function index()
    {
        return ShipmentService::where('is_active', true)
            ->orderByDesc('is_featured')
            ->get();
    }

    /**
     * GET /api/shipment-services/{code}
     */
    public function show(string $code)
    {
        return ShipmentService::where('code', $code)
            ->where('is_active', true)
            ->firstOrFail();
    }

    /**
     * POST /api/shipment-services
     * (ADMIN)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:shipment_services',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'max_weight' => 'nullable|numeric|min:0',
            'estimated_delivery_time' => 'required|string',
            'features' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        return ShipmentService::create($data);
    }

    /**
     * PUT /api/shipment-services/{id}
     */
    public function update(Request $request, ShipmentService $shipmentService)
    {
        $data = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'base_price' => 'sometimes|numeric|min:0',
            'max_weight' => 'nullable|numeric|min:0',
            'estimated_delivery_time' => 'sometimes|string',
            'features' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $shipmentService->update($data);

        return response()->json($shipmentService);
    }


    /**
     * DELETE /api/shipment-services/{id}
     */
    public function destroy(ShipmentService $shipmentService)
    {
        $shipmentService->delete();
        return response()->noContent();
    }
}
