<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class EatlyCampusSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Obtener o crear un usuario dueño/administrador para asociar al restaurante
        $owner = User::first();
        if (!$owner) {
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
            if (!$locationExiste) {
                $locationData = ['id' => 1, 'created_at' => now(), 'updated_at' => now()];
                
                if (Schema::hasColumn('locations', 'name')) {
                    $locationData['name'] = 'Campus UPP';
                }
                
                DB::table('locations')->insert($locationData);
            }
        } catch (\Exception $e) {
            DB::table('locations')->insertOrIgnore(['id' => 1]);
        }

        // 3. Crear el restaurante principal en la tabla restaurants si no existe
        $restaurantExiste = DB::table('restaurants')->where('id', 1)->exists();
        if (!$restaurantExiste) {
            $restaurantData = [
                'id' => 1,
                'owner_id' => $ownerId,
                'created_at' => now(),
                'updated_at' => now()
            ];

            if (Schema::hasColumn('restaurants', 'name')) {
                $restaurantData['name'] = 'Eatly Eats Campus UPP';
            }
            if (Schema::hasColumn('restaurants', 'description')) {
                $restaurantData['description'] = 'Servicios de alimentación dentro del campus universitario';
            }
            if (Schema::hasColumn('restaurants', 'phone')) {
                $restaurantData['phone'] = '7710000000';
            }
            if (Schema::hasColumn('restaurants', 'email')) {
                $restaurantData['email'] = 'cafeteria@upp.edu.mx';
            }

            DB::table('restaurants')->insert($restaurantData);
        }

        // 4. Crear los 5 locales (branches) correspondientes al menú de React
        $locales = [
            ['id' => 1, 'name' => 'Cafetería Central UPP'],
            ['id' => 2, 'name' => 'The Potro Burger'],
            ['id' => 3, 'name' => 'Antojitos Los Pasillos'],
            ['id' => 4, 'name' => 'El Sultán Snack Bar'],
            ['id' => 5, 'name' => 'Bebidas & Co. Campus'],
        ];

        foreach ($locales as $local) {
            $branchData = [
                'restaurant_id' => 1,
                'location_id' => 1,
                'updated_at' => now()
            ];

            if (Schema::hasColumn('branches', 'name')) {
                $branchData['name'] = $local['name'];
            }
            if (Schema::hasColumn('branches', 'phone')) {
                $branchData['phone'] = '7710000000';
            }
            if (Schema::hasColumn('branches', 'capacity_per_slot')) {
                $branchData['capacity_per_slot'] = 50;
            }
            if (Schema::hasColumn('branches', 'opening_hours')) {
                $branchData['opening_hours'] = '08:00 - 18:00';
            }
            if (Schema::hasColumn('branches', 'is_active')) {
                $branchData['is_active'] = true;
            }

            DB::table('branches')->updateOrInsert(
                ['id' => $local['id']],
                array_merge($branchData, ['created_at' => now()])
            );
        }

        // 5. Crear categorías de comida asociándolas obligatoriamente a un local existente
        $categories = [
            ['id' => 1, 'name' => 'Comida', 'branch_id' => 1], // Asignado a Cafetería Central UPP
            ['id' => 2, 'name' => 'Snacks', 'branch_id' => 2], // Asignado a The Potro Burger
            ['id' => 3, 'name' => 'Bebidas', 'branch_id' => 5], // Asignado a Bebidas & Co. Campus
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

        // 6. Crear los 7 platillos con su respectiva relación de categoría
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
                'updated_at' => now()
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