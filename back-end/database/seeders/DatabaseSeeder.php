<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        
        DB::table('notifications')->truncate();
        DB::table('trackings')->truncate();
        DB::table('payments')->truncate();
        DB::table('bills')->truncate();
        DB::table('shipments')->truncate();
        DB::table('customers')->truncate();
        DB::table('accounts')->truncate();
        DB::table('branches')->truncate();
        DB::table('shipment_services')->truncate();
        DB::table('shipment_statuses')->truncate();

        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        
        $this->call([
            AccountSeeder::class,
            BranchSeeder::class,
            ShipmentServiceSeeder::class,
            ShipmentStatusSeeder::class,

            CustomerSeeder::class,
            AgentSeeder::class,

            ShipmentSeeder::class,
            BillSeeder::class,
            PaymentSeeder::class,
            TrackingSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
