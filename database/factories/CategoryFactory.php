<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'branch_id' => Branch::factory(),
            'name' => $this->faker->randomElement([
                'Hamburguesas', 'Pizzas', 'Tacos', 'Bebidas', 'Postres',
            ]),
            'description' => $this->faker->sentence(10),
            'position' => $this->faker->numberBetween(1, 10),
            'is_active' => true,
        ];
    }
}
