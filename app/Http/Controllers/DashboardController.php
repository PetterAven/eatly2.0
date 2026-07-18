<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Si no hay productos, creamos unos por defecto para que no se vea vacío
        if (Product::count() === 0) {
            Product::insert([
                [
                    'name' => 'Chilaquiles Con Pollo',
                    'category' => 'Comidas',
                    'price' => 55.00,
                    'description' => 'Chilaquiles verdes o rojos con pollo deshebrado, crema y queso.',
                    'image_url' => 'https://images.unsplash.com/photo-1640719028782-8230f1bdc42a?auto=format&fit=crop&w=400&q=80',
                    'cafe_name' => 'Cafetería Central UPP',
                    'is_available' => true
                ],
                [
                    'name' => 'Molletes Sencillos',
                    'category' => 'Desayunos',
                    'price' => 35.00,
                    'description' => 'Dos piezas con frijoles, queso derretido y pico de gallo.',
                    'image_url' => 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80',
                    'cafe_name' => 'Cafetería Central UPP',
                    'is_available' => true
                ],
                [
                    'name' => 'Café Americano Frío',
                    'category' => 'Bebidas',
                    'price' => 25.00,
                    'description' => 'Café cargado de grano con hielos, 16oz.',
                    'image_url' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
                    'cafe_name' => 'Snack Bar El Potro',
                    'is_available' => true
                ]
            ]);
        }

        return Inertia::render('Dashboard', [
            'products' => Product::where('is_available', true)->get(),
            'activeOrder' => Order::where('user_id', Auth::id())
                                 ->whereIn('status', ['pending', 'preparing', 'ready'])
                                 ->latest()
                                 ->first()
        ]);
    }
}