<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tracking', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shipment_id')
                ->constrained('shipments')
                ->cascadeOnDelete();

            $table->foreignId('status_id')
                ->constrained('shipment_statuses');

            $table->foreignId('branch_id')
                ->nullable()
                ->constrained('branches');

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('accounts');

            $table->enum('direction_flag', ['IN', 'OUT'])
                ->comment('Shipment moved IN or OUT of branch');

            $table->text('note')->nullable();

            $table->timestamp('updated_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking');
    }
};
