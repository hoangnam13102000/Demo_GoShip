<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;

class BillController extends Controller
{
    // Lấy danh sách tất cả bills
    public function index()
    {
        $bills = Bill::with('shipment', 'payments')->get();
        return response()->json($bills);
    }

    // Tạo bill mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipment_id' => 'required|exists:shipments,id',
            'base_amount' => 'required|numeric',
            'weight_fee'  => 'nullable|numeric',
            'tax'         => 'nullable|numeric',
            'total_amount'=> 'required|numeric',
            'status'      => 'nullable|in:PAID,UNPAID',
        ]);

        $bill = Bill::create($validated);
        return response()->json($bill, 201);
    }

    // Lấy chi tiết bill
    public function show($id)
    {
        $bill = Bill::with('shipment', 'payments')->findOrFail($id);
        return response()->json($bill);
    }

    // Cập nhật bill
    public function update(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);

        $validated = $request->validate([
            'base_amount' => 'nullable|numeric',
            'weight_fee'  => 'nullable|numeric',
            'tax'         => 'nullable|numeric',
            'total_amount'=> 'nullable|numeric',
            'status'      => 'nullable|in:PAID,UNPAID',
        ]);

        $bill->update($validated);
        return response()->json($bill);
    }

    // Xóa bill
    public function destroy($id)
    {
        $bill = Bill::findOrFail($id);
        $bill->delete();
        return response()->json(['message' => 'Bill deleted successfully']);
    }
}
