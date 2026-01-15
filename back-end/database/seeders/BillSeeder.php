<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BillSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('payments')->truncate();
        DB::table('bills')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $shipmentIds = DB::table('shipments')->pluck('id');

        if ($shipmentIds->isEmpty()) {
            return;
        }

        $bills = [];

        foreach ($shipmentIds as $shipmentId) {
            $baseAmount = rand(10000, 25000);
            $weightFee  = rand(2000, 8000);
            $tax        = (int)(($baseAmount + $weightFee) * 0.1);

            $bills[] = [
                'shipment_id'  => $shipmentId,
                'base_amount'  => $baseAmount,
                'weight_fee'   => $weightFee,
                'tax'          => $tax,
                'total_amount' => $baseAmount + $weightFee + $tax,
                'status'       => rand(0, 1) ? 'PAID' : 'UNPAID',
                'created_at'   => now(),
                'updated_at'   => now(),
            ];
        }

        DB::table('bills')->insert($bills);
    }
}
