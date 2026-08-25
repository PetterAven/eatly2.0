<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed only the application configuration.
     *
     * Restaurants, branches, menu items and their images must be created by
     * their respective users through the application; no fictitious venues are
     * installed in a fresh or production database.
     */
    public function run(): void
    {
        $this->call(LevelSeeder::class);
    }
}
