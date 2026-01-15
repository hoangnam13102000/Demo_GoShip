<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $accounts = [];

        // ADMIN
        $accounts[] = [
            'email'      => 'admin@courier.com',
            'password'   => Hash::make('password123'),
            'role'       => 'ADMIN',
            'status'     => 'ACTIVE',
            'created_at' => $now,
            'updated_at' => $now,
        ];

        // USERS
        for ($i = 1; $i <= 2; $i++) {
            $accounts[] = [
                'email'      => "user{$i}@courier.com",
                'password'   => Hash::make('password123'),
                'role'       => 'USER',
                'status'     => 'ACTIVE',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // AGENTS
        for ($i = 1; $i <= 17; $i++) {
            $accounts[] = [
                'email'      => "agent{$i}@courier.com",
                'password'   => Hash::make('password123'),
                'role'       => 'AGENT',
                'status'     => 'ACTIVE',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('accounts')->insert($accounts);
    }
}
