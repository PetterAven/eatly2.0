<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Pedido;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    public function store(Request $request, Pedido $pedido)
    {
        // Corregido: Verificar seguridad con base en tu modelo "Pedido"
        abort_unless($pedido->user_id === auth()->id(), 403, 'No tienes permiso para calificar este pedido.');
        abort_unless(in_array($pedido->status, ['delivered', 'completed']), 422, 'Solo puedes calificar pedidos que ya han sido entregados.');

        $validated = $request->validate([
            'branch_stars'   => 'required|integer|min:1|max:5',
            'branch_comment' => 'nullable|string|max:500',
            'driver_stars'   => 'nullable|integer|min:1|max:5',
            'driver_comment' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($pedido, $validated) {
            // Calificación del local
            Rating::updateOrCreate(
                [
                    'pedido_id'     => $pedido->id,
                    'rateable_type' => Branch::class,
                    'rateable_id'   => $pedido->branch_id,
                ],
                [
                    'user_id' => auth()->id(),
                    'stars'   => $validated['branch_stars'],
                    'comment' => $validated['branch_comment'] ?? null,
                ]
            );

            // Calificación del repartidor (si tiene un driver asignado)
            if ($pedido->driver_id && isset($validated['driver_stars'])) {
                Rating::updateOrCreate(
                    [
                        'pedido_id'     => $pedido->id,
                        'rateable_type' => User::class,
                        'rateable_id'   => $pedido->driver_id,
                    ],
                    [
                        'user_id' => auth()->id(),
                        'stars'   => $validated['driver_stars'],
                        'comment' => $validated['driver_comment'] ?? null,
                    ]
                );
            }
        });

        return back()->with([
            'success' => true,
            'message' => '¡Tu calificación ha sido enviada con éxito!',
        ]);
    }
}