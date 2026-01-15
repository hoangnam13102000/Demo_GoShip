<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Illuminate\Http\Request;

class BillController extends Controller
{
    /**
     * Danh sách bills
     */
    public function index()
    {
        $bills = Bill::with([
            'shipment.customer',
            'shipment.shipmentService',
            'payments'
        ])->orderBy('created_at', 'desc')->get();


        return response()->json($bills);
    }

    /**
     * Tạo bill (1 shipment = 1 bill)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipment_id' => [
                'required',
                'exists:shipments,id',
                'unique:bills,shipment_id'
            ],
            'base_amount' => 'required|numeric|min:0',
            'weight_fee'  => 'nullable|numeric|min:0',
            'tax'         => 'nullable|numeric|min:0',
        ]);

        // Tính tổng tiền (server-side)
        $total =
            $validated['base_amount']
            + ($validated['weight_fee'] ?? 0)
            + ($validated['tax'] ?? 0);

        $bill = Bill::create([
            ...$validated,
            'total_amount' => $total,
            'status' => 'UNPAID',
        ]);

        return response()->json($bill, 201);
    }

    /**
     * Chi tiết bill
     */
    public function show($id)
    {
        $bill = Bill::with([
            'shipment.customer',
            'shipment.service',
            'payments'
        ])->findOrFail($id);

        return response()->json($bill);
    }

    /**
     * Cập nhật bill
     * ❗ Không cho sửa shipment_id
     * ❗ Không cho sửa status (do Payment xử lý)
     */
    public function update(Request $request, $id)
    {
        $bill = Bill::findOrFail($id);

        $validated = $request->validate([
            'base_amount' => 'nullable|numeric|min:0',
            'weight_fee'  => 'nullable|numeric|min:0',
            'tax'         => 'nullable|numeric|min:0',
        ]);

        // Nếu có thay đổi tiền → tính lại total
        $base = $validated['base_amount'] ?? $bill->base_amount;
        $weightFee = $validated['weight_fee'] ?? $bill->weight_fee;
        $tax = $validated['tax'] ?? $bill->tax;

        $bill->update([
            ...$validated,
            'total_amount' => $base + $weightFee + $tax,
        ]);

        return response()->json($bill);
    }

    /**
     * Xóa bill
     * (thường chỉ admin dùng)
     */
    public function destroy($id)
    {
        $bill = Bill::findOrFail($id);
        $bill->delete();

        return response()->json([
            'message' => 'Bill deleted successfully'
        ]);
    }
}
