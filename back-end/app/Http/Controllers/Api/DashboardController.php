<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Exports\DashboardReportExport;
use App\Exports\ShipmentReceiptExport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // ==================================================
    // 1. Tổng quan dashboard
    // ==================================================
    public function summary(Request $request)
    {
        $start = $request->query('start_date');
        $end   = $request->query('end_date');

        $shipmentsQuery = DB::table('shipments');
        $billsQuery     = DB::table('bills')->where('status', 'PAID');

        if ($start && $end) {
            $shipmentsQuery->whereBetween(
                'created_at',
                [$start . ' 00:00:00', $end . ' 23:59:59']
            );

            $billsQuery->whereBetween(
                'created_at',
                [$start . ' 00:00:00', $end . ' 23:59:59']
            );
        }

        $pendingCount = DB::table('shipments')
            ->where('current_status_id', function ($q) {
                $q->select('id')
                    ->from('shipment_statuses')
                    ->where('code', 'PLACED')
                    ->limit(1);
            })
            ->count();

        $inTransitCount = DB::table('shipments')
            ->where('current_status_id', function ($q) {
                $q->select('id')
                    ->from('shipment_statuses')
                    ->where('code', 'IN_TRANSIT')
                    ->limit(1);
            })
            ->count();

        return response()->json([
            'totalOrders'    => $shipmentsQuery->count(),
            'totalCustomers' => DB::table('customers')
                ->whereIn(
                    'id',
                    $shipmentsQuery->pluck('customer_id')
                )
                ->count(),
            'pending'        => $pendingCount,
            'inTransit'      => $inTransitCount,
            'totalRevenue'   => $billsQuery->sum('total_amount'),
        ]);
    }

    // ==================================================
    // 2. Doanh thu 12 tháng gần nhất
    // ==================================================
    public function revenueLast12Months()
    {
        $today  = Carbon::now();
        $labels = [];
        $values = [];

        for ($i = 11; $i >= 0; $i--) {
            $month = $today->copy()->subMonths($i);

            $labels[] = $month->format('M Y');

            $total = DB::table('bills')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->where('status', 'PAID')
                ->sum('total_amount');

            $values[] = (int) $total;
        }

        return response()->json([
            'labels' => $labels,
            'values' => $values
        ]);
    }

    // ==================================================
    // 3. Top khách hàng
    // ==================================================
    public function topCustomers(Request $request)
    {
        $start = $request->query('start_date');
        $end   = $request->query('end_date');

        $query = DB::table('shipments')
            ->join('customers', 'shipments.customer_id', '=', 'customers.id');

        if ($start && $end) {
            $query->whereBetween(
                'shipments.created_at',
                [$start . ' 00:00:00', $end . ' 23:59:59']
            );
        }

        return response()->json(
            $query->select(
                'customers.full_name',
                DB::raw('COUNT(shipments.id) as total_shipments')
            )
                ->groupBy('customers.id', 'customers.full_name')
                ->orderByDesc('total_shipments')
                ->limit(5)
                ->get()
        );
    }

    // ==================================================
    // 4. Top dịch vụ
    // ==================================================
    public function topServices(Request $request)
    {
        $start = $request->query('start_date');
        $end   = $request->query('end_date');

        $query = DB::table('shipments');

        if ($start && $end) {
            $query->whereBetween(
                'created_at',
                [$start . ' 00:00:00', $end . ' 23:59:59']
            );
        }

        return response()->json(
            $query->select(
                'shipment_service_code as service_name',
                DB::raw('COUNT(id) as total_shipments')
            )
                ->groupBy('shipment_service_code')
                ->orderByDesc('total_shipments')
                ->limit(5)
                ->get()
        );
    }


    // ==================================================
    // 5. Danh sách đơn hàng vừa tạo (PLACED)
    // ==================================================
    public function pendingShipments()
    {
        $placedStatusId = DB::table('shipment_statuses')
            ->where('code', 'PLACED')
            ->value('id');

        return response()->json(
            DB::table('shipments')
                ->join('customers', 'shipments.customer_id', '=', 'customers.id')
                ->where('shipments.current_status_id', $placedStatusId)
                ->orderByDesc('shipments.created_at')
                ->select(
                    'shipments.id',
                    'shipments.tracking_number',
                    'customers.full_name as customer_name',
                    'shipments.created_at'
                )
                ->get()
        );
    }



    // ==================================================
    // 6. Export Excel
    // ==================================================
    public function exportExcel()
    {
        return Excel::download(
            new DashboardReportExport,
            'dashboard.xlsx'
        );
    }

    public function exportReceiptsExcel(Request $request)
    {
        return Excel::download(
            new ShipmentReceiptExport(
                $request->query('start_date'),
                $request->query('end_date')
            ),
            'shipment_receipts.xlsx'
        );
    }
}
