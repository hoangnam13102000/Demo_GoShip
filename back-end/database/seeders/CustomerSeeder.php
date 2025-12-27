<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('customers')->insert([
            [
                'account_id' => 4, // user1@courier.com
                'full_name' => 'Nguyễn Văn A',
                'phone' => '09870001',
                'address' => '123 Đường Lê Lợi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'account_id' => 5, // user2@courier.com
                'full_name' => 'Trần Thị B',
                'phone' => '09870002',
                'address' => '456 Đường Nguyễn Huệ',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
