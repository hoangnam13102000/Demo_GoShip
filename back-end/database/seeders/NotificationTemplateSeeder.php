<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationTemplateSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notification_templates')->insert([
            [
                'code' => 'SHIPMENT_CREATED',
                'title' => 'Shipment Created',
                'content' => 'Your shipment with tracking number :tracking_number has been created.',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SHIPMENT_IN_TRANSIT',
                'title' => 'Shipment In Transit',
                'content' => 'Your shipment :tracking_number is currently in transit.',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SHIPMENT_DELIVERED',
                'title' => 'Shipment Delivered',
                'content' => 'Your shipment :tracking_number has been delivered successfully.',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SHIPMENT_DELAYED',
                'title' => 'Shipment Delayed',
                'content' => 'Your shipment :tracking_number has been delayed due to :reason.',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'PAYMENT_RECEIVED',
                'title' => 'Payment Received',
                'content' => 'We have received your payment for shipment :tracking_number.',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
