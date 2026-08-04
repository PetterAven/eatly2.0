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
        if (auth()->check()) {
            return redirect()->route(auth()->user()->redirectRouteName());
        }

        $branches = Branch::with(['restaurant', 'location', 'images', 'image'])
            ->where('is_active', true)
            ->get()
            ->map(function ($branch) {
                $imageUrl = $branch->image?->url
                    ?? $branch->images->first()?->url
                    ?? $branch->restaurant?->image
                    ?? match ($branch->id) {
                        1 => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
                        2 => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
                        3 => 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
                        4 => 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
                        5 => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
                        6 => 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
                        7 => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                        8 => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                        default => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
                    };

                return [
                    'id' => $branch->id,
                    'name' => $branch->name ?? 'Sucursal sin nombre',
                    'restaurant_name' => $branch->restaurant?->name ?? 'Restaurante Genérico',
                    'location' => $branch->location?->address_line ?? $branch->restaurant?->address ?? 'Edificio de Servicios Estudiantiles, UPP',
                    'phone' => $branch->phone ?? '771 555 1001',
                    'schedule' => $branch->opening_hours ?? 'Lunes a Viernes - 8:00 AM a 5:00 PM',
                    'image' => $imageUrl,
                    'rating' => 4.5,
                    'delivery_time' => '20-30 min',
                ];
            });

        return Inertia::render('Welcome', [
            'branches' => $branches,
        ]);
    }
}
