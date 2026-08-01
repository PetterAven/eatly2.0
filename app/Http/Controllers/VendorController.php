<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index()
    {
        $branchIds = \App\Models\Branch::pluck('id');
        $ratings = \App\Models\Rating::with(['user', 'order'])
            ->where('rateable_type', \App\Models\Branch::class)
            ->whereIn('rateable_id', $branchIds)
            ->latest()
            ->get();

        if (Category::count() === 0) {
            $branchId = \App\Models\Branch::first()?->id ?? 1;
            Category::create(['name' => 'Comida', 'branch_id' => $branchId]);
            Category::create(['name' => 'Snacks', 'branch_id' => $branchId]);
            Category::create(['name' => 'Bebidas', 'branch_id' => $branchId]);
        }

        return Inertia::render('Vendor/Dashboard', [
            'products' => Item::with('category')->latest()->get(),
            'categories' => Category::all(),
            'orders' => Order::with(['user', 'branch', 'items.item', 'driver'])->latest()->get(),
            'ratings' => $ratings,
        ]);
    }

    public function storeProduct(Request $request)
    {
        if (Category::count() === 0) {
            $branchId = \App\Models\Branch::first()?->id ?? 1;
            Category::create(['name' => 'Comida', 'branch_id' => $branchId]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'image' => 'nullable|image|max:5120',
        ]);

        $categoryId = $validated['category_id'] ?? Category::first()?->id ?? Category::create(['name' => 'General', 'branch_id' => \App\Models\Branch::first()?->id ?? 1])->id;

        $item = Item::create([
            'name' => $validated['name'],
            'category_id' => $categoryId,
            'price' => $validated['price'],
            'description' => $validated['description'] ?? '',
            'is_available' => $request->has('is_available') ? $request->is_available : true,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('items', 'public');
            $item->images()->create(['url' => '/storage/' . $path]);
        }

        return redirect()->back()->with('success', 'Platillo creado exitosamente.');
    }

    public function updateProduct(Request $request, Item $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'image' => 'nullable|image|max:5120',
        ]);

        $product->update($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('items', 'public');
            $product->images()->delete();
            $product->images()->create(['url' => '/storage/' . $path]);
        }

        return redirect()->back()->with('success', 'Platillo actualizado exitosamente.');
    }

    public function destroyProduct(Item $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Platillo eliminado.');
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,preparing,ready,delivering,completed,delivered,cancelled'
        ]);

        $order->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Estado del pedido actualizado.');
    }

    public function profile()
    {
        $user = auth()->user();
        $restaurant = \App\Models\Restaurant::firstOrCreate(
            ['owner_id' => $user->id],
            [
                'name' => $user->name . ' Restaurante',
                'description' => 'Deliciosa comida en el campus de la UPP.',
                'address' => 'Edificio de Servicios Estudiantiles, UPP',
                'latitude' => 19.8145,
                'longitude' => -98.7389,
            ]
        );

        return Inertia::render('Vendor/Profile', [
            'restaurant' => $restaurant,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'schedule' => 'nullable|array',
            'image' => 'nullable|image|max:5120',
        ]);

        $user = auth()->user();
        $restaurant = \App\Models\Restaurant::firstOrCreate(['owner_id' => $user->id]);

        $dataToUpdate = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'schedule' => $validated['schedule'] ?? null,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('restaurants', 'public');
            $dataToUpdate['image'] = '/storage/' . $path;
        }

        $restaurant->update($dataToUpdate);

        $branch = $restaurant->branches()->first();
        if ($branch) {
            $branch->update([
                'name' => $restaurant->name,
            ]);
        } else {
            \App\Models\Branch::create([
                'restaurant_id' => $restaurant->id,
                'name' => $restaurant->name,
                'is_active' => true,
            ]);
        }

        return redirect()->back()->with('success', 'Perfil de restaurante actualizado con éxito.');
    }

    public function showRegister()
    {
        return Inertia::render('Vendor/Register');
    }

    public function storeRegister(Request $request)
    {
        $validated = $request->validate([
            'restaurant_name' => 'required|string|max:255',
            'food_type' => 'required|string',
            'location' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'terms' => 'accepted',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['restaurant_name'] . ' (Admin)',
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'merchant',
            'email_verified_at' => now(),
        ]);

        $restaurant = \App\Models\Restaurant::create([
            'owner_id' => $user->id,
            'name' => $validated['restaurant_name'],
            'description' => 'Especialidad en ' . $validated['food_type'] . ' - Campus UPP.',
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'address' => $validated['location'],
            'latitude' => 19.9625,
            'longitude' => -98.6834,
        ]);

        $location = \App\Models\Location::create([
            'country' => 'México',
            'state' => 'Hidalgo',
            'city' => 'Zempoala',
            'address_line' => $validated['location'],
            'postal_code' => '43830',
            'lat' => 19.9625,
            'lng' => -98.6834,
        ]);

        $branch = \App\Models\Branch::create([
            'restaurant_id' => $restaurant->id,
            'location_id' => $location->id,
            'name' => $validated['restaurant_name'] . ' - ' . $validated['location'],
            'phone' => $validated['phone'],
            'is_active' => true,
        ]);

        Category::create(['name' => $validated['food_type'], 'branch_id' => $branch->id]);

        \Illuminate\Support\Facades\Auth::login($user);

        return redirect()->route('vendor.dashboard')->with('success', '¡Cafetería registrada exitosamente en Eatly Eats!');
    }
}
