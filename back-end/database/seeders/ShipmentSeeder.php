<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ShipmentSeeder extends Seeder
{
    public function run(): void
    {
        // Tắt FK để truncate an toàn
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('shipments')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Lấy dữ liệu nền
        $customerIds = DB::table('customers')->pluck('id')->toArray();
        $agentIds    = DB::table('agents')->pluck('id')->toArray();
        $branchIds   = DB::table('branches')->pluck('id')->toArray();
        $statusIds   = DB::table('shipment_statuses')->pluck('id')->toArray();
        $serviceCodes = DB::table('shipment_services')->pluck('code')->toArray();

        // Thiếu dữ liệu nền thì không seed
        if (
            empty($customerIds) ||
            empty($branchIds) ||
            empty($statusIds) ||
            empty($serviceCodes)
        ) {
            return;
        }

        $fakeData = [
            [
                'sender'   => ['Nguyễn Văn A', '09010001', '123 Lê Lợi', 'Hồ Chí Minh'],
                'receiver' => ['Trần Thị B', '09870001', '456 Nguyễn Huệ', 'Hà Nội'],
                'service'  => 'PACKAGE',
                'weight'   => 1.5,
                'days'     => 3,
            ],
            [
                'sender'   => ['Lê Thị C', '09010002', '789 Hai Bà Trưng', 'Đà Nẵng'],
                'receiver' => ['Phạm Văn D', '09870002', '321 Trần Hưng Đạo', 'Hồ Chí Minh'],
                'service'  => 'DOCUMENT',
                'weight'   => 2.0,
                'days'     => 4,
            ],
            [
                'sender'   => ['Nguyễn Văn E', '09010003', '111 Nguyễn Văn Cừ', 'Cần Thơ'],
                'receiver' => ['Trần Thị F', '09870003', '222 Lê Lai', 'Hà Nội'],
                'service'  => 'EXPRESS',
                'weight'   => 0.5,
                'days'     => 2,
            ],
        ];

        $shipments = [];

        foreach ($fakeData as $data) {
            // đảm bảo service code tồn tại
            if (!in_array($data['service'], $serviceCodes)) {
                continue;
            }

            $shipments[] = [
                'tracking_number' => 'TRK-' . strtoupper(Str::random(8)),

                'customer_id' => $customerIds[array_rand($customerIds)],
                'agent_id'    => !empty($agentIds) ? $agentIds[array_rand($agentIds)] : null,
                'branch_id'   => $branchIds[array_rand($branchIds)],
                'current_status_id' => $statusIds[array_rand($statusIds)],

                // Sender
                'sender_name'    => $data['sender'][0],
                'sender_phone'   => $data['sender'][1],
                'sender_address' => $data['sender'][2],
                'sender_city'    => $data['sender'][3],

                // Receiver
                'receiver_name'    => $data['receiver'][0],
                'receiver_phone'   => $data['receiver'][1],
                'receiver_address' => $data['receiver'][2],
                'receiver_city'    => $data['receiver'][3],

                // Service
                'shipment_service_code' => $data['service'],

                'weight' => $data['weight'],
                'expected_delivery_date' => Carbon::now()->addDays($data['days']),

                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('shipments')->insert($shipments);
    }
}
