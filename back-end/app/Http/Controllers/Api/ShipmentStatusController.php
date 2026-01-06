<?php

namespace App\Http\Controllers;

use App\Models\ShipmentStatus;
use Illuminate\Http\Request;

class ShipmentStatusController extends Controller
{
    // Lấy danh sách tất cả trạng thái
    public function index()
    {
        $statuses = ShipmentStatus::all();
        return response()->json($statuses);
    }

    // Tạo trạng thái mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:shipment_statuses,code',
            'name' => 'required|string|max:255',
        ]);

        $status = ShipmentStatus::create($validated);
        return response()->json($status, 201);
    }

    // Lấy chi tiết trạng thái
    public function show($id)
    {
        $status = ShipmentStatus::findOrFail($id);
        return response()->json($status);
    }

    // Cập nhật trạng thái
    public function update(Request $request, $id)
    {
        $status = ShipmentStatus::findOrFail($id);

        $validated = $request->validate([
            'code' => 'nullable|unique:shipment_statuses,code,' . $status->id,
            'name' => 'nullable|string|max:255',
        ]);

        $status->update($validated);
        return response()->json($status);
    }

    // Xóa trạng thái
    public function destroy($id)
    {
        $status = ShipmentStatus::findOrFail($id);
        $status->delete();
        return response()->json(['message' => 'Shipment status deleted successfully']);
    }
}
