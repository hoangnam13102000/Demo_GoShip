<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\MomoService;

class MomoController extends Controller
{
    public function __construct(
        protected MomoService $momoService
    ) {}

    /**
     * ==================================================
     * 1. FE gọi → nhận payUrl để redirect sang MoMo
     * ==================================================
     */
    public function create(Request $request)
    {
        $request->validate([
            'bill_id' => 'required|exists:bills,id'
        ]);

        $bill = Bill::where('status', 'UNPAID')
            ->findOrFail($request->bill_id);

        $payUrl = $this->momoService->createPayment($bill);

        return response()->json([
            'pay_url' => $payUrl
        ]);
    }

    /**
     * ==================================================
     * 2. MoMo redirect user về BACKEND
     * Backend redirect tiếp sang FRONTEND
     * ==================================================
     */
    public function return(Request $request)
    {
        /**
         * MoMo trả về query:
         * orderId=BILL_{billId}_{time}
         * resultCode=0 | !=0
         */
        $orderId    = $request->query('orderId');
        $resultCode = $request->query('resultCode');

        $billId = null;

        if ($orderId) {
            $parts  = explode('_', $orderId);
            $billId = $parts[1] ?? null;
        }

        Log::info('MoMo RETURN', [
            'orderId'    => $orderId,
            'billId'     => $billId,
            'resultCode' => $resultCode,
            'query'      => $request->all(),
        ]);

        // ❗ URL frontend (React)
        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        /**
         * Redirect user về FE
         * FE sẽ:
         * - đọc billId + resultCode
         * - gọi API confirm để update DB
         *
         * VD:
         * http://localhost:5173/momo-result?billId=86&resultCode=0
         */
        return redirect()->away(
            "{$frontendUrl}/momo-result"
                . "?billId={$billId}"
                . "&resultCode={$resultCode}"
        );
    }

    /**
     * ==================================================
     * 3. FE gọi API này để CONFIRM & UPDATE DB
     * (THAY THẾ IPN khi không dùng ngrok)
     * ==================================================
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'orderId'    => 'required|string',
            'resultCode' => 'required|integer',
            'transId'    => 'nullable|string',
        ]);

        $ok = $this->momoService->confirmFromClient(
            $request->orderId,
            $request->transId,
            (int) $request->resultCode
        );

        if (!$ok) {
            return response()->json([
                'message' => 'Confirm payment failed'
            ], 422);
        }

        return response()->json([
            'message' => 'Payment confirmed'
        ]);
    }


    /**
     * ==================================================
     * 4. IPN từ MoMo (OPTIONAL – LOG ONLY)
     * ❗ Local không dùng được nếu không có domain public
     * ==================================================
     */
    public function ipn(Request $request)
    {
        Log::info('MoMo IPN received', $request->all());

        // Không phụ thuộc IPN để update bill
        return response()->json([
            'resultCode' => 0,
            'message'    => 'OK'
        ]);
    }
}
