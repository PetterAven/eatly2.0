<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Muestra la página de inicio o redirige al dashboard si ya está logueado.
     */
    public function welcome()
    {
        // SI BRAYAN YA INICIÓ SESIÓN, LO MANDAMOS AL DASHBOARD AUTOMÁTICAMENTE
        if (auth()->check()) {
            return redirect()->route('dashboard');
        }

        $branches = Branch::with(['restaurant', 'location', 'images', 'image'])
            ->where('is_active', true)
            ->get()
            ->map(function ($branch) {
                $imageUrl = $branch->image?->url
                    ?? $branch->images->first()?->url
                    ?? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500';

                return [
                    'id' => $branch->id,
                    'name' => $branch->name ?? 'Sucursal sin nombre',
                    'restaurant_name' => $branch->restaurant?->name ?? 'Restaurante Genérico',
                    'city' => $branch->location?->city ?? 'Ciudad Principal',
                    'image' => $imageUrl,
                    'rating' => 4.5,
                    'delivery_time' => '20-30 min',
                ];
            });

        // CORREGIDO: 'Welcome' ahora va con W mayúscula exacta coincidiendo con React
        return Inertia::render('Welcome', [
            'branches' => $branches,
        ]);
    }
}
