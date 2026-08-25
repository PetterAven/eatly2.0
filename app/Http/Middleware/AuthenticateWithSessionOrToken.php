<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Authentication bridge for Phase 3 routes.
 *
 * It gives an explicit Sanctum bearer token precedence, then falls back to
 * the existing web session.
 * Existing routes deliberately continue using `auth` until Phase 3 assigns
 * this alias to the routes that must support independent browser tabs.
 */
class AuthenticateWithSessionOrToken
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->bearerToken() && Auth::guard('sanctum')->check()) {
            Auth::shouldUse('sanctum');

            return $next($request);
        }

        if (Auth::guard('web')->check()) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            abort(401, 'Unauthenticated.');
        }

        return redirect()->guest(route('login'));
    }
}
