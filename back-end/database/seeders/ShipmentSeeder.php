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
        /*
        |--------------------------------------------------------------------------
        | 1. Reset dữ liệu
        |--------------------------------------------------------------------------
        */
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('shipments')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        /*
        |--------------------------------------------------------------------------
        | 2. Lấy dữ liệu nền
        |--------------------------------------------------------------------------
        */
        $customerIds = DB::table('customers')->pluck('id')->toArray();
        $agentIds    = DB::table('agents')->pluck('id')->toArray();
        $branchIds   = DB::table('branches')->pluck('id')->toArray();
        $statusIds   = DB::table('shipment_statuses')->pluck('id')->toArray();
        $serviceCodes = DB::table('shipment_services')->pluck('code')->toArray();

        if (
            empty($customerIds) ||
            empty($branchIds) ||
            empty($statusIds) ||
            empty($serviceCodes)
        ) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Bảng giá dịch vụ (giả lập)
        |--------------------------------------------------------------------------
        */
        $servicePrices = [
            'DOCUMENT' => 15000,
            'PACKAGE'  => 20000,
            'EXPRESS'  => 40000,
        ];

        /*
        |--------------------------------------------------------------------------
        | 4. Fake data
        |--------------------------------------------------------------------------
        */
        $fakeData = [
            [
                'sender'   => ['Nguyễn Văn A', '09010001', '123 Lê Lợi', 'TP. Hồ Chí Minh'],
                'receiver' => ['Trần Thị B', '09870001', '456 Nguyễn Huệ', 'Hà Nội'],
                'service'  => 'PACKAGE',
                'weight'   => 1.5,
                'days'     => 3,
            ],
            [
                'sender'   => ['Lê Thị C', '09010002', '789 Hai Bà Trưng', 'Đà Nẵng'],
                'receiver' => ['Phạm Văn D', '09870002', '321 Trần Hưng Đạo', 'TP. Hồ Chí Minh'],
                'service'  => 'DOCUMENT',
                'weight'   => 0.8,
                'days'     => 2,
            ],
            [
                'sender'   => ['Nguyễn Văn E', '09010003', '111 Nguyễn Văn Cừ', 'Cần Thơ'],
                'receiver' => ['Trần Thị F', '09870003', '222 Lê Lai', 'Hà Nội'],
                'service'  => 'EXPRESS',
                'weight'   => 0.5,
                'days'     => 1,
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | 5. Build shipment records
        |--------------------------------------------------------------------------
        */
        $shipments = [];

        foreach ($fakeData as $data) {

            if (!in_array($data['service'], $serviceCodes)) {
                continue;
            }

            $pricePerKg = $servicePrices[$data['service']] ?? 20000;
            $charge = $data['weight'] * $pricePerKg;

            $shipments[] = [
                'tracking_number' => 'TRK-' . strtoupper(Str::random(10)),

                'customer_id' => $customerIds[array_rand($customerIds)],
                'agent_id'    => !empty($agentIds) ? $agentIds[array_rand($agentIds)] : null,

                // ✅ ĐÚNG ERD
                'current_branch_id' => $branchIds[array_rand($branchIds)],
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
                'charge' => $charge,

                'expected_delivery_date' => Carbon::now()->addDays($data['days']),

                'created_at' => now(),
                'updated_at' => now(), 
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Insert
        |--------------------------------------------------------------------------
        */
        DB::table('shipments')->insert($shipments);
    }
}
