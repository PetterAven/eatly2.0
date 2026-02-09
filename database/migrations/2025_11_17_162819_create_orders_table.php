<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->foreignId('branch_id')
                  ->constrained('branches')
                  ->cascadeOnDelete();

            $table->foreignId('cart_id')
                  ->nullable()
                  ->constrained('carts')
                  ->nullOnDelete();

            $table->string('code')->unique();

            $table->string('status')->default('pending'); // pending, confirmed, ...
            $table->string('mode')->default('pickup');    // pickup, dine_in

            $table->dateTime('scheduled_at')->nullable();

            $table->string('payment_status')->default('unpaid'); // unpaid, paid, refunded

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

