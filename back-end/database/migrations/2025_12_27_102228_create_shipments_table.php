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

                  $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
                  $table->foreignId('agent_id')->nullable()->constrained()->nullOnDelete();

                  // ✅ ĐÚNG ERD
                  $table->foreignId('current_branch_id')
                        ->constrained('branches')
                        ->cascadeOnDelete();

                  $table->foreignId('current_status_id')
                        ->constrained('shipment_statuses');

                  // Sender
                  $table->string('sender_name');
                  $table->string('sender_phone');
                  $table->string('sender_address');
                  $table->string('sender_city');

                  // Receiver
                  $table->string('receiver_name');
                  $table->string('receiver_phone');
                  $table->string('receiver_address');
                  $table->string('receiver_city');

                  // Service
                  $table->string('shipment_service_code');
                  $table->foreign('shipment_service_code')
                        ->references('code')
                        ->on('shipment_services');

                  $table->decimal('weight', 8, 2);
                  $table->decimal('charge', 10, 2);
                  $table->date('expected_delivery_date')->nullable();

                 
                  $table->timestamps();
            });
      }

      public function down(): void
      {
            Schema::dropIfExists('shipments');
      }
};
