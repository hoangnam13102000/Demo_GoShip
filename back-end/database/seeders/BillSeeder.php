<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BillSeeder extends Seeder
{
    public function run(): void
    {
        // Xóa dữ liệu cũ
        DB::table('bills')->delete();

        // Lấy tất cả shipment_id có sẵn
        $shipmentIds = DB::table('shipments')->pluck('id')->toArray();

        // Nếu không có shipment nào, dừng
        if (empty($shipmentIds)) {
            $this->command->info('No shipments found. Skipping BillSeeder.');
            return;
        }

        $bills = [];
        foreach ($shipmentIds as $shipmentId) {
            $bills[] = [
                'shipment_id' => $shipmentId,
                'base_amount' => rand(10000, 25000),
                'weight_fee'  => rand(2000, 8000),
                'tax'         => rand(1000, 3000),
                'total_amount'=> rand(15000, 32000),
                'status'      => rand(0,1) ? 'PAID' : 'UNPAID',
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }

        DB::table('bills')->insert($bills);
    }
}
