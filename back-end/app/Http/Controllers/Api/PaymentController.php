<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * =========================
     * Danh sách payment
     * =========================
     */
    public function index()
    {
        $payments = Payment::with([
            'bill.shipment.customer'
        ])->orderByDesc('created_at')->get();

        return response()->json($payments);
    }

    /**
     * =========================
     * Tạo PAYMENT CASH
     * ❗ MOMO KHÔNG ĐƯỢC TẠO Ở ĐÂY
     * =========================
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'method'  => 'required|in:CASH', // 🔒 chỉ cho CASH
            'amount'  => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {

            $bill = Bill::lockForUpdate()->findOrFail($validated['bill_id']);

            if ($bill->status === 'PAID') {
                return response()->json([
                    'message' => 'Bill đã được thanh toán'
                ], 409);
            }

            /**
             * CASH → SUCCESS ngay
             */
            $payment = Payment::create([
                'bill_id' => $bill->id,
                'method'  => 'CASH',
                'amount'  => $validated['amount'],
                'status'  => 'SUCCESS',
                'paid_at'=> Carbon::now(),
            ]);

            $bill->update(['status' => 'PAID']);

            return response()->json($payment, 201);
        });
    }

    /**
     * =========================
     * Chi tiết payment
     * =========================
     */
    public function show($id)
    {
        $payment = Payment::with([
            'bill.shipment.customer'
        ])->findOrFail($id);

        return response()->json($payment);
    }

    /**
     * =========================
     * Đánh dấu FAILED (ADMIN / SYSTEM)
     * =========================
     */
    public function markFailed($id)
    {
        return DB::transaction(function () use ($id) {

            $payment = Payment::lockForUpdate()->findOrFail($id);

            if ($payment->status === 'FAILED') {
                return response()->json([
                    'message' => 'Payment already failed'
                ], 409);
            }

            /**
             * ❗ Không cho FAILED payment SUCCESS
             */
            if ($payment->status === 'SUCCESS') {
                return response()->json([
                    'message' => 'Cannot fail a successful payment'
                ], 409);
            }

            $payment->update([
                'status'  => 'FAILED',
                'paid_at'=> null,
            ]);

            /**
             * Nếu bill không còn payment SUCCESS → UNPAID
             */
            $hasSuccess = Payment::where('bill_id', $payment->bill_id)
                ->where('status', 'SUCCESS')
                ->exists();

            if (!$hasSuccess) {
                Bill::where('id', $payment->bill_id)
                    ->update(['status' => 'UNPAID']);
            }

            return response()->json([
                'message' => 'Payment marked as failed'
            ]);
        });
    }
}
