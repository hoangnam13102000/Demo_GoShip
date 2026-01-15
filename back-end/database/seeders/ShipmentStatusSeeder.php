<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShipmentStatusSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('shipment_statuses')->insert([
            [
                'code' => 'PLACED',
                'name' => 'Đã tạo đơn',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'PICKED_UP',
                'name' => 'Đã lấy hàng',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'IN_TRANSIT',
                'name' => 'Đang vận chuyển',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'DELIVERED',
                'name' => 'Đã giao hàng',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'CANCELLED',
                'name' => 'Đã huỷ',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
