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
        // Forzamos a Google a mostrar siempre la ventana de selección de cuenta
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Buscamos si el correo de Google ya existe en la Base de Datos
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // SOLUCIÓN PROFESIONAL: Si ya existe, lo logueamos directo con 'true' (Recordar Sesión)
                Auth::login($user, true);
                return redirect()->route('dashboard');
            }

            // Si es un usuario nuevo en el campus, lo creamos de manera limpia
            $newUser = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(Str::random(16)), 
                'email_verified_at' => now(), 
            ]);

            Auth::login($newUser, true);
            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Ocurrió un inconveniente al conectar con Google.');
        }
    }
}