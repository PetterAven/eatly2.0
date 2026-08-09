<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            'availableOrders' => Order::with(['user', 'branch.restaurant', 'branch.location', 'items.item'])
                ->where('status', 'ready')
                ->whereNull('driver_id')
                ->latest()
                ->get(),
            'myDeliveries' => Order::with(['user', 'branch.restaurant', 'branch.location', 'items.item'])
                ->where('driver_id', $userId)
                ->latest()
                ->get(),
            'myRatings' => $myRatings,
        ]);
    }

    public function takeOrder(Order $order)
    {
        $wasTaken = DB::transaction(function () use ($order) {
            $order = Order::lockForUpdate()->findOrFail($order->id);

            if ($order->driver_id !== null || $order->status !== 'ready') {
                return false;
            }

            $order->update([
                'driver_id' => Auth::id(),
                'status' => 'delivering',
            ]);

            return true;
        });

        if (! $wasTaken) {
            return redirect()->back()->with('error', 'Este pedido ya no está disponible para entrega.');
        }

        return redirect()->back()->with('success', 'Has tomado el pedido para entrega.');
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:delivered',
        ]);

        abort_unless($order->driver_id === Auth::id(), 403, 'No tienes permiso para actualizar este pedido.');

        if ($order->status !== 'delivering') {
            return redirect()->back()->withErrors([
                'error' => 'Solo puedes marcar como entregado un pedido que está en ruta.',
            ]);
        }

        $order->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Entrega reportada. El cliente debe confirmarla para cerrar el pedido.');
    }
}
