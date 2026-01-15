<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('accounts')->where('role', 'USER')->get();

        $fullNames = [
            'Nguyễn Văn An',
            'Trần Thị Bích',
            'Lê Minh Quân',
            'Phạm Ngọc Lan',
            'Hoàng Đức Thắng',
            'Võ Thị Mai',
            'Đặng Quốc Huy',
            'Bùi Thanh Tâm',
        ];

        $i = 0;

        foreach ($users as $user) {
            DB::table('customers')->insert([
                'account_id' => $user->id,
                'full_name'  => $fullNames[$i % count($fullNames)],
                'phone'      => '0903' . str_pad($user->id, 6, '0', STR_PAD_LEFT),
                'address'    => '123 Nguyễn Trãi, Quận 1, Tp. Hồ Chí Minh',
            ]);

            $i++;
        }
    }
}
