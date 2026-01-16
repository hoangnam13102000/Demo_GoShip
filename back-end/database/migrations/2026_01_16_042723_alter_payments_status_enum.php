<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE payments
            MODIFY status ENUM('PENDING','SUCCESS','FAILED')
            DEFAULT 'PENDING'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE payments
            MODIFY status ENUM('SUCCESS','FAILED')
            DEFAULT 'SUCCESS'
        ");
    }
};
