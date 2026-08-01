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
        // Forzamos a Google a mostrar siempre la ventana de selección de cuenta y consentimiento
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account consent'])
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
            
            if (!$googleUser || !$googleUser->getEmail()) {
                return redirect()->route('login')->with('error', 'No se pudo obtener la información de tu cuenta de Google.');
            }

            // Limpiamos cualquier sesión previa para evitar mezclar cuentas
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();

            // Buscamos si el correo ya existe en la Base de Datos
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                $user->update([
                    'google_id'         => $googleUser->getId(),
                    'avatar'            => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
            } else {
                $user = User::create([
                    'name'              => $googleUser->getName() ?? 'Usuario Google',
                    'email'             => $googleUser->getEmail(),
                    'google_id'         => $googleUser->getId(),
                    'avatar'            => $googleUser->getAvatar(),
                    'role'              => 'client',
                    'level_id'          => 1,
                    'password'          => bcrypt(Str::random(16)), 
                    'email_verified_at' => now(), 
                ]);
            }

            Auth::login($user, true);
            request()->session()->regenerate();

            return redirect()->route('dashboard');

        } catch (\Throwable $e) {
            // En caso de error, redirigimos al login con mensaje flash explicativo
            return redirect()->route('login')->with('error', 'Ocurrió un error al autenticar con Google: ' . $e->getMessage());
        }
    }
}
