<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('accounts')->insert([
            [
                'email' => 'admin@courier.com',
                'password' => Hash::make('password123'),
                'role' => 'ADMIN',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'agent1@courier.com',
                'password' => Hash::make('password123'),
                'role' => 'AGENT',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'agent2@courier.com',
                'password' => Hash::make('password123'),
                'role' => 'AGENT',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'user1@courier.com',
                'password' => Hash::make('password123'),
                'role' => 'USER',
                'status' => 'ACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'user2@courier.com',
                'password' => Hash::make('password123'),
                'role' => 'USER',
                'status' => 'INACTIVE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
