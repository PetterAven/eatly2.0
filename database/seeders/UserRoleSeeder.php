<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Crear Estudiante (Client)
        User::updateOrCreate(
            ['email' => 'estudiante@upp.edu.mx'],
            [
                'name' => 'Pedro Alumno UPP',
                'password' => Hash::make('password'),
                'role' => 'client',
            ]
        );

        // 2. Crear Repartidor (Driver)
        User::updateOrCreate(
            ['email' => 'repartidor@upp.edu.mx'],
            [
                'name' => 'Juan Repartidor Veloz',
                'password' => Hash::make('password'),
                'role' => 'driver',
            ]
        );

        // 3. Crear Cafetería/Comercio (Merchant)
        User::updateOrCreate(
            ['email' => 'cafeteria@upp.edu.mx'],
            [
                'name' => 'Concesionario Central',
                'password' => Hash::make('password'),
                'role' => 'merchant',
            ]
        );
    }
}
