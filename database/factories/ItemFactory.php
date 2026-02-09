<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Item::class;

    public function definition(): array
    {
        return [
            'category_id'               => Category::factory(),
            'name'                      => $this->faker->words(3, true),
            'description'               => $this->faker->sentence(12),
            'price'                     => $this->faker->randomFloat(2, 40, 250),
            'preparation_time_minutes'  => $this->faker->numberBetween(5, 30),
            'is_available'              => true,
        ];
    }
}
