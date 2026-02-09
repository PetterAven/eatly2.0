<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Branch;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Str;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Order::class;
    public function definition(): array
    {
         $subtotal = $this->faker->randomFloat(2, 80, 400);
        $discount = $this->faker->randomFloat(2, 0, 80);
        $total    = max($subtotal - $discount, 0);

        return [
            'user_id'        => User::factory(),
            'branch_id'      => Branch::factory(),
            'cart_id'        => Cart::factory(),
            'code'           => strtoupper(Str::random(8)),
            'status'         => $this->faker->randomElement([
                'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled',
            ]),
            'mode'           => $this->faker->randomElement(['pickup', 'dine_in']),
            'scheduled_at'   => $this->faker->optional()->dateTimeBetween('now', '+2 days'),
            'payment_status' => $this->faker->randomElement(['unpaid', 'paid', 'refunded']),
            'subtotal'       => $subtotal,
            'discount'       => $discount,
            'total'          => $total,
        ];
    }
}
