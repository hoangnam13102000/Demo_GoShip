<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShipmentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('shipments')->delete();

        // Lấy danh sách ID từ bảng customer và agent
        $customerIds = DB::table('customers')->pluck('id')->toArray();
        $agentIds    = DB::table('agents')->pluck('id')->toArray();

        // Tạo 5 bản ghi shipment
        $shipments = [
            [
                'tracking_number' => 'TRK001',
                'customer_id' => $customerIds[array_rand($customerIds)],
                'agent_id'    => $agentIds[array_rand($agentIds)],
                'branch_id'   => 1,
                'sender_name' => 'Nguyễn Văn A',
                'sender_address' => '123 Lê Lợi',
                'sender_phone' => '09010001',
                'receiver_name' => 'Trần Thị B',
                'receiver_address' => '456 Nguyễn Huệ',
                'receiver_phone' => '09870001',
                'shipment_type' => 'PACKAGE',
                'weight' => 1.5,
                'charge' => 10000,
                'expected_delivery_date' => now()->addDays(3),
                'current_status_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tracking_number' => 'TRK002',
                'customer_id' => $customerIds[array_rand($customerIds)],
                'agent_id'    => $agentIds[array_rand($agentIds)],
                'branch_id'   => 2,
                'sender_name' => 'Lê Thị C',
                'sender_address' => '789 Hai Bà Trưng',
                'sender_phone' => '09010002',
                'receiver_name' => 'Phạm Văn D',
                'receiver_address' => '321 Trần Hưng Đạo',
                'receiver_phone' => '09870002',
                'shipment_type' => 'DOCUMENT',
                'weight' => 2,
                'charge' => 20000,
                'expected_delivery_date' => now()->addDays(4),
                'current_status_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tracking_number' => 'TRK003',
                'customer_id' => $customerIds[array_rand($customerIds)],
                'agent_id'    => $agentIds[array_rand($agentIds)],
                'branch_id'   => 1,
                'sender_name' => 'Nguyễn Văn E',
                'sender_address' => '111 Nguyễn Văn Cừ',
                'sender_phone' => '09010003',
                'receiver_name' => 'Trần Thị F',
                'receiver_address' => '222 Lê Lai',
                'receiver_phone' => '09870003',
                'shipment_type' => 'EXPRESS',
                'weight' => 0.5,
                'charge' => 15000,
                'expected_delivery_date' => now()->addDays(2),
                'current_status_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tracking_number' => 'TRK004',
                'customer_id' => $customerIds[array_rand($customerIds)],
                'agent_id'    => $agentIds[array_rand($agentIds)],
                'branch_id'   => 2,
                'sender_name' => 'Lê Văn G',
                'sender_address' => '333 Phan Chu Trinh',
                'sender_phone' => '09010004',
                'receiver_name' => 'Phạm Thị H',
                'receiver_address' => '444 Nguyễn Trãi',
                'receiver_phone' => '09870004',
                'shipment_type' => 'PACKAGE',
                'weight' => 3,
                'charge' => 25000,
                'expected_delivery_date' => now()->addDays(5),
                'current_status_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tracking_number' => 'TRK005',
                'customer_id' => $customerIds[array_rand($customerIds)],
                'agent_id'    => $agentIds[array_rand($agentIds)],
                'branch_id'   => 1,
                'sender_name' => 'Nguyễn Văn I',
                'sender_address' => '555 Bạch Đằng',
                'sender_phone' => '09010005',
                'receiver_name' => 'Trần Thị J',
                'receiver_address' => '666 Trần Phú',
                'receiver_phone' => '09870005',
                'shipment_type' => 'DOCUMENT',
                'weight' => 2.5,
                'charge' => 30000,
                'expected_delivery_date' => now()->addDays(3),
                'current_status_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('shipments')->insert($shipments);
    }
}
