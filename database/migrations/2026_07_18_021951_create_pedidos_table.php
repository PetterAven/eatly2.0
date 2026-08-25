<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();

            // Relaciones de tres vías
            $table->foreignId('cliente_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vendedor_id')->nullable()->constrained('users')->onDelete('set null'); // Para los dulces
            $table->foreignId('repartidor_id')->nullable()->constrained('users')->onDelete('set null'); // Alumno en bici

            // Si el pedido es a un local fijo (ej. Los Cuñaditos)
            $table->unsignedBigInteger('local_id')->nullable();

            // Desglose Financiero Neto
            $table->decimal('subtotal_comida', 8, 2);
            $table->decimal('tarifa_envio', 8, 2)->default(12.00); // Tarifa fija del campus
            $table->decimal('total_pagado', 8, 2);

            // Control de Flujo Logístico según la arquitectura
            $table->enum('estatus', [
                'pendiente_pago',
                'en_preparacion',
                'esperando_repartidor',
                'en_camino',
                'entregado',
                'cancelado',
            ])->default('pendiente_pago');

            // Destino de entrega dentro de la UPP
            $table->string('destino_edificio');
            $table->string('destino_aula');

            $table->string('stripe_charge_id')->nullable(); // Para el Sandbox de pagos
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
