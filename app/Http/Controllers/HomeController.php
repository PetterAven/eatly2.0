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
            ->whereHas('restaurant.owner', function ($query) {
                $query->where('role', 'merchant');
            })
            ->get()
            ->map(function ($branch) {
                $imageUrl = $branch->image?->url
                    ?? $branch->images->first()?->url
                    ?? $branch->restaurant?->image;

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
