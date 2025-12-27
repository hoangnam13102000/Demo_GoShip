<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy tất cả bill_id
        $billIds = DB::table('bills')->pluck('id')->toArray();

        $payments = [];

        foreach ($billIds as $billId) {
            // Lấy thông tin total_amount từ bill
            $bill = DB::table('bills')->where('id', $billId)->first();

            $payments[] = [
                'bill_id'        => $billId,
                'method'         => ['CASH', 'MOMO', 'VNPAY'][array_rand(['CASH', 'MOMO', 'VNPAY'])],
                'transaction_id' => 'TXN' . rand(100000, 999999),
                'amount'         => $bill->total_amount,
                'status'         => ['SUCCESS', 'FAILED'][array_rand(['SUCCESS', 'FAILED'])],
                'paid_at'        => now(),
                'created_at'     => now(),
                'updated_at'     => now(),
            ];
        }

        DB::table('payments')->insert($payments);
    }
}
