<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Item;
use App\Models\Order;
use App\Models\OrderItem;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $item      = Item::factory()->create();
        $quantity  = $this->faker->numberBetween(1, 4);
        $unitPrice = $item->price;

        return [
            'order_id'   => Order::factory(),
            'item_id'    => $item->id,
            'quantity'   => $quantity,
            'unit_price' => $unitPrice,
            'notes'      => $this->faker->optional()->sentence(6),
        ];
    }
}
