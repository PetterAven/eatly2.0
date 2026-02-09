<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Level;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Level>
 */
class LevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Level::class;

    public function definition(): array
    {
        return [
            'name'        => $this->faker->unique()->randomElement([
                'admin', 'owner', 'customer',
            ]),
            'description' => $this->faker->sentence(),
        ];
    }
}
