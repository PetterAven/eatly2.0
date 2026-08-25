<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Item;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $redirectRoute = $user->redirectRouteName();
        if ($redirectRoute !== 'dashboard') {
            return redirect()->route($redirectRoute);
        }

        $items = Item::with(['category.branch.restaurant', 'images'])
            ->where('is_available', true)
            ->whereHas('category.branch', function ($query) {
                $query->where('is_active', true)
                    ->whereHas('restaurant.owner', function ($ownerQuery) {
                        $ownerQuery->where('role', 'merchant');
                    });
            })
            ->get();

        $products = $items->map(function ($item) {
            $branch = $item->category?->branch;
            $restaurant = $branch?->restaurant;
            $imageUrl = $item->images->first()?->url ?? null;

            // Usar dinámicamente el nombre y descripción del restaurante configurado (ej. Moto Restaurante)
            $restaurantName = $restaurant?->name ?? $branch?->name ?? Restaurant::first()?->name ?? Branch::first()?->name ?? 'Cafetería UPP';
            $restaurantDescription = $restaurant?->description ?? $restaurant?->address ?? 'Concesionario Oficial UPP';

            $catName = $item->category?->name ?? 'Comida';
            $mappedCategory = match ($catName) {
                'Snacks' => 'Snacks',
                'Bebidas', 'Postres', 'Combos', 'Bares' => 'Bares',
                default => 'Comida',
            };

            return [
                'id' => $item->id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'description' => $item->description ?? '',
                'category' => $mappedCategory,
                'restaurant_name' => $restaurantName,
                'restaurant_description' => $restaurantDescription,
                'image' => $imageUrl,
                'local_id' => $branch?->id,
            ];
        });

        return Inertia::render('Dashboard', [
            'activeOrder' => Order::where('user_id', Auth::id())
                ->whereIn('status', ['pending', 'preparing', 'ready', 'delivering', 'delivered'])
                ->latest()
                ->first(),
            'databaseProducts' => $products,
            'restaurants' => Restaurant::with('branches')
                ->whereHas('owner', fn ($query) => $query->where('role', 'merchant'))
                ->get(),
            'branches' => Branch::with(['restaurant', 'location', 'images'])
                ->where('is_active', true)
                ->whereHas('restaurant.owner', fn ($query) => $query->where('role', 'merchant'))
                ->get(),
        ]);
    }
}
