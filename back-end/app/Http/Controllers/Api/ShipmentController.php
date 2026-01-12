<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ShipmentController extends Controller
{
    public function index()
    {
        $shipments = Shipment::with(['customer', 'agent'])->get();
        return response()->json($shipments);
    }

    public function store(Request $request)
    {
        // 1️⃣ Validate dữ liệu
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'agent_id' => 'nullable|exists:agents,id',

            'sender_name' => 'required|string|max:255',
            'sender_address' => 'required|string|max:255',
            'sender_phone' => 'nullable|string|max:20',
            'sender_city' => 'nullable|string|max:255',

            'receiver_name' => 'required|string|max:255',
            'receiver_address' => 'required|string|max:255',
            'receiver_phone' => 'nullable|string|max:20',
            'receiver_city' => 'nullable|string|max:255',

            'shipment_service_code' => 'required|exists:shipment_services,code',
            'weight' => 'required|numeric|min:0.1',
            'charge' => 'required|numeric|min:0',

            'current_status_id' => 'required|exists:shipment_statuses,id',
            'expected_delivery_date' => 'nullable|date',
        ]);

        return DB::transaction(function () use ($validated, $request) {

            $validated['tracking_number'] = 'TRK-' . strtoupper(Str::random(10));


            $shipment = Shipment::create($validated);

            $updatedBy = $request->input('updated_by');

            DB::table('tracking')->insert([
                'shipment_id'    => $shipment->id,
                'status_id'      => $validated['current_status_id'],
                'branch_id'      => null,
                'updated_by'     => $updatedBy,
                'direction_flag' => 'IN',
                'note'           => 'Đơn hàng được tạo',
                'updated_at'     => now(),
            ]);

            return response()->json($shipment, 201);
        });
    }

    // Lấy chi tiết lô hàng
    public function show($id)
    {
        $shipment = Shipment::with(['customer', 'agent'])->findOrFail($id);
        return response()->json($shipment);
    }

    // Cập nhật lô hàng
    public function update(Request $request, $id)
    {
        $shipment = Shipment::findOrFail($id);

        $request->validate([
            'tracking_number' => 'sometimes|required|string|unique:shipments,tracking_number,' . $id,
            'customer_id' => 'sometimes|required|exists:customers,id',
            'agent_id' => 'sometimes|nullable|exists:agents,id',

            'sender_name' => 'sometimes|required|string|max:255',
            'sender_address' => 'sometimes|required|string|max:255',
            'sender_phone' => 'sometimes|nullable|string|max:20',
            'sender_city' => 'sometimes|nullable|string|max:255',

            'receiver_name' => 'sometimes|required|string|max:255',
            'receiver_address' => 'sometimes|required|string|max:255',
            'receiver_phone' => 'sometimes|nullable|string|max:20',
            'receiver_city' => 'sometimes|nullable|string|max:255',

            'shipment_service_code' => 'sometimes|required|exists:shipment_services,code',

            'weight' => 'sometimes|required|numeric|min:0.1',
            'charge' => 'sometimes|required|numeric|min:0',

            'current_status_id' => 'sometimes|required|exists:shipment_statuses,id',
            'expected_delivery_date' => 'sometimes|nullable|date',
        ]);

        $shipment->update($request->all());

        return response()->json($shipment);
    }

    public function destroy($id)
    {
        $shipment = Shipment::findOrFail($id);
        $shipment->delete();
        return response()->json(['message' => 'Shipment deleted successfully']);
    }
    public function track($tracking_number)
    {
        $shipment = Shipment::with(['customer', 'agent', 'trackingHistory'])->where('tracking_number', $tracking_number)->first();

        if (!$shipment) {
            return response()->json(['message' => 'Vận đơn không tồn tại'], 404);
        }

        // Chuẩn hóa dữ liệu cho frontend
        return response()->json([
            'tracking_number' => $shipment->tracking_number,
            'status' => optional($shipment->currentStatus)->name ?? 'Chưa cập nhật',
            'current_location' => optional($shipment->trackingHistory()->latest()->first())->branch_name ?? 'Chưa xác định',
            'estimated_delivery' => $shipment->expected_delivery_date,
            'history' => $shipment->trackingHistory()->orderBy('created_at')->get()->map(function ($item) {
                return [
                    'status' => optional($item->status)->name,
                    'location' => $item->branch_name ?? 'Chưa xác định',
                    'time' => $item->updated_at->format('Y-m-d H:i'),
                ];
            }),
        ]);
    }
    public function myOrders(Request $request)
    {
        $customerId = $request->query('customer_id'); // hoặc $request->input('customer_id')

        if (!$customerId) {
            return response()->json(['message' => 'customer_id is required'], 400);
        }

        $shipments = Shipment::with([
            'trackingHistory.status',
            'trackingHistory.branch',
            'trackingHistory.updater',
            'service' 
        ])
            ->where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($shipment) {
                return [
                    'id' => $shipment->id,
                    'tracking_number' => $shipment->tracking_number,
                    'status' => $shipment->currentStatus->name ?? 'Chưa cập nhật',
                    'service' => $shipment->service->name ?? '',
                    'created_at' => $shipment->created_at->format('Y-m-d H:i'),
                    'estimated_delivery' => $shipment->expected_delivery_date,
                    'history' => $shipment->trackingHistory->map(fn($t) => [
                        'status' => $t->status->name,
                        'location' => $t->branch?->name ?? 'Không xác định',
                        'time' => $t->created_at->format('Y-m-d H:i'),
                    ]),
                ];
            });

        return response()->json($shipments);
    }
}
