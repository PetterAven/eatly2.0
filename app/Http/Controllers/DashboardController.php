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

        if ($user->role === 'merchant') {
            return redirect()->route('vendor.dashboard');
        }

        if ($user->role === 'driver') {
            return redirect()->route('delivery.dashboard');
        }

        $items = Item::with(['category.branch.restaurant', 'images'])->get();

        $products = $items->map(function ($item) {
            $branch = $item->category?->branch;
            $restaurant = $branch?->restaurant;
            $imageUrl = $item->images->first()?->url
                ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

            // Usar dinámicamente el nombre y descripción del restaurante configurado (ej. Moto Restaurante)
            $restaurantName = $restaurant?->name ?? $branch?->name ?? Restaurant::first()?->name ?? Branch::first()?->name ?? 'Cafetería UPP';
            $restaurantDescription = $restaurant?->description ?? $restaurant?->address ?? 'Concesionario Oficial UPP';

            return [
                'id' => $item->id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'description' => $item->description ?? '',
                'category' => 'Comida',
                'restaurant_name' => $restaurantName,
                'restaurant_description' => $restaurantDescription,
                'image' => $imageUrl,
                'local_id' => $branch?->id ?? 1,
            ];
        });

        return Inertia::render('Dashboard', [
            'activeOrder' => Order::where('user_id', Auth::id())
                ->whereIn('status', ['pending', 'preparing', 'ready'])
                ->latest()
                ->first(),
            'databaseProducts' => $products,
            'restaurants' => Restaurant::with('branches')->get(),
            'branches' => Branch::with(['restaurant', 'location', 'images'])->get(),
        ]);
    }
}
