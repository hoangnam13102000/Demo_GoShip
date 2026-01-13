<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Exports\DashboardReportExport;
use App\Exports\ShipmentReceiptExport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // =========================
    // 1. Tổng quan báo cáo
    // =========================
    public function summary(\Illuminate\Http\Request $request)
    {
        $start = $request->query('start_date'); // YYYY-MM-DD
        $end = $request->query('end_date');     // YYYY-MM-DD

        $shipments = DB::table('shipments');
        $bills = DB::table('bills')->where('status', 'PAID');

        if ($start && $end) {
            $shipments->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59']);
            $bills->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59']);
        }

        $totalOrders = $shipments->count();
        $totalCustomers = DB::table('customers')
            ->whereIn('id', $shipments->pluck('customer_id'))
            ->count();
        $inTransit = $shipments
            ->where('current_status_id', function ($q) {
                $q->select('id')->from('shipment_statuses')->where('code', 'IN_TRANSIT')->limit(1);
            })->count();
        $totalRevenue = $bills->sum('total_amount');

        return response()->json([
            'totalOrders' => $totalOrders,
            'totalCustomers' => $totalCustomers,
            'inTransit' => $inTransit,
            'totalRevenue' => $totalRevenue,
        ]);
    }

    // =========================
    // 2. Doanh thu theo tháng
    // =========================
    public function revenueLast12Months()
    {
        $today = Carbon::now();
        $labels = [];
        $values = [];

        for ($i = 11; $i >= 0; $i--) {
            $month = $today->copy()->subMonths($i);
            $labels[] = $month->format('M Y'); // Jan 2026
            $total = DB::table('bills')
                ->join('shipments', 'bills.shipment_id', '=', 'shipments.id')
                ->whereYear('bills.created_at', $month->year)
                ->whereMonth('bills.created_at', $month->month)
                ->where('bills.status', 'PAID')
                ->sum('bills.total_amount');
            $values[] = (int) $total;
        }

        return response()->json(['labels' => $labels, 'values' => $values]);
    }

    // =========================
    // 3. Top khách hàng
    // =========================
    public function topCustomers(\Illuminate\Http\Request $request)
    {
        $start = $request->query('start_date');
        $end = $request->query('end_date');

        $query = DB::table('shipments')
            ->join('customers', 'shipments.customer_id', '=', 'customers.id');

        if ($start && $end) {
            $query->whereBetween('shipments.created_at', [$start . ' 00:00:00', $end . ' 23:59:59']);
        }

        $top = $query
            ->select('customers.full_name', DB::raw('COUNT(shipments.id) as total_shipments'))
            ->groupBy('customers.id', 'customers.full_name')
            ->orderByDesc('total_shipments')
            ->limit(5)
            ->get();

        return response()->json($top);
    }

    // =========================
    // 4. Top dịch vụ
    // =========================
    public function topServices(\Illuminate\Http\Request $request)
    {
        $start = $request->query('start_date');
        $end = $request->query('end_date');

        $query = DB::table('shipments');

        if ($start && $end) {
            $query->whereBetween('created_at', [$start . ' 00:00:00', $end . ' 23:59:59']);
        }

        $top = $query
            ->select('shipment_service_code as service_name', DB::raw('COUNT(id) as total_shipments'))
            ->groupBy('shipment_service_code')
            ->orderByDesc('total_shipments')
            ->limit(5)
            ->get();

        return response()->json($top);
    }
    public function exportExcel()
    {
        return Excel::download(new DashboardReportExport, 'dashboard.xlsx');
    }
    public function exportReceiptsExcel(\Illuminate\Http\Request $request)
    {
        $start = $request->query('start_date');
        $end = $request->query('end_date');

        return Excel::download(new ShipmentReceiptExport($start, $end), 'shipment_receipts.xlsx');
    }
}
