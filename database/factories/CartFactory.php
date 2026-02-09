<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Branch;
use App\Models\Cart;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Cart::class;
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 80, 400);
        $discount = $this->faker->randomFloat(2, 0, 80);
        $total    = max($subtotal - $discount, 0);

        return [
            'user_id'  => User::factory(),
            'branch_id'=> Branch::factory(),
            'status'   => $this->faker->randomElement(['open', 'converted', 'abandoned']),
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total'    => $total,
        ];
    }
}
