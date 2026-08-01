<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PedidoController extends Controller
{
    public function procesarPagoSimulado(Request $request)
    {
        $request->validate([
            'cliente_id'       => 'required|exists:users,id',
            'subtotal_comida'  => 'required|numeric|min:0',
            'destino_edificio' => 'required|string',
            'destino_aula'     => 'required|string',
            'metodo_pago'      => 'required|in:tarjeta,efectivo',
            'vendedor_id'      => 'nullable|exists:users,id',
            'repartidor_id'    => 'nullable|exists:users,id',
            'local_id'         => 'required|exists:branches,id',
            'items'            => 'required|array|min:1',
            'items.*.item_id'  => 'required|exists:items,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        try {
            $resultado = DB::transaction(function () use ($request) {
                $subtotal = $request->subtotal_comida;
                $tarifaEnvioBase = 12.00;

                $repartidorId = $request->repartidor_id;
                if (!$repartidorId) {
                    $repartidorId = User::where('id', '!=', $request->cliente_id)->first()?->id;
                }

                $totalPagado = $subtotal + $tarifaEnvioBase;
                $codigoGenerado = 'EAT-' . strtoupper(Str::random(8));

                $pedido = Pedido::create([
                    'user_id'        => $request->cliente_id,
                    'branch_id'      => $request->local_id,
                    'cart_id'        => null,
                    'code'           => $codigoGenerado,
                    'status'         => 'pending',
                    'mode'           => 'delivery',
                    'payment_status' => $request->metodo_pago === 'tarjeta' ? 'paid' : 'unpaid',
                    'subtotal'       => $subtotal,
                    'discount'       => 0.00,
                    'total'          => $totalPagado,
                    'driver_id'      => null,
                ]);

                foreach ($request->items as $item) {
                    DB::table('order_items')->insert([
                        'order_id'   => $pedido->id,
                        'item_id'    => $item['item_id'],
                        'quantity'   => $item['cantidad'],
                        'unit_price' => $item['precio_unitario'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                return [
                    'pedido_id' => $pedido->id,
                    'code'      => $pedido->code,
                    'status'    => $pedido->status,
                ];
            });

            return back()->with([
                'success'    => true,
                'message'    => 'Pedido registrado con éxito.',
                'orderCode'  => $resultado['code'],
                'metodoPago' => $request->metodo_pago,
                'edificio'   => $request->destino_edificio,
                'aula'       => $request->destino_aula,
            ]);

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Error en la transacción: ' . $e->getMessage()
            ]);
        }
    }
}