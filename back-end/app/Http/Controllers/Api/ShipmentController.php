<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BranchResolver;
use App\Models\Shipment;
use App\Models\Branch;
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
            Shipment::with([
                'customer',
                'agent',
                'currentStatus'
            ])->orderBy('created_at', 'desc')->get()
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
        ]);

        return DB::transaction(function () use ($validated) {

            /* =======================
             * AUTO RESOLVE BRANCH
             * ======================= */
            if (empty($validated['current_branch_id'])) {


                $branch = $this->branchResolver
                    ->resolveByCity($validated['sender_city'] ?? null);

                
                if (!$branch) {
                    $branch = Branch::where('city', $validated['sender_city'])
                        ->where('status', 'ACTIVE')
                        ->first();
                }

                if (!$branch) {
                    return response()->json([
                        'message' => 'Chưa có chi nhánh phục vụ khu vực gửi'
                    ], 422);
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

            return response()->json($shipment, 201);
        });
    }

    /* =======================
     * SHOW SHIPMENT
     * ======================= */
    public function show($id)
    {
        $shipment = Shipment::with(['customer', 'agent'])->findOrFail($id);
        return response()->json($shipment);
    }

    /* =======================
     * UPDATE SHIPMENT
     * ======================= */
    public function update(Request $request, $id)
    {
        $shipment = Shipment::findOrFail($id);

        $validated = $request->validate([
            'agent_id' => 'sometimes|nullable|exists:agents,id',
            'current_branch_id' => 'sometimes|exists:branches,id',
            'current_status_id' => 'sometimes|exists:shipment_statuses,id',

            'sender_name' => 'sometimes|string|max:255',
            'sender_address' => 'sometimes|string|max:255',
            'sender_phone' => 'sometimes|nullable|string|max:20',
            'sender_city' => 'sometimes|nullable|string|max:255',

            'receiver_name' => 'sometimes|string|max:255',
            'receiver_address' => 'sometimes|string|max:255',
            'receiver_phone' => 'sometimes|nullable|string|max:20',
            'receiver_city' => 'sometimes|nullable|string|max:255',

            'shipment_service_code' => 'sometimes|exists:shipment_services,code',
            'weight' => 'sometimes|numeric|min:0.1',
            'charge' => 'sometimes|numeric|min:0',

            'expected_delivery_date' => 'sometimes|nullable|date',
        ]);

        if (empty($validated)) {
            return response()->json($shipment);
        }

        return DB::transaction(function () use ($shipment, $validated) {

            $oldBranchId = $shipment->current_branch_id;
            $oldStatusId = $shipment->current_status_id;

            $shipment->update($validated);

            $hasBranchChange = isset($validated['current_branch_id'])
                && $validated['current_branch_id'] != $oldBranchId;

            $hasStatusChange = isset($validated['current_status_id'])
                && $validated['current_status_id'] != $oldStatusId;

            if ($hasBranchChange || $hasStatusChange) {

                /* ========= OUT ========= */
                if ($hasBranchChange && $oldBranchId) {
                    DB::table('trackings')->insert([
                        'shipment_id'    => $shipment->id,
                        'from_branch_id' => $oldBranchId,
                        'to_branch_id'   => $validated['current_branch_id'],
                        'status_id'      => $oldStatusId,
                        'updated_by'     => Auth::id(),
                        'direction_flag' => 'OUT',
                        'note'           => 'Xuất hàng khỏi chi nhánh',
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ]);
                }

                /* ========= IN ========= */
                DB::table('trackings')->insert([
                    'shipment_id'    => $shipment->id,
                    'from_branch_id' => $hasBranchChange ? $oldBranchId : null,
                    'to_branch_id'   => $hasBranchChange
                        ? $validated['current_branch_id']
                        : $shipment->current_branch_id,
                    'status_id'      => $hasStatusChange
                        ? $validated['current_status_id']
                        : $shipment->current_status_id,
                    'updated_by'     => Auth::id(),
                    'direction_flag' => 'IN',
                    'note'           => $hasStatusChange
                        ? 'Cập nhật trạng thái'
                        : 'Cập nhật chi nhánh',
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
            }

            return response()->json($shipment);
        });
    }

    /* =======================
     * DELETE
     * ======================= */
    public function destroy($id)
    {
        Shipment::findOrFail($id)->delete();
        return response()->json(['message' => 'Shipment deleted successfully']);
    }

    /* =======================
     * TRACKING PUBLIC API
     * ======================= */
    public function track($tracking_number)
    {
        $shipment = Shipment::with([
            'currentStatus',
            'trackingHistory.status',
            'trackingHistory.branch'
        ])->where('tracking_number', $tracking_number)->first();

        if (!$shipment) {
            return response()->json(['message' => 'Vận đơn không tồn tại'], 404);
        }

        return response()->json([
            'tracking_number' => $shipment->tracking_number,
            'status' => $shipment->currentStatus->name ?? 'Chưa cập nhật',
            'current_location' => optional(
                $shipment->trackingHistory->last()?->branch
            )->name ?? 'Chưa xác định',
            'estimated_delivery' => $shipment->expected_delivery_date,
            'history' => $shipment->trackingHistory->map(fn ($t) => [
                'status' => $t->status->name ?? '',
                'location' => $t->branch?->name ?? 'Không xác định',
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

        $shipments = Shipment::with([
            'trackingHistory.status',
            'trackingHistory.branch',
            'service',
            'currentStatus'
        ])
            ->where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($shipment) => [
                'id' => $shipment->id,
                'tracking_number' => $shipment->tracking_number,
                'status' => $shipment->currentStatus->name ?? 'Chưa cập nhật',
                'service' => $shipment->service->name ?? '',
                'created_at' => $shipment->created_at->format('Y-m-d H:i'),
                'estimated_delivery' => $shipment->expected_delivery_date,
                'history' => $shipment->trackingHistory->map(fn ($t) => [
                    'status' => $t->status->name,
                    'location' => $t->branch?->name ?? 'Không xác định',
                    'time' => $t->created_at->format('Y-m-d H:i'),
                ]),
            ]);

        return response()->json($shipments);
    }
}
