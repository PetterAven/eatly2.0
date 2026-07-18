<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'country'      => 'España', // Mapeado en español
            'state'        => $this->faker->state(),
            'city'         => $this->faker->city(),
            'address_line' => $this->faker->streetAddress(), // <-- Corregido
            'postal_code'  => $this->faker->numerify('#####'),
            'lat'          => $this->faker->latitude(40.0, 41.0), // <-- Corregido
            'lng'          => $this->faker->longitude(-4.0, -3.0), // <-- Corregido
        ];
    }
}