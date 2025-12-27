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
                'branch_id'  => 1, // ID chi nhánh tương ứng
                'contact_number' => '09010001',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'account_id' => 3, // agent2@courier.com
                'branch_id'  => 2, // ID chi nhánh tương ứng
                'contact_number' => '09010002',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
