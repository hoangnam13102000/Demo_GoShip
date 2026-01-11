<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class TrackingSeeder extends Seeder
{
    public function run(): void
    {
        $shipments = DB::table('shipments')->pluck('id');
        $statuses  = DB::table('shipment_statuses')->pluck('id');
        $branches  = DB::table('branches')->pluck('id');
        $accounts  = DB::table('accounts')->pluck('id');

        if (
            $shipments->isEmpty() ||
            $statuses->isEmpty() ||
            $branches->isEmpty() ||
            $accounts->isEmpty()
        ) {
            $this->command->warn('TrackingSeeder skipped: missing required data.');
            return;
        }

        foreach ($shipments as $shipmentId) {

            $logCount = rand(2, 5);
            $time = Carbon::now()->subDays($logCount);

            for ($i = 0; $i < $logCount; $i++) {

                DB::table('tracking')->insert([
                    'shipment_id'    => $shipmentId,
                    'status_id'      => $statuses->random(),
                    'branch_id'      => $branches->random(),
                    'updated_by'     => $accounts->random(),
                    'direction_flag' => rand(0, 1) ? 'IN' : 'OUT',
                    'note'           => 'Auto generated tracking log',
                    'updated_at'     => $time->addHours(rand(3, 8)),
                ]);
            }
        }

        $this->command->info('TrackingSeeder completed.');
    }
}
