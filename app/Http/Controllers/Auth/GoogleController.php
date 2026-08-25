<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        $requestedRole = request()->query('role');
        $allowedRoles = ['client', 'merchant', 'driver'];

        $with = [
            'prompt' => 'select_account consent',
        ];

        if ($requestedRole && in_array($requestedRole, $allowedRoles, true)) {
            $with['state'] = $requestedRole;
        }

        // Forzamos a Google a mostrar siempre la ventana de selección de cuenta y consentimiento.
        // Si no llegó un rol explícito (ej. login normal), no forzamos 'client' porque ese
        // overwrite rompe a usuarios existentes con merchant/driver ya registrados.
        return Socialite::driver('google')
            ->with($with)
            ->redirect();
    }

    public function callback()
    {
        return $this->handleGoogleCallback();
    }

    public function handleGoogleCallback()
    {
        try {
            // Intentamos obtener el usuario de Google (con stateless para evitar problemas de session state mismatch)
            $googleUser = Socialite::driver('google')->stateless()->user();

            if (! $googleUser || ! $googleUser->getEmail()) {
                return redirect()->route('login')->with('error', 'No se pudo obtener la información de tu cuenta de Google.');
            }

            // Limpiamos cualquier sesión previa para evitar mezclar cuentas
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();

            // Buscamos si el correo ya existe en la Base de Datos
            $user = User::where('email', $googleUser->getEmail())->first();

            $roleMap = [
                'client' => 1,
                'merchant' => 2,
                'driver' => 3,
            ];

            $resolvedRole = $this->resolveGoogleUserRole(request()->input('state'), $user);

            if ($user) {
                $updateData = [
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ];

                if ($resolvedRole) {
                    $updateData['role'] = $resolvedRole;
                    $updateData['level_id'] = $roleMap[$resolvedRole] ?? 1;
                }

                $user->update($updateData);
            } else {
                $role = $resolvedRole ?? 'client';
                $levelId = $roleMap[$role] ?? 1;

                $user = User::create([
                    'name' => $googleUser->getName() ?? 'Usuario Google',
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => $role,
                    'level_id' => $levelId,
                    'password' => bcrypt(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($user, true);
            request()->session()->regenerate();

            return redirect()->route($user->redirectRouteName());

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Google Auth Error: '.$e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            // En caso de error, redirigimos al login con mensaje flash explicativo
            return redirect()->route('login')->with('error', 'Ocurrió un error al autenticar con Google: '.$e->getMessage());
        }
    }

    private function resolveGoogleUserRole(?string $requestedRole, ?User $existingUser = null): ?string
    {
        $roleMap = [
            'client' => 1,
            'merchant' => 2,
            'driver' => 3,
        ];

        $resolvedRole = null;

        if ($requestedRole && array_key_exists($requestedRole, $roleMap)) {
            $resolvedRole = $requestedRole;
        } elseif ($existingUser && $existingUser->level_id) {
            $resolvedRole = match ((int) $existingUser->level_id) {
                2 => 'merchant',
                3 => 'driver',
                4 => 'admin',
                default => 'client',
            };
        } elseif ($existingUser && in_array($existingUser->role, ['merchant', 'driver', 'client', 'admin'], true)) {
            $resolvedRole = $existingUser->role;
        }

        return $resolvedRole;
    }
}
