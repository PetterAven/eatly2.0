<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

/**
 * Keeps Fortify's normal browser redirect while making a per-tab token
 * available to the JSON login flow that will be enabled by the frontend.
 */
class TabTokenLoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $token = $request->user()->createToken('web-tab')->plainTextToken;

        if ($request->wantsJson()) {
            return response()->json([
                'two_factor' => false,
                'token' => $token,
                'redirect' => Fortify::redirects('login'),
            ]);
        }

        return redirect()->intended(Fortify::redirects('login'));
    }
}
