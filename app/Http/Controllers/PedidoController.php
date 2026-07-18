<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PedidoController extends Controller
{
    public function procesarPagoSimulado(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:users,id',
            'subtotal_comida' => 'required|numeric|min:0',
            'destino_edificio' => 'required|string',
            'destino_aula' => 'required|string',
            'metodo_pago' => 'required|in:tarjeta,efectivo',
            'vendedor_id' => 'nullable|exists:users,id',
            'repartidor_id' => 'nullable|exists:users,id',
            'local_id' => 'required|exists:branches,id',
            'items' => 'required|array|min:1',
        ]);

        try {
            $resultado = DB::transaction(function () use ($request) {
                $subtotal = $request->subtotal_comida;
                $tarifaEnvioBase = 12.00;

                if ($request->filled('vendedor_id')) {
                    $comisionApp = $subtotal * 0.05;
                    $gananciaVendedor = $subtotal - $comisionApp;
                } else {
                    $comisionApp = 0.00;
                    $gananciaVendedor = $subtotal;
                }

                if ($request->filled('repartidor_id')) {
                    $gananciaRepartidor = 10.00;
                    $comisionApp += 2.00;
                } else {
                    $gananciaRepartidor = 0.00;
                }

                $totalPagado = $subtotal + $tarifaEnvioBase;
                $codigoGenerado = 'EAT-' . strtoupper(Str::random(8));

                $pedido = Pedido::create([
                    'user_id'        => $request->cliente_id,
                    'branch_id'      => $request->local_id,
                    'cart_id'        => null,
                    'code'           => $codigoGenerado,
                    'status'         => 'confirmed',
                    'mode'           => 'pickup',
                    'payment_status' => $request->metodo_pago === 'tarjeta' ? 'paid' : 'unpaid',
                    'subtotal'       => $subtotal,
                    'discount'       => 0.00,
                    'total'          => $totalPagado,
                ]);

                foreach ($request->items as $item) {
                    DB::table('order_items')->insert([
                        'order_id'   => $pedido->id,
                        'item_id'    => $item['item_id'],
                        'quantity'   => $item['cantidad'],
                        'price'      => $item['precio_unitario'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                return [
                    'pedido_id' => $pedido->id,
                    'code' => $pedido->code,
                    'status' => $pedido->status,
                    'productos_comprados' => count($request->items),
                ];
            });

            // Pasamos las variables directamente al método with()
            // Inertia las capturará automáticamente en las props globales bajo la propiedad 'flash'
            return back()->with([
                'success' => true,
                'message' => 'Pedido registrado con éxito.',
                'orderCode' => $resultado['code'],
                'metodoPago' => $request->metodo_pago,
                'edificio' => $request->destino_edificio,
                'aula' => $request->destino_aula
            ]);

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Error en la transacción: ' . $e->getMessage()
            ]);
        }
    }
}
