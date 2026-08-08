<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

/**
 * Generates a per-tab token upon registration and redirects the user
 * to their role-specific dashboard (Client, Merchant, or Driver).
 */
class TabTokenRegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user() ?? Auth::user();
        $token = $user?->createToken('web-tab')?->plainTextToken;
        $redirectRoute = $user?->redirectRouteName() ?? 'dashboard';

        if ($request->wantsJson()) {
            return response()->json([
                'token' => $token,
                'redirect' => route($redirectRoute),
            ]);
        }

        return redirect()->intended(route($redirectRoute));
    }
}
