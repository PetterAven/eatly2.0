<?php

namespace Database\Factories;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Restaurant>
 */
class RestaurantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Restaurant::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::factory(), // owner del restaurante
            'name' => $this->faker->company().' '.$this->faker->randomElement(['Restaurante', 'Bistro', 'Café', 'Gastronomía']),
            'description' => $this->faker->sentence(12),
            'phone' => $this->faker->numerify('55########'),
            'email' => $this->faker->unique()->companyEmail(),
        ];
    }
}
