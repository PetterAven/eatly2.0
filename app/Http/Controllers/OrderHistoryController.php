<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Inertia\Inertia;

class OrderHistoryController extends Controller
{
    public function index()
    {
        // Corregido para usar tu modelo Pedido y la relación de calificaciones
        $orders = Pedido::where('user_id', auth()->id())
            ->with([
                'branch:id,name',
                'ratings' => function ($query) {
                    $query->where('user_id', auth()->id());
                },
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Orders/History', [
            'orders' => $orders,
        ]);
    }
}