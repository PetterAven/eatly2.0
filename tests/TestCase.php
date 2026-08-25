<?php

namespace Tests;

use Database\Seeders\LevelSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(LevelSeeder::class);
    }
}
