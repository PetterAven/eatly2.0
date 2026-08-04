<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if ($user->isAdmin()) {
            return $next($request);
        }

        $allowed = match ($role) {
            'driver' => $user->isDriver(),
            'merchant', 'vendor', 'restaurante' => $user->isMerchant(),
            'client' => $user->isClient(),
            default => $user->role === $role,
        };

        if (! $allowed) {
            abort(403, 'Acceso no autorizado.');
        }

        return $next($request);
    }
}
