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
            ['code' => 'S006','name'=>'PLACED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S007','name'=>'PICKED_UP','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S008','name'=>'IN_TRANSIT','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S009','name'=>'DELIVERED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S010','name'=>'CANCELLED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S011','name'=>'PLACED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S012','name'=>'PICKED_UP','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S013','name'=>'IN_TRANSIT','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S014','name'=>'DELIVERED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S015','name'=>'CANCELLED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S016','name'=>'PLACED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S017','name'=>'PICKED_UP','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S018','name'=>'IN_TRANSIT','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S019','name'=>'DELIVERED','created_at'=>now(),'updated_at'=>now()],
            ['code' => 'S020','name'=>'CANCELLED','created_at'=>now(),'updated_at'=>now()],
        ]);
    }
}
