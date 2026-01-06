<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    // Lấy danh sách tất cả lô hàng
    public function index()
    {
        $shipments = Shipment::with(['customer', 'agent'])->get();
        return response()->json($shipments);
    }

    // Tạo lô hàng mới
    public function store(Request $request)
    {
        $request->validate([
            'tracking_code' => 'required|string|unique:shipments,tracking_code',
            'customer_id' => 'required|exists:customers,id',
            'agent_id' => 'nullable|exists:agents,id',
            'sender_name' => 'required|string|max:255',
            'sender_address' => 'required|string|max:255',
            'sender_phone' => 'nullable|string|max:20',
            'receiver_name' => 'required|string|max:255',
            'receiver_address' => 'required|string|max:255',
            'receiver_phone' => 'nullable|string|max:20',
            'shipment_type' => 'required|in:Standard,Express,SameDay',
            'weight' => 'required|numeric',
            'fee' => 'required|numeric',
            'delivery_date' => 'nullable|date',
            'status' => 'nullable|in:PLACED,PICKED_UP,IN_TRANSIT,DELIVERED,CANCELLED',
        ]);

        $shipment = Shipment::create($request->all());
        return response()->json($shipment, 201);
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
            'tracking_code' => 'sometimes|required|string|unique:shipments,tracking_code,' . $id,
            'customer_id' => 'sometimes|required|exists:customers,id',
            'agent_id' => 'sometimes|nullable|exists:agents,id',
            'sender_name' => 'sometimes|required|string|max:255',
            'sender_address' => 'sometimes|required|string|max:255',
            'sender_phone' => 'sometimes|nullable|string|max:20',
            'receiver_name' => 'sometimes|required|string|max:255',
            'receiver_address' => 'sometimes|required|string|max:255',
            'receiver_phone' => 'sometimes|nullable|string|max:20',
            'shipment_type' => 'sometimes|required|in:Standard,Express,SameDay',
            'weight' => 'sometimes|required|numeric',
            'fee' => 'sometimes|required|numeric',
            'delivery_date' => 'sometimes|nullable|date',
            'status' => 'sometimes|in:PLACED,PICKED_UP,IN_TRANSIT,DELIVERED,CANCELLED',
        ]);

        $shipment->update($request->all());
        return response()->json($shipment);
    }

    // Xóa lô hàng
    public function destroy($id)
    {
        $shipment = Shipment::findOrFail($id);
        $shipment->delete();
        return response()->json(['message' => 'Shipment deleted successfully']);
    }
}
