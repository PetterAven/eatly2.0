<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function welcome()
    {
        // Traer sucursales activas con restaurant, location e imágenes
        $branches = Branch::with(['restaurant', 'location', 'images'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(12)
            ->get()
            ->map(function (Branch $branch) {
                $image = $branch->images->first();

                return [
                    'id'              => $branch->id,
                    'name'            => $branch->name,
                    'restaurant_name' => $branch->restaurant?->name,
                    'city'            => $branch->location?->city,
                    'state'           => $branch->location?->state,
                    'image_url'       => $image?->url,
                    // tiempos estimados fake por ahora (15–30 min)
                    'eta_min'         => rand(15, 20),
                    'eta_max'         => rand(21, 30),
                    // rating demo
                    'rating'          => number_format(rand(42, 50) / 10, 1),
                ];
            });

        return Inertia::render('Welcome', [
            'canLogin'       => Route::has('login'),
            'canRegister'    => Features::enabled(Features::registration()),
            'laravelVersion' => Application::VERSION,
            'phpVersion'     => PHP_VERSION,
            'branches'       => $branches,
        ]);
    }
}
