<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Image;
use App\Models\Item;
use App\Models\Level;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Levels base del sistema
        $adminLevel = Level::firstOrCreate(
            ['name' => 'admin'],
            ['description' => 'Administrador de la plataforma']
        );

        $ownerLevel = Level::firstOrCreate(
            ['name' => 'owner'],
            ['description' => 'Dueño de restaurante']
        );

        $customerLevel = Level::firstOrCreate(
            ['name' => 'customer'],
            ['description' => 'Cliente de la app']
        );

        // 2) Usuario admin fijo
        $admin = User::firstOrCreate(
            ['email' => 'admin@eatly.test'],
            [
                'level_id'          => $adminLevel->id,
                'name'              => 'Admin EATLY',
                'email_verified_at' => now(),
                'password'          => Hash::make('password'),
                'phone'             => '5512345678',
                'remember_token'    => Str::random(10),
            ]
        );

        // 3) Owners y customers de demo
        $owners = User::factory(3)->create([
            'level_id' => $ownerLevel->id,
        ]);

        $customers = User::factory(10)->create([
            'level_id' => $customerLevel->id,
        ]);

        // 4) Restaurantes, sucursales, categorías, items
        $allBranches = collect();
        $allItemsByBranch = [];

        foreach ($owners as $owner) {
            // 1–2 restaurantes por owner
            $restaurants = Restaurant::factory(rand(1, 2))->create([
                'owner_id' => $owner->id,
            ]);

            foreach ($restaurants as $restaurant) {

                // Imagen principal del restaurante
                $restaurant->images()->create([
                    'url'       => 'https://source.unsplash.com/800x600/?restaurant,' . $restaurant->id,
                    'alt'       => $restaurant->name,
                    'position'  => 0,
                    'created_at'=> now(),
                    'updated_at'=> now(),
                ]);

                // 1–3 sucursales por restaurante
                $branches = Branch::factory(rand(1, 3))->create([
                    'restaurant_id' => $restaurant->id,
                ]);

                foreach ($branches as $branch) {
                    $allBranches->push($branch);

                    // Imagen de sucursal
                    $branch->images()->create([
                        'url'       => 'https://source.unsplash.com/800x600/?food,' . $branch->id,
                        'alt'       => $branch->name,
                        'position'  => 0,
                        'created_at'=> now(),
                        'updated_at'=> now(),
                    ]);

                    // 3–5 categorías por sucursal
                    $categories = Category::factory(rand(3, 5))->create([
                        'branch_id' => $branch->id,
                    ]);

                    $allItemsByBranch[$branch->id] = collect();

                    foreach ($categories as $category) {
                        // 5–8 items por categoría
                        $items = Item::factory(rand(5, 8))->create([
                            'category_id' => $category->id,
                        ]);

                        // Imagen por item (opcional)
                        foreach ($items as $item) {
                            $item->images()->create([
                                'url'       => 'https://source.unsplash.com/800x600/?meal,' . $item->id,
                                'alt'       => $item->name,
                                'position'  => 0,
                                'created_at'=> now(),
                                'updated_at'=> now(),
                            ]);
                        }

                        $allItemsByBranch[$branch->id] = $allItemsByBranch[$branch->id]->merge($items);
                    }
                }
            }
        }

        // 5) Carts, Orders y Payments de ejemplo (por algunos customers)
        if ($allBranches->isNotEmpty()) {

            foreach ($customers as $customer) {
                // Elegimos una sucursal al azar con items
                $branch = $allBranches->random();
                $items  = $allItemsByBranch[$branch->id] ?? collect();

                if ($items->isEmpty()) {
                    continue;
                }

                // Creamos un carrito
                $cart = Cart::create([
                    'user_id'   => $customer->id,
                    'branch_id' => $branch->id,
                    'status'    => 'converted',
                    'subtotal'  => 0,
                    'discount'  => 0,
                    'total'     => 0,
                ]);

                $subtotal = 0;

                // 1–3 items en el carrito
                foreach ($items->random(rand(1, 3)) as $item) {
                    $quantity   = rand(1, 3);
                    $unitPrice  = $item->price;
                    $lineTotal  = $quantity * $unitPrice;

                    CartItem::create([
                        'cart_id'    => $cart->id,
                        'item_id'    => $item->id,
                        'quantity'   => $quantity,
                        'unit_price' => $unitPrice,
                        'notes'      => null,
                    ]);

                    $subtotal += $lineTotal;
                }

                $discount = 0;
                $total    = $subtotal - $discount;

                $cart->update([
                    'subtotal' => $subtotal,
                    'discount' => $discount,
                    'total'    => $total,
                ]);

                // Orden a partir del carrito
                $order = Order::create([
                    'user_id'        => $customer->id,
                    'branch_id'      => $branch->id,
                    'cart_id'        => $cart->id,
                    'code'           => strtoupper(Str::random(8)),
                    'status'         => 'confirmed',
                    'mode'           => 'pickup',
                    'scheduled_at'   => now()->addMinutes(rand(20, 40)),
                    'payment_status' => 'paid',
                    'subtotal'       => $subtotal,
                    'discount'       => $discount,
                    'total'          => $total,
                ]);

                // Items de la orden (copiamos del carrito)
                foreach ($cart->items as $cartItem) {
                    OrderItem::create([
                        'order_id'   => $order->id,
                        'item_id'    => $cartItem->item_id,
                        'quantity'   => $cartItem->quantity,
                        'unit_price' => $cartItem->unit_price,
                        'notes'      => $cartItem->notes,
                    ]);
                }

                // Payment
                Payment::create([
                    'order_id'          => $order->id,
                    'user_id'           => $customer->id,
                    'provider'          => 'cash',
                    'provider_reference'=> null,
                    'method'            => 'cash',
                    'amount'            => $total,
                    'status'            => 'completed',
                    'paid_at'           => now(),
                    'raw_payload'       => json_encode(['demo' => true]),
                ]);
            }
        }
    }
}
