<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy tất cả account_id
        $accountIds = DB::table('accounts')->pluck('id')->toArray();

        // Lấy tất cả shipment_id
        $shipmentIds = DB::table('shipments')->pluck('id')->toArray();

        $notifications = [];

        foreach ($accountIds as $accountId) {
            // Mỗi account có thể có từ 1 đến 3 thông báo
            $numNotifications = rand(1, 3);

            for ($i = 0; $i < $numNotifications; $i++) {
                $notifications[] = [
                    'account_id'  => $accountId,
                    'shipment_id' => rand(0, 1) ? $shipmentIds[array_rand($shipmentIds)] : null, // 50% có shipment
                    'title'       => 'Thông báo #' . rand(100, 999),
                    'message'     => 'Đây là nội dung thông báo thử nghiệm.',
                    'is_read'     => rand(0, 1) ? true : false,
                    'sent_at'     => now(),
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            }
        }

        DB::table('notifications')->insert($notifications);
    }
}
