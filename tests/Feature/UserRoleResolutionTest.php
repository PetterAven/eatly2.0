<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Tests\TestCase;

class UserRoleResolutionTest extends TestCase
{
    use RefreshDatabase;

    public function test_role_is_not_overwritten_by_level_id_when_the_role_is_explicitly_set(): void
    {
        $merchant = User::factory()->create([
            'role' => 'merchant',
            'level_id' => 1,
        ]);

        $driver = User::factory()->create([
            'role' => 'driver',
            'level_id' => 1,
        ]);

        $this->assertSame('merchant', $merchant->role);
        $this->assertSame('driver', $driver->role);
        $this->assertTrue($merchant->isMerchant());
        $this->assertTrue($driver->isDriver());
    }

    public function test_google_callback_preserves_the_selected_driver_role_instead_of_defaulting_to_client(): void
    {
        $googleUser = \Laravel\Socialite\Two\User::fake([
            'id' => 'google-id-123',
            'email' => 'driver@example.com',
            'name' => 'Driver User',
            'avatar' => 'https://example.com/avatar.png',
        ]);

        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('stateless')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($googleUser);

        $this->get('/auth/google/callback?state=driver');

        $user = User::where('email', 'driver@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('driver', $user->role);
        $this->assertSame(3, $user->level_id);
    }

    public function test_google_callback_preserves_the_selected_merchant_role_instead_of_defaulting_to_client(): void
    {
        $googleUser = \Laravel\Socialite\Two\User::fake([
            'id' => 'google-id-789',
            'email' => 'merchant@example.com',
            'name' => 'Merchant User',
            'avatar' => 'https://example.com/avatar3.png',
        ]);

        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('stateless')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($googleUser);

        $this->get('/auth/google/callback?state=merchant');

        $user = User::where('email', 'merchant@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('merchant', $user->role);
        $this->assertSame(2, $user->level_id);
    }

    public function test_google_callback_uses_existing_level_id_when_state_is_absent_to_avoid_client_default(): void
    {
        $user = User::factory()->create([
            'email' => 'existing-driver@example.com',
            'role' => 'client',
            'level_id' => 3,
        ]);

        $googleUser = \Laravel\Socialite\Two\User::fake([
            'id' => 'google-id-456',
            'email' => 'existing-driver@example.com',
            'name' => 'Existing Driver',
            'avatar' => 'https://example.com/avatar2.png',
        ]);

        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('stateless')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($googleUser);

        $this->get('/auth/google/callback');

        $user->refresh();

        $this->assertSame('driver', $user->role);
        $this->assertSame(3, $user->level_id);
    }

    public function test_google_callback_defaults_to_client_for_new_user_when_state_is_absent(): void
    {
        $googleUser = \Laravel\Socialite\Two\User::fake([
            'id' => 'google-id-999',
            'email' => 'newclient@example.com',
            'name' => 'New Client',
            'avatar' => 'https://example.com/avatar4.png',
        ]);

        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('stateless')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($googleUser);

        $this->get('/auth/google/callback');

        $user = User::where('email', 'newclient@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('client', $user->role);
        $this->assertSame(1, $user->level_id);
    }
}

