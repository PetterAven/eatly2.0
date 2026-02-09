<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Location;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Location::class;
    public function definition(): array
    {
         return [
            'country'      => 'México',
            'state'        => $this->faker->state(),
            'city'         => $this->faker->city(),
            'address_line' => $this->faker->streetAddress(),
            'postal_code'  => $this->faker->postcode(),
            'lat'          => $this->faker->latitude(19.0, 21.0),
            'lng'          => $this->faker->longitude(-100.0, -98.0),
        ];
    }
}
