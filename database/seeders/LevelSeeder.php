<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Level::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'client',
                'description' => 'Cliente / Estudiante',
            ]
        );

        Level::updateOrCreate(
            ['id' => 2],
            [
                'name' => 'merchant',
                'description' => 'Comercio / Restaurante / Cafetería',
            ]
        );

        Level::updateOrCreate(
            ['id' => 3],
            [
                'name' => 'driver',
                'description' => 'Repartidor',
            ]
        );

        Level::updateOrCreate(
            ['id' => 4],
            [
                'name' => 'admin',
                'description' => 'Administrador del Sistema',
            ]
        );
    }
}
