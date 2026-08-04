<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EatlyCampusSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Obtener o crear un usuario dueño/administrador para asociar al restaurante
        $owner = User::first();
        if (! $owner) {
            $ownerId = DB::table('users')->insertGetId([
                'name' => 'Administrador Campus UPP',
                'email' => 'admin@upp.edu.mx',
                'password' => bcrypt('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $ownerId = $owner->id;
        }

        // 2. Crear una ubicación de respaldo en la tabla locations de forma dinámica
        try {
            $locationExiste = DB::table('locations')->where('id', 1)->exists();
            if (! $locationExiste) {
                $locationData = ['id' => 1, 'created_at' => now(), 'updated_at' => now()];

                if (Schema::hasColumn('locations', 'name')) {
                    $locationData['name'] = 'Campus UPP';
                }
                if (Schema::hasColumn('locations', 'address_line')) {
                    $locationData['address_line'] = 'Edificio de Servicios Estudiantiles, UPP';
                }

                DB::table('locations')->insert($locationData);
            }
        } catch (\Exception $e) {
            DB::table('locations')->insertOrIgnore(['id' => 1]);
        }

        // 3. Crear el restaurante principal en la tabla restaurants si no existe
        $restaurantExiste = DB::table('restaurants')->where('id', 1)->exists();
        if (! $restaurantExiste) {
            $restaurantData = [
                'id' => 1,
                'owner_id' => $ownerId,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (Schema::hasColumn('restaurants', 'name')) {
                $restaurantData['name'] = 'Eatly Eats Campus UPP';
            }
            if (Schema::hasColumn('restaurants', 'description')) {
                $restaurantData['description'] = 'Servicios de alimentación dentro del campus universitario';
            }
            if (Schema::hasColumn('restaurants', 'phone')) {
                $restaurantData['phone'] = '771 555 1001';
            }
            if (Schema::hasColumn('restaurants', 'email')) {
                $restaurantData['email'] = 'cafeteria@upp.edu.mx';
            }
            if (Schema::hasColumn('restaurants', 'address')) {
                $restaurantData['address'] = 'Campus UPP - Jagüey de Téllez';
            }

            DB::table('restaurants')->insert($restaurantData);
        }

        // 4. Crear los locales (branches) correspondientes (8 branches para probar rotación > 6)
        $locales = [
            ['id' => 1, 'name' => 'Cafetería Central UPP', 'phone' => '771 555 1001', 'opening_hours' => 'Lunes a Viernes - 7:00 AM a 6:00 PM'],
            ['id' => 2, 'name' => 'The Potro Burger', 'phone' => '771 555 1002', 'opening_hours' => 'Lunes a Viernes - 11:00 AM a 5:00 PM'],
            ['id' => 3, 'name' => 'Antojos Los Pasillos', 'phone' => '771 555 1003', 'opening_hours' => 'Lunes a Sábado - 8:00 AM a 4:00 PM'],
            ['id' => 4, 'name' => 'El Sultán Snack Bar', 'phone' => '771 555 1004', 'opening_hours' => 'Lunes a Viernes - 9:00 AM a 7:00 PM'],
            ['id' => 5, 'name' => 'Bebidas & Co. Campus', 'phone' => '771 555 1005', 'opening_hours' => 'Lunes a Viernes - 8:00 AM a 6:00 PM'],
            ['id' => 6, 'name' => 'Tacos y Tortas El Ingeniero', 'phone' => '771 555 1006', 'opening_hours' => 'Lunes a Viernes - 8:30 AM a 4:30 PM'],
            ['id' => 7, 'name' => 'Pizzas & Paninis Rectoría', 'phone' => '771 555 1007', 'opening_hours' => 'Lunes a Viernes - 10:00 AM a 5:00 PM'],
            ['id' => 8, 'name' => 'Frutas & Licuados Fit UPP', 'phone' => '771 555 1008', 'opening_hours' => 'Lunes a Sábado - 7:30 AM a 3:00 PM'],
        ];

        foreach ($locales as $local) {
            $branchData = [
                'restaurant_id' => 1,
                'location_id' => 1,
                'updated_at' => now(),
            ];

            if (Schema::hasColumn('branches', 'name')) {
                $branchData['name'] = $local['name'];
            }
            if (Schema::hasColumn('branches', 'phone')) {
                $branchData['phone'] = $local['phone'];
            }
            if (Schema::hasColumn('branches', 'capacity_per_slot')) {
                $branchData['capacity_per_slot'] = 50;
            }
            if (Schema::hasColumn('branches', 'opening_hours')) {
                $branchData['opening_hours'] = $local['opening_hours'];
            }
            if (Schema::hasColumn('branches', 'is_active')) {
                $branchData['is_active'] = true;
            }

            DB::table('branches')->updateOrInsert(
                ['id' => $local['id']],
                array_merge($branchData, ['created_at' => now()])
            );
        }

        // 5. Seed real food images for branches
        $imagesByBranch = [
            1 => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
            2 => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
            3 => 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
            4 => 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
            5 => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
            6 => 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
            7 => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
            8 => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        ];

        foreach ($imagesByBranch as $branchId => $imgUrl) {
            DB::table('images')->updateOrInsert(
                ['imageable_type' => \App\Models\Branch::class, 'imageable_id' => $branchId],
                ['url' => $imgUrl, 'alt' => 'Cafetería UPP', 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // 6. Crear categorías de comida
        $categories = [
            ['id' => 1, 'name' => 'Comida', 'branch_id' => 1],
            ['id' => 2, 'name' => 'Snacks', 'branch_id' => 2],
            ['id' => 3, 'name' => 'Bebidas', 'branch_id' => 5],
        ];

        foreach ($categories as $cat) {
            $catData = ['updated_at' => now()];

            if (Schema::hasColumn('categories', 'name')) {
                $catData['name'] = $cat['name'];
            }
            if (Schema::hasColumn('categories', 'branch_id')) {
                $catData['branch_id'] = $cat['branch_id'];
            }

            DB::table('categories')->updateOrInsert(
                ['id' => $cat['id']],
                array_merge($catData, ['created_at' => now()])
            );
        }

        // 7. Crear platillos
        $platillos = [
            ['id' => 1, 'name' => 'Chilaquiles Tecolote con Pollo', 'price' => 65.00, 'branch_id' => 1, 'category_id' => 1, 'description' => 'Totopos crujientes, salsa verde viva, crema, queso de aro y pollo deshebrado.'],
            ['id' => 2, 'name' => 'Hamburguesa Monumental Potro', 'price' => 85.00, 'branch_id' => 2, 'category_id' => 1, 'description' => '150g de res, queso cheddar, tocino ahumado y papas a la francesa.'],
            ['id' => 3, 'name' => 'Tacos de Cecina con Papas (3 pzas)', 'price' => 55.00, 'branch_id' => 3, 'category_id' => 1, 'description' => 'Cecina de Yecapixtla en tortilla de maíz doble con papas fritas arriba.'],
            ['id' => 4, 'name' => 'Dorilocos Preparados con Todo', 'price' => 45.00, 'branch_id' => 4, 'category_id' => 2, 'description' => 'Doritos, jícama, pepino, cueritos, cacahuates, chamoy y salsa secreta.'],
            ['id' => 5, 'name' => 'Papas Locas con Queso y Tocino', 'price' => 40.00, 'branch_id' => 2, 'category_id' => 2, 'description' => 'Papas corte francés bañadas en queso cheddar líquido y tocino picado.'],
            ['id' => 6, 'name' => 'Frappé Oreo Supremo', 'price' => 45.00, 'branch_id' => 5, 'category_id' => 3, 'description' => 'Base cremosa de leche, galleta Oreo triturada, crema batida y chocolate.'],
            ['id' => 7, 'name' => 'Gomiboing Escarchado Fresa', 'price' => 35.00, 'branch_id' => 4, 'category_id' => 3, 'description' => 'Jugo Boing frío con hielos, escarchado con miguelito, chamoy y gomitas.'],
        ];

        foreach ($platillos as $platillo) {
            $itemData = [
                'updated_at' => now(),
            ];

            if (Schema::hasColumn('items', 'name')) {
                $itemData['name'] = $platillo['name'];
            }
            if (Schema::hasColumn('items', 'price')) {
                $itemData['price'] = $platillo['price'];
            }
            if (Schema::hasColumn('items', 'description')) {
                $itemData['description'] = $platillo['description'];
            }
            if (Schema::hasColumn('items', 'branch_id')) {
                $itemData['branch_id'] = $platillo['branch_id'];
            }
            if (Schema::hasColumn('items', 'restaurant_id')) {
                $itemData['restaurant_id'] = 1;
            }
            if (Schema::hasColumn('items', 'category_id')) {
                $itemData['category_id'] = $platillo['category_id'];
            }

            DB::table('items')->updateOrInsert(
                ['id' => $platillo['id']],
                array_merge($itemData, ['created_at' => now()])
            );
        }
    }
}
