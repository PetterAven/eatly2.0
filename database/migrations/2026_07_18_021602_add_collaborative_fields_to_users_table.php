<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Flags para los nuevos roles dentro del campus
            $table->boolean('es_repartidor')->default(false)->after('email');
            $table->boolean('es_dulcero')->default(false)->after('es_repartidor');
            
            // Atributos de logística y entrega
            $table->enum('tipo_transporte', ['a_pie', 'bicicleta', 'patines_scooter', 'ninguno'])->default('ninguno')->after('es_dulcero');
            
            // Sistema transaccional interno (Monedero)
            $table->decimal('balance_monedero', 8, 2)->default(0.00)->after('tipo_transporte');
            
            // Ubicación dinámica en la UPP para los vendedores ambulantes (Dulceros)
            $table->string('ubicacion_edificio')->nullable()->after('balance_monedero');
            $table->string('ubicacion_aula')->nullable()->after('ubicacion_edificio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'es_repartidor', 
                'es_dulcero', 
                'tipo_transporte', 
                'balance_monedero', 
                'ubicacion_edificio', 
                'ubicacion_aula'
            ]);
        });
    }
};