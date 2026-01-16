<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BranchResolver;
use App\Services\ShipmentTransferService;
use App\Models\Shipment;
use App\Models\Branch;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ShipmentController extends Controller
{
    protected BranchResolver $branchResolver;

    public function __construct(BranchResolver $branchResolver)
    {
        $this->branchResolver = $branchResolver;
    }

    /* =======================
     * LIST SHIPMENTS
     * ======================= */
    public function index()
    {
        return response()->json(
            Shipment::with(['customer', 'agent', 'currentStatus'])
                ->orderByDesc('created_at')
                ->get()
        );
    }

    /* =======================
     * CREATE SHIPMENT
     * ======================= */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'agent_id' => 'nullable|exists:agents,id',

            'current_branch_id' => 'nullable|exists:branches,id',
            'current_status_id' => 'required|exists:shipment_statuses,id',

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

            'expected_delivery_date' => 'nullable|date',
            'payment_method' => 'nullable|in:CASH,MOMO',
        ]);

        $paymentMethod = $validated['payment_method'] ?? null;
        unset($validated['payment_method']);

        return DB::transaction(function () use ($validated, $paymentMethod) {

            /* =======================
             * RESOLVE BRANCH
             * ======================= */
            if (empty($validated['current_branch_id'])) {
                $branch = $this->branchResolver
                    ->resolveByCity($validated['sender_city'] ?? null)
                    ?? Branch::where('city', $validated['sender_city'])
                        ->where('status', 'ACTIVE')
                        ->first();

                if (!$branch) {
                    abort(422, 'Chưa có chi nhánh phục vụ khu vực gửi');
                }

                $validated['current_branch_id'] = $branch->id;
            }

            /* =======================
             * CREATE SHIPMENT
             * ======================= */
            $validated['tracking_number'] = 'TRK-' . strtoupper(Str::random(10));
            $shipment = Shipment::create($validated);

            /* =======================
             * CREATE TRACKING (IN)
             * ======================= */
            DB::table('trackings')->insert([
                'shipment_id'    => $shipment->id,
                'from_branch_id' => null,
                'to_branch_id'   => $validated['current_branch_id'],
                'status_id'      => $validated['current_status_id'],
                'updated_by'     => Auth::id(),
                'direction_flag' => 'IN',
                'note'           => 'Đơn hàng được tạo',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            /* =======================
             * CREATE BILL (FIX base_amount)
             * ======================= */
            $bill = Bill::create([
                'shipment_id'  => $shipment->id,
                'base_amount'  => $shipment->charge, // ✅ FIX LỖI 1364
                'total_amount' => $shipment->charge,
                'status'       => $paymentMethod === 'CASH' ? 'PAID' : 'UNPAID',
            ]);

            /* =======================
             * CASH PAYMENT
             * ======================= */
            if ($paymentMethod === 'CASH') {
                Payment::create([
                    'bill_id' => $bill->id,
                    'method'  => 'CASH',
                    'amount'  => $shipment->charge,
                    'status'  => 'SUCCESS',
                    'paid_at' => now(),
                ]);
            }

            /* =======================
             * RESPONSE
             * ======================= */
            return response()->json([
                'shipment_id'     => $shipment->id,
                'tracking_number' => $shipment->tracking_number,
                'bill_id'         => $bill->id,
                'charge'          => $shipment->charge,
                'payment_method'  => $paymentMethod,
            ], 201);
        });
    }

    /* =======================
     * SHOW SHIPMENT
     * ======================= */
    public function show($id)
    {
        return response()->json(
            Shipment::with(['customer', 'agent', 'currentStatus'])
                ->findOrFail($id)
        );
    }

    /* =======================
     * UPDATE SHIPMENT
     * ======================= */
    public function update(Request $request, $id, ShipmentTransferService $service)
    {
        $shipment = Shipment::findOrFail($id);

        $validated = $request->validate([
            'current_branch_id' => 'sometimes|exists:branches,id',
            'current_status_id' => 'sometimes|exists:shipment_statuses,id',
        ]);

        return DB::transaction(function () use ($shipment, $validated, $service) {

            if (
                isset($validated['current_branch_id']) &&
                $validated['current_branch_id'] != $shipment->current_branch_id
            ) {
                $service->transfer(
                    $shipment,
                    $validated['current_branch_id'],
                    $validated['current_status_id'] ?? $shipment->current_status_id
                );
            }

            $shipment->update($validated);

            return response()->json($shipment->fresh());
        });
    }

    /* =======================
     * TRACKING
     * ======================= */
    public function track($trackingNumber)
    {
        $shipment = Shipment::with([
            'currentStatus',
            'trackingHistory' => fn ($q) =>
                $q->where('direction_flag', 'IN')->orderBy('created_at'),
            'trackingHistory.status',
            'trackingHistory.toBranch',
        ])->where('tracking_number', $trackingNumber)->first();

        if (!$shipment) {
            return response()->json(['message' => 'Vận đơn không tồn tại'], 404);
        }

        $lastTracking = $shipment->trackingHistory->last();

        return response()->json([
            'tracking_number' => $shipment->tracking_number,
            'status' => $shipment->currentStatus->name ?? 'Chưa cập nhật',
            'current_location' => $lastTracking?->toBranch?->name ?? 'Chưa xác định',
            'estimated_delivery' => $shipment->expected_delivery_date,
            'history' => $shipment->trackingHistory->map(fn ($t) => [
                'status' => $t->status->name ?? '',
                'location' => $t->toBranch?->name ?? '',
                'time' => $t->created_at->format('Y-m-d H:i'),
            ]),
        ]);
    }

    /* =======================
     * MY ORDERS
     * ======================= */
    public function myOrders(Request $request)
    {
        $customerId = $request->query('customer_id');

        if (!$customerId) {
            return response()->json(['message' => 'customer_id is required'], 400);
        }

        return response()->json(
            Shipment::with([
                'trackingHistory.status',
                'trackingHistory.toBranch',
                'service',
                'currentStatus'
            ])
                ->where('customer_id', $customerId)
                ->orderByDesc('created_at')
                ->get()
        );
    }
}
