<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trackings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shipment_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('status_id')
                ->constrained('shipment_statuses');

            // Chi nhánh đi
            $table->foreignId('from_branch_id')
                ->nullable()
                ->constrained('branches');

            // Chi nhánh đến
            $table->foreignId('to_branch_id')
                ->nullable()
                ->constrained('branches');

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('accounts')
                ->nullOnDelete();

            $table->enum('direction_flag', ['IN', 'OUT'])
                ->comment('IN = arrived at branch, OUT = departed from branch');

            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking');
    }
};
