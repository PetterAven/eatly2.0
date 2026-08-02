<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CartItem>
 */
class CartItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = CartItem::class;

    public function definition(): array
    {
        $item = Item::factory()->create();
        $quantity = $this->faker->numberBetween(1, 4);
        $unitPrice = $item->price;

        return [
            'cart_id' => Cart::factory(),
            'item_id' => $item->id,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'notes' => $this->faker->optional()->sentence(6),
        ];
    }
}
