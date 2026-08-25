<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SessionOrTokenAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware('session-or-token')->get('/_test/session-or-token', function () {
            return response()->json(['user_id' => request()->user()->id]);
        });
    }

    public function test_it_accepts_the_existing_web_session(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/_test/session-or-token')
            ->assertOk()
            ->assertJsonPath('user_id', $user->id);
    }

    public function test_it_accepts_a_sanctum_bearer_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('web-tab')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/_test/session-or-token')
            ->assertOk()
            ->assertJsonPath('user_id', $user->id);
    }

    public function test_a_bearer_token_takes_priority_over_a_shared_web_session(): void
    {
        $tokenUser = User::factory()->create();
        $cookieUser = User::factory()->create();
        $token = $tokenUser->createToken('web-tab')->plainTextToken;

        $this->actingAs($cookieUser)
            ->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/_test/session-or-token')
            ->assertOk()
            ->assertJsonPath('user_id', $tokenUser->id);
    }

    public function test_historial_route_accepts_bearer_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('web-tab')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->get(route('orders.history'))
            ->assertOk();
    }
}
