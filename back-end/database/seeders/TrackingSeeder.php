<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class TrackingSeeder extends Seeder
{
    public function run(): void
    {
        

        $shipments = DB::table('shipments')->get();

        $statusId = DB::table('shipment_statuses')
            ->where('code', 'PLACED')
            ->value('id');

        if (!$statusId) {
            $this->command->error('Shipment status PLACED not found');
            return;
        }

        $accountId = DB::table('accounts')
            ->where('role', 'ADMIN')
            ->value('id');

        foreach ($shipments as $shipment) {
            DB::table('trackings')->insert([
                'shipment_id'    => $shipment->id,
                'status_id'      => $statusId,
                'from_branch_id' => null,
                'to_branch_id'   => $shipment->current_branch_id,
                'updated_by'     => $accountId,
                'direction_flag' => 'IN',
                'note'           => 'Auto tracking: Đã tạo đơn',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        }
    }
}
