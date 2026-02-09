<?php

namespace Database\Factories;

use App\Models\Image;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Image::class;
    public function definition(): array
    {
        return [
            'imageable_type' => null, // lo asignamos desde el seeder
            'imageable_id'   => null,
            'url'            => $this->faker->imageUrl(800, 600, 'food', true),
            'alt'            => $this->faker->sentence(3),
            'position'       => 0,
        ];
    }
}
