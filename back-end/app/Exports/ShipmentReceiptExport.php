<?php

namespace App\Exports;

use App\Models\Shipment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ShipmentReceiptExport implements FromCollection, WithHeadings
{
    protected $start;
    protected $end;

    public function __construct($start = null, $end = null)
    {
        $this->start = $start;
        $this->end = $end;
    }

    public function collection()
    {
        $query = Shipment::query()
            ->join('customers', 'shipments.customer_id', '=', 'customers.id')
            ->select(
                'shipments.tracking_number',
                'customers.full_name as customer_name',
                'shipments.sender_name',
                'shipments.receiver_name',
                'shipments.weight',
                'shipments.charge',
                'shipments.created_at'
            );

        if ($this->start && $this->end) {
            $query->whereBetween('shipments.created_at', [$this->start . ' 00:00:00', $this->end . ' 23:59:59']);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Mã vận đơn',
            'Khách hàng',
            'Người gửi',
            'Người nhận',
            'Khối lượng (kg)',
            'Cước phí (VND)',
            'Ngày tạo',
        ];
    }
}
