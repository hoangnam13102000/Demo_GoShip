<table>
    <thead>
        <tr>
            <th>Tổng đơn hàng</th>
            <th>Khách hàng</th>
            <th>Đang vận chuyển</th>
            <th>Doanh thu</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{ $summary['totalOrders'] }}</td>
            <td>{{ $summary['totalCustomers'] }}</td>
            <td>{{ $summary['inTransit'] }}</td>
            <td>{{ number_format($summary['totalRevenue'], 0, ',', '.') }} VNĐ</td>
        </tr>
    </tbody>
</table>

<br><br>

<table>
    <thead>
        <tr>
            <th>Mã vận đơn</th>
            <th>Khách hàng</th>
            <th>Dịch vụ</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Phí</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($shipments as $s)
            <tr>
                <td>{{ $s->tracking_number }}</td>
                <td>{{ DB::table('customers')->where('id', $s->customer_id)->value('full_name') }}</td>
                <td>{{ $s->shipment_service_code }}</td>
                <td>{{ DB::table('shipment_statuses')->where('id', $s->current_status_id)->value('name') }}</td>
                <td>{{ $s->created_at }}</td>
                <td>{{ number_format($s->charge, 0, ',', '.') }} VNĐ</td>
            </tr>
        @endforeach
    </tbody>
</table>
