<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PedidoController extends Controller
{
    /**
     * El repartidor puede reportar una entrega, pero el pedido no se cierra
     * hasta que el cliente la confirma desde su historial.
     */
    public function confirmarEntrega(Request $request, Pedido $pedido)
    {
        abort_unless($pedido->user_id === $request->user()->id, 403, 'No tienes permiso para confirmar este pedido.');

        if ($pedido->status !== 'delivered') {
            return back()->withErrors([
                'error' => 'Este pedido aún no está listo para ser confirmado.',
            ]);
        }

        $pedido->update(['status' => 'completed']);

        return back()->with('success', 'Entrega confirmada. Ya puedes calificar al local y al repartidor.');
    }

    /**
     * Las cancelaciones por parte del cliente solo se permiten antes de que
     * un repartidor tome el pedido. Una vez en ruta, evitar cancelar protege
     * al repartidor y al comercio que ya están atendiendo la orden.
     */
    public function cancelar(Request $request, Pedido $pedido)
    {
        abort_unless($pedido->user_id === $request->user()->id, 403, 'No tienes permiso para cancelar este pedido.');

        $canBeCancelled = in_array($pedido->status, ['pending', 'preparing', 'ready'], true)
            && $pedido->driver_id === null;

        if (! $canBeCancelled) {
            return back()->withErrors([
                'error' => 'Este pedido ya está siendo entregado o finalizó, por lo que no puede cancelarse desde la app.',
            ]);
        }

        $changes = ['status' => 'cancelled'];
        $refundRequested = $pedido->payment_status === 'paid';

        // El cobro es simulado: dejamos una señal clara para que un futuro
        // proveedor de pagos procese el reembolso sin marcarlo como hecho.
        if ($refundRequested) {
            $changes['payment_status'] = 'refund_pending';
        }

        $pedido->update($changes);

        return back()->with(
            'success',
            $refundRequested
                ? 'Pedido cancelado. Tu reembolso quedó solicitado.'
                : 'Pedido cancelado correctamente.'
        );
    }

    public function procesarPagoSimulado(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return redirect()->route('login')->withErrors(['error' => 'Por favor inicia sesión para continuar.']);
        }

        $request->validate([
            'subtotal_comida' => 'required|numeric|min:0',
            'destino_edificio' => 'nullable|string|max:255|required_without:delivery_lat',
            'destino_aula' => 'nullable|string|max:255',
            'delivery_lat' => 'nullable|numeric|between:-90,90|required_without:destino_edificio',
            'delivery_lng' => 'nullable|numeric|between:-180,180|required_with:delivery_lat',
            'metodo_pago' => 'required|in:tarjeta,efectivo',
            'vendedor_id' => 'nullable|exists:users,id',
            'repartidor_id' => 'nullable|exists:users,id',
            'local_id' => 'required|exists:branches,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        try {
            $resultado = DB::transaction(function () use ($request, $user) {
                $subtotal = $request->subtotal_comida;
                $tarifaEnvioBase = 12.00;

                $repartidorId = $request->repartidor_id;
                if (! $repartidorId) {
                    $repartidorId = User::where('id', '!=', $user->id)->first()?->id;
                }

                $totalPagado = $subtotal + $tarifaEnvioBase;
                $codigoGenerado = 'EAT-'.strtoupper(Str::random(8));

                $pedido = Pedido::create([
                    'user_id' => $user->id,
                    'branch_id' => $request->local_id,
                    'cart_id' => null,
                    'code' => $codigoGenerado,
                    'status' => 'pending',
                    'mode' => 'delivery',
                    'payment_status' => $request->metodo_pago === 'tarjeta' ? 'paid' : 'unpaid',
                    'subtotal' => $subtotal,
                    'discount' => 0.00,
                    'total' => $totalPagado,
                    'driver_id' => null,
                    'destino_edificio' => $request->destino_edificio,
                    'destino_aula' => $request->destino_aula,
                    'delivery_lat' => $request->delivery_lat,
                    'delivery_lng' => $request->delivery_lng,
                ]);

                foreach ($request->items as $item) {
                    DB::table('order_items')->insert([
                        'order_id' => $pedido->id,
                        'item_id' => $item['item_id'],
                        'quantity' => $item['cantidad'],
                        'unit_price' => $item['precio_unitario'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                return [
                    'pedido_id' => $pedido->id,
                    'code' => $pedido->code,
                    'status' => $pedido->status,
                ];
            });

            return back()->with([
                'success' => true,
                'message' => 'Pedido registrado con éxito.',
                'orderCode' => $resultado['code'],
                'metodoPago' => $request->metodo_pago,
                'edificio' => $request->destino_edificio,
                'aula' => $request->destino_aula,
            ]);

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Error en la transacción: '.$e->getMessage(),
            ]);
        }
    }
}
