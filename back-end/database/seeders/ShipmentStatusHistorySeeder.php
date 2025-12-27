<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShipmentStatusHistorySeeder extends Seeder
{
    public function run(): void
    {
        $shipmentIds = DB::table('shipments')->pluck('id')->toArray();
        $statusIds   = DB::table('shipment_statuses')->pluck('id')->toArray();

        DB::table('shipment_status_histories')->insert([
            [
                'shipment_id' => $shipmentIds[array_rand($shipmentIds)],
                'status_id'   => $statusIds[array_rand($statusIds)],
                'note'        => 'Package received at branch.',
                'updated_by'  => 1,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'shipment_id' => $shipmentIds[array_rand($shipmentIds)],
                'status_id'   => $statusIds[array_rand($statusIds)],
                'note'        => 'Out for delivery.',
                'updated_by'  => 1,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
