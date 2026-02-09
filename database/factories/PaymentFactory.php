<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Payment::class;

    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 80, 400);
        $status = $this->faker->randomElement(['pending', 'completed', 'failed', 'refunded']);

        return [
            'order_id'          => Order::factory(),
            'user_id'           => User::factory(),
            'provider'          => $this->faker->randomElement(['cash', 'mercado_pago', 'paypal']),
            'provider_reference'=> $this->faker->optional()->uuid(),
            'method'            => $this->faker->randomElement(['cash', 'card', 'online']),
            'amount'            => $amount,
            'status'            => $status,
            'paid_at'           => in_array($status, ['completed', 'refunded'])
                                    ? $this->faker->dateTimeBetween('-1 day', 'now')
                                    : null,
            'raw_payload'       => json_encode(['demo' => true]),
        ];
    }
}
