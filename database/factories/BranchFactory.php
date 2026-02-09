<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Location;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Branch>
 */
class BranchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Branch::class;
    public function definition(): array
    {
        return [
            'restaurant_id'     => Restaurant::factory(),
            'location_id'       => Location::factory(),
            'name'              => $this->faker->streetName(),
            'phone'             => $this->faker->numerify('55########'),
            'capacity_per_slot' => $this->faker->numberBetween(5, 25),
            'opening_hours'     => json_encode([
                'mon_fri' => ['09:00', '22:00'],
                'sat'     => ['10:00', '23:00'],
                'sun'     => ['10:00', '21:00'],
            ]),
            'is_active'         => true,
        ];
    }
}
