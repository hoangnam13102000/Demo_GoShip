<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shipment_services', function (Blueprint $table) {
            $table->id();

            $table->string('code')->unique();           // DOCUMENT, PACKAGE, EXPRESS
            $table->string('name');                     // Tài liệu, Kiện hàng, Express
            $table->text('description')->nullable();

            $table->decimal('base_price', 12, 2);
            $table->decimal('max_weight', 8, 2)->nullable();

            $table->string('estimated_delivery_time');  // 24h, 2-3 days, 12h
            $table->json('features')->nullable();       // JSON list feature

            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_services');
    }
};
