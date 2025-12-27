<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();

            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('agent_id')->nullable()->constrained('agents')->onDelete('set null');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('current_status_id')->constrained('shipment_statuses')->onDelete('cascade');

            $table->string('sender_name');
            $table->string('sender_address');
            $table->string('sender_phone')->nullable();

            $table->string('receiver_name');
            $table->string('receiver_address');
            $table->string('receiver_phone')->nullable();

            $table->enum('shipment_type', ['DOCUMENT', 'PACKAGE', 'EXPRESS'])->default('PACKAGE');
            $table->decimal('weight', 8, 2);
            $table->decimal('charge', 10, 2)->default(0);

            $table->date('expected_delivery_date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
