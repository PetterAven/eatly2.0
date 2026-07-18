<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Image;
use App\Models\Restaurant;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Creamos un usuario dueño de prueba para cumplir con la restricción de 'owner_id'
        $owner = User::create([
            'name' => 'Admin Eatly',
            'email' => 'admin.eatly@upp.edu.mx',
            'email_verified_at' => now(),
            'password' => bcrypt('password'), // Contraseña genérica por defecto
            'remember_token' => Str::random(10),
        ]);

        // 📌 Coordenadas de Referencia de la UPP: Latitud: 19.9625, Longitud: -98.6834
        $localesReales = [
            [
                'restaurant_name' => 'La Cigarra',
                'branch_name' => 'Sucursal Zempoala',
                'city' => 'Zempoala',
                'address' => 'Carr. Pachuca - Cd. Sahagún Km 19.5',
                'phone' => '7711234567',
                'lat' => 19.9642,
                'lng' => -98.6815,
                'image' => 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=640'
            ],
            [
                'restaurant_name' => 'Potros Bar & Snacks',
                'branch_name' => 'Frente a Campus UPP',
                'city' => 'Zempoala',
                'address' => 'Acceso Principal UPP, Ex-Hacienda de Santa Bárbara',
                'phone' => '7719876543',
                'lat' => 19.9610,
                'lng' => -98.6850,
                'image' => 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640'
            ],
            [
                'restaurant_name' => 'Cocina Económica LUNA',
                'branch_name' => 'Sucursal Rancho Luna',
                'city' => 'Zempoala',
                'address' => 'Calle Estrella #26, Comunidad Santa Bárbara',
                'phone' => '7721064950',
                'lat' => 19.9598,
                'lng' => -98.6821,
                'image' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=640'
            ],
            [
                'restaurant_name' => 'Cafetería Universitaria',
                'branch_name' => 'Estación Zempoala Snacks',
                'city' => 'Zempoala',
                'address' => 'Interior Campus UPP, Edificio de Servicios',
                'phone' => '7715477510',
                'lat' => 19.9625,
                'lng' => -98.6834,
                'image' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640'
            ]
        ];

        foreach ($localesReales as $local) {
            
            // 2. Creamos el restaurante asignando obligatoriamente el 'owner_id' y los campos del fillable
            $restaurant = Restaurant::create([
                'owner_id'    => $owner->id,
                'name'        => $local['restaurant_name'],
                'description' => 'Servicio de alimentos de la zona universitaria UPP.',
                'phone'       => $local['phone'],
                'email'       => strtolower(str_replace(' ', '', $local['restaurant_name'])) . '@upp.edu.mx'
            ]);

            // 3. Ubicación con coordenadas para calcular distancias
            $location = Location::create([
                'country'      => 'México',
                'state'        => 'Hidalgo',
                'city'         => $local['city'],
                'address_line' => $local['address'],
                'postal_code'  => '43830',
                'lat'          => $local['lat'],
                'lng'          => $local['lng']
            ]);

            // 4. Sucursal vinculada
            $branch = Branch::create([
                'restaurant_id'     => $restaurant->id,
                'location_id'       => $location->id,
                'name'              => $local['branch_name'],
                'phone'             => $local['phone'],
                'capacity_per_slot' => rand(25, 60),
                'opening_hours'     => ['open' => '08:00', 'close' => '19:00'],
                'is_active'         => true 
            ]);

            // 5. Imagen polimórfica
            Image::create([
                'imageable_id'   => $branch->id,
                'imageable_type' => Branch::class,
                'url'            => $local['image']
            ]);
        }
    }
}