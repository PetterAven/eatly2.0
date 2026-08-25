<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained('orders')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('provider')->default('cash'); // stripe, mercado_pago, cash...
            $table->string('provider_reference')->nullable();
            $table->string('method')->nullable(); // card, cash, etc.

            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending'); // pending, approved, declined, refunded

            $table->dateTime('paid_at')->nullable();

            $table->json('raw_payload')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
