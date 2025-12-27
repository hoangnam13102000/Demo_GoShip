<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShipmentStatusHistory;
use Illuminate\Http\Request;

class ShipmentStatusHistoryController extends Controller
{
    // Lấy danh sách tất cả trạng thái lô hàng
    public function index()
    {
        $histories = ShipmentStatusHistory::with('shipment')->get();
        return response()->json($histories);
    }

    // Tạo trạng thái mới cho lô hàng
    public function store(Request $request)
    {
        $request->validate([
            'shipment_id' => 'required|exists:shipments,id',
            'status' => 'required|in:PLACED,PICKED_UP,IN_TRANSIT,DELIVERED,CANCELLED',
            'changed_at' => 'nullable|date',
            'note' => 'nullable|string|max:255',
        ]);

        $history = ShipmentStatusHistory::create($request->all());
        return response()->json($history, 201);
    }

    // Lấy chi tiết trạng thái
    public function show($id)
    {
        $history = ShipmentStatusHistory::with('shipment')->findOrFail($id);
        return response()->json($history);
    }

    // Cập nhật trạng thái lô hàng
    public function update(Request $request, $id)
    {
        $history = ShipmentStatusHistory::findOrFail($id);

        $request->validate([
            'shipment_id' => 'sometimes|required|exists:shipments,id',
            'status' => 'sometimes|required|in:PLACED,PICKED_UP,IN_TRANSIT,DELIVERED,CANCELLED',
            'changed_at' => 'sometimes|nullable|date',
            'note' => 'sometimes|nullable|string|max:255',
        ]);

        $history->update($request->all());
        return response()->json($history);
    }

    // Xóa trạng thái
    public function destroy($id)
    {
        $history = ShipmentStatusHistory::findOrFail($id);
        $history->delete();
        return response()->json(['message' => 'Shipment status history deleted successfully']);
    }
}
