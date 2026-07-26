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
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                $user->update([
                    'google_id'         => $googleUser->getId(),
                    'avatar'            => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(), // Asegura pase por middleware 'verified'
                ]);

                Auth::login($user, true);

                return redirect()->intended('/dashboard');
            }

            $newUser = User::create([
                'name'              => $googleUser->getName(),
                'email'             => $googleUser->getEmail(),
                'google_id'         => $googleUser->getId(),
                'avatar'            => $googleUser->getAvatar(),
                'level_id'          => 1,
                'password'          => bcrypt(Str::random(16)), 
                'email_verified_at' => now(), 
            ]);

            Auth::login($newUser, true);

            return redirect()->intended('/dashboard');

        } catch (\Throwable $e) {
            // En producción redirigimos al login con mensaje de error limpio en vez de dd()
            return redirect()->route('welcome')->with('error', 'Ocurrió un error al intentar autenticar con Google. Intenta de nuevo.');
        }
    }
}