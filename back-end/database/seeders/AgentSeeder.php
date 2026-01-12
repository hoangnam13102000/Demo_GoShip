<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AgentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('agents')->insert([
            [
                'account_id' => 2, // agent1@courier.com
                'branch_id'  => 1, 
                'full_name'  => 'Nguyễn Văn B',
                'address'    => '456 Đường Trần Hưng Đạo, Quận 1, TP.HCM',
                'phone' => '0901000100',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'account_id' => 3, // agent2@courier.com
                'branch_id'  => 2, 
                'full_name'  => 'Trần Thị C',
                'address'    => '789 Đường Nguyễn Huệ, Quận 3, TP.HCM',
                'phone' => '0901000102',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
