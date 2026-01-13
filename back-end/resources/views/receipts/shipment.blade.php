<!DOCTYPE html>
<html>
<head>
    <title>Biên nhận {{$shipment->tracking_number}}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; border: 1px solid #000; }
    </style>
</head>
<body>
    <h2>Biên nhận gửi hàng</h2>
    <p>Số đơn: {{$shipment->tracking_number}}</p>
    <p>Ngày tạo: {{$shipment->created_at->format('d/m/Y')}}</p>

    <h3>Người gửi</h3>
    <p>{{$shipment->sender_name}} - {{$shipment->sender_phone}}</p>
    <p>{{$shipment->sender_address}}, {{$shipment->sender_city}}</p>

    <h3>Người nhận</h3>
    <p>{{$shipment->receiver_name}} - {{$shipment->receiver_phone}}</p>
    <p>{{$shipment->receiver_address}}, {{$shipment->receiver_city}}</p>

    <h3>Thông tin hàng hóa</h3>
    <p>Dịch vụ: {{$shipment->shipment_service_code}}</p>
    <p>Trọng lượng: {{$shipment->weight}} kg</p>
    <p>Phí vận chuyển: {{number_format($shipment->charge)}} VND</p>
</body>
</html>
