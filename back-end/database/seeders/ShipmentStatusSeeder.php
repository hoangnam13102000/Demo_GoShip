<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShipmentStatusSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('shipment_statuses')->insert([
            ['code' => 'S001','name'=>'PLACED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S002','name'=>'PICKED_UP','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S003','name'=>'IN_TRANSIT','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S004','name'=>'DELIVERED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S005','name'=>'CANCELLED','created_at'=>now(),'updated_at'=>now()],
        ]);
    }
}
