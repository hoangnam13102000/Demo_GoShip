<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shipment_id')
                ->constrained()
                ->cascadeOnDelete()
                ->index();

            $table->decimal('base_amount', 10, 2)->comment('Phí cơ bản');
            $table->decimal('weight_fee', 10, 2)->default(0)->comment('Phí trọng lượng');
            $table->decimal('tax', 10, 2)->default(0)->comment('Thuế VAT');
            $table->decimal('total_amount', 10, 2)->comment('Tổng tiền');

            $table->enum('status', ['PAID', 'UNPAID'])->default('UNPAID');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
