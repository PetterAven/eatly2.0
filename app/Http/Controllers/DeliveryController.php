<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $myRatings = \App\Models\Rating::with(['user', 'order'])
            ->where('rateable_type', \App\Models\User::class)
            ->where('rateable_id', $userId)
            ->latest()
            ->get();

        return Inertia::render('Delivery/Dashboard', [
            'availableOrders' => Order::with(['user', 'branch', 'items.item'])
                ->whereIn('status', ['ready', 'preparing'])
                ->whereNull('driver_id')
                ->latest()
                ->get(),
            'myDeliveries' => Order::with(['user', 'branch', 'items.item'])
                ->where('driver_id', $userId)
                ->latest()
                ->get(),
            'myRatings' => $myRatings
        ]);
    }

    public function takeOrder(Order $order)
    {
        if ($order->driver_id && $order->driver_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Este pedido ya fue tomado por otro repartidor.');
        }

        $order->update([
            'driver_id' => Auth::id(),
            'status' => 'delivering'
        ]);

        return redirect()->back()->with('success', 'Has tomado el pedido para entrega.');
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:ready,delivering,completed'
        ]);

        $order->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Estado de entrega actualizado.');
    }
}
