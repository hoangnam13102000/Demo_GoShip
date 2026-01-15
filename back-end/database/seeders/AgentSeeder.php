<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AgentSeeder extends Seeder
{
    public function run(): void
    {
        $agents = DB::table('accounts')->where('role', 'AGENT')->get();

        // Danh sách tên người Việt
        $fullNames = [
            'Nguyễn Văn Bình',
            'Trần Thị Cẩm',
            'Lê Hoàng Nam',
            'Phạm Quốc Huy',
            'Võ Thị Thu Hà',
            'Đặng Minh Tuấn',
            'Bùi Ngọc Anh',
            'Hoàng Thanh Sơn',
            'Đỗ Thị Mỹ Linh',
            'Nguyễn Đức Long',
        ];

        $i = 0;

        foreach ($agents as $agent) {
            DB::table('agents')->insert([
                'account_id' => $agent->id,
                'branch_id'  => ($i % 3) + 1, // chia agent cho 3 chi nhánh
                'full_name'  => $fullNames[$i % count($fullNames)],
                'address'    => 'Chi nhánh ' . (($i % 3) + 1) . ', TP. Hồ Chí Minh',
                'phone'      => '0901' . str_pad($agent->id, 6, '0', STR_PAD_LEFT),
                'status'     => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $i++;
        }
    }
}
