<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ShipmentServiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('shipment_services')->insert([
            [
                'code' => 'DOCUMENT',
                'name' => 'Tài liệu',
                'description' => 'Gửi tài liệu quan trọng, nhẹ, cần giao nhanh',
                'base_price' => 15000,
                'max_weight' => 1.00,
                'estimated_delivery_time' => '24h',
                'features' => json_encode([
                    'Trọng lượng < 1kg',
                    'Giao nhanh trong 24h',
                    'Bảo hiểm tài liệu'
                ]),
                'is_featured' => false,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'code' => 'PACKAGE',
                'name' => 'Kiện hàng',
                'description' => 'Gửi kiện hàng nhỏ đến trung bình',
                'base_price' => 25000,
                'max_weight' => 20.00,
                'estimated_delivery_time' => '2-3 ngày',
                'features' => json_encode([
                    'Trọng lượng < 20kg',
                    'Giao trong 2-3 ngày',
                    'Hỗ trợ 24/7'
                ]),
                'is_featured' => true,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'code' => 'EXPRESS',
                'name' => 'Express',
                'description' => 'Gửi hàng hoả tốc cho khách VIP',
                'base_price' => 50000,
                'max_weight' => 30.00,
                'estimated_delivery_time' => '12h',
                'features' => json_encode([
                    'Trọng lượng < 30kg',
                    'Giao trong 12h',
                    'Theo dõi GPS realtime'
                ]),
                'is_featured' => false,
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
