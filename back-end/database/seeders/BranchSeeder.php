<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('branches')->insert([
            [
                'name'       => 'Chi nhánh TP. Hồ Chí Minh',
                'city'       => 'TP. Hồ Chí Minh',
                'address'    => '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
                'phone'      => '02838220001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Chi nhánh Hà Nội',
                'city'       => 'Hà Nội',
                'address'    => '45 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
                'phone'      => '02439430002',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Chi nhánh Trung chuyển ',
                'city'       => 'HUB',
                'address'    => '78 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
                'phone'      => '02363840003',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
