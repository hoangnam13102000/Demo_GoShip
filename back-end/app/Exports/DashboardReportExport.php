<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Support\Facades\DB;

class DashboardReportExport implements FromView
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate = null, $endDate = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function view(): View
    {
        $shipments = DB::table('shipments');
        $bills = DB::table('bills')->where('status', 'PAID');

        if ($this->startDate && $this->endDate) {
            $shipments->whereBetween('created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59']);
            $bills->whereBetween('created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59']);
        }

        $summary = [
            'totalOrders' => $shipments->count(),
            'totalCustomers' => DB::table('customers')
                ->whereIn('id', $shipments->pluck('customer_id'))
                ->count(),
            'inTransit' => $shipments
                ->where('current_status_id', function ($q) {
                    $q->select('id')->from('shipment_statuses')->where('code', 'IN_TRANSIT')->limit(1);
                })->count(),
            'totalRevenue' => $bills->sum('total_amount'),
        ];

        return view('exports.dashboard_report', [
            'summary' => $summary,
            'shipments' => $shipments->get(),
        ]);
    }
}
