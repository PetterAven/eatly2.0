import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface CartItemProps {
    product: {
        id: number;
        name: string;
        price: number;
        [key: string]: unknown;
    };
    quantity: number;
}

interface CheckoutProps {
    subtotalComida: number;
    localId: number;
    vendedorId?: number | null;
    repartidorId?: number | null;
    itemsCarrito: CartItemProps[];
    initialDeliveryLocation?: string;
}

interface FormState {
    cliente_id: string | number;
    subtotal_comida: number;
    destino_edificio: string;
    destino_aula: string;
    metodo_pago: 'tarjeta' | 'efectivo';
    vendedor_id: number | null;
    repartidor_id: number | null;
    local_id: number;
    items: Array<{
        item_id: number;
        cantidad: number;
        precio_unitario: number;
    }>;
}

export default function CheckoutForm({
    subtotalComida,
    localId,
    vendedorId = null,
    repartidorId = null,
    itemsCarrito,
    initialDeliveryLocation = '',
}: CheckoutProps) {
    const {
        auth,
        flash,
        errors: serverErrors,
    } = usePage<{
        auth: { user?: { id: number; name: string; email: string } };
        flash?: Record<string, unknown>;
        errors?: Record<string, string>;
    }>().props;

    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [expiracion, setExpiracion] = useState('');
    const [cvv, setCvv] = useState('');
    const [descargado, setDescargado] = useState(false);

    const { data, setData, post, processing, errors } = useForm<FormState>({
        cliente_id: auth.user ? auth.user.id : '',
        subtotal_comida: subtotalComida || 0,
        destino_edificio: initialDeliveryLocation || 'Edificio 2',
        destino_aula: initialDeliveryLocation || 'Aula 104',
        metodo_pago: 'efectivo',
        vendedor_id: vendedorId,
        repartidor_id: repartidorId,
        local_id: localId,
        items: [],
    });

    useEffect(() => {
        const itemsMapeados = itemsCarrito.map((item) => ({
            item_id: item.product.id,
            cantidad: item.quantity,
            precio_unitario: item.product.price,
        }));

        setData((prevData) => ({
            ...prevData,
            subtotal_comida: subtotalComida,
            local_id: localId,
            items: itemsMapeados,
        }));
    }, [subtotalComida, localId, itemsCarrito, setData]);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorLimpio = e.target.value.replace(/\D/g, '');
        const formateado =
            valorLimpio?.match(/.{1,4}/g)?.join(' ') || valorLimpio;
        setNumeroTarjeta(formateado.substring(0, 19));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pedidos/simular-pago', {
            preserveScroll: true,
        });
    };

    const descargarTicketDigital = () => {
        const lines = [
            '=========================================',
            '            EATLY EATS CAMPUS            ',
            '         Universidad Politécnica         ',
            '=========================================',
            `Fecha: ${new Date().toLocaleDateString()}`,
            `Código Pedido: ${flash?.orderCode || 'EAT-SIMULADO'}`,
            `Cliente: ${auth?.user?.name || 'Usuario Campus'}`,
            '-----------------------------------------',
            'Detalle de Compra:',
        ];

        itemsCarrito.forEach((item) => {
            lines.push(
                `- ${item.quantity}x ${item.product.name.substring(0, 20)}... $${(item.product.price * item.quantity).toFixed(2)}`,
            );
        });

        lines.push(
            '-----------------------------------------',
            `Subtotal Alimentos: $${subtotalComida.toFixed(2)} MXN`,
            'Envío Campus:        $12.00 MXN',
            `TOTAL COBRADO:      $${(subtotalComida + 12.0).toFixed(2)} MXN`,
            '-----------------------------------------',
            `Destino: ${initialDeliveryLocation || data.destino_edificio}`,
            `Método de Pago: ${flash?.metodoPago === 'tarjeta' ? 'TARJETA BANCARIA' : 'EFECTIVO CONTRA ENTREGA'}`,
            '=========================================',
            '     ¡Gracias por consumir local!       ',
            '         Powered by Eatly UPP           ',
            '=========================================',
        );

        const blob = new Blob([lines.join('\n')], {
            type: 'text/plain;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Ticket-${flash?.orderCode || 'EAT'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDescargado(true);
    };

    const pedidoExitoso = flash?.success === true;
    const metodoPagoFinal = flash?.metodoPago || data.metodo_pago;
    const esTarjeta = metodoPagoFinal === 'tarjeta';
    const codigoPedido = flash?.orderCode || 'EAT-PROCESANDO';

    if (pedidoExitoso) {
        return (
            <div className="animate-fadeIn space-y-5 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
                        esTarjeta
                            ? 'bg-green-100 text-green-600'
                            : 'bg-amber-100 text-amber-600'
                    }`}
                >
                    {esTarjeta ? '💳' : '💵'}
                </div>

                <div>
                    <h3 className="text-lg font-black text-gray-900">
                        {esTarjeta
                            ? '¡Pago Procesado con Éxito!'
                            : '¡Pedido Confirmado!'}
                    </h3>
                    <p className="mt-1 px-4 text-xs leading-relaxed text-gray-500">
                        {esTarjeta
                            ? 'Tu cargo con tarjeta fue aprobado de forma segura. El comercio comenzará tu orden.'
                            : 'Prepara tu efectivo. Le pagarás directamente al repartidor al recibir tus alimentos.'}
                    </p>
                </div>

                <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left text-xs font-medium text-gray-600">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Código de Pedido:</span>
                        <span className="font-bold tracking-wider text-gray-900">
                            {String(codigoPedido)}
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Método Registrado:</span>
                        <span className="text-[10px] font-bold text-gray-900 uppercase">
                            {esTarjeta
                                ? 'Transacción Digital'
                                : 'Efectivo contra entrega'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Destino de Entrega:</span>
                        <span className="font-bold text-gray-900">
                            {initialDeliveryLocation ||
                                `${data.destino_edificio}, ${data.destino_aula}`}
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-950">
                        <span>
                            {esTarjeta
                                ? 'Total Cobrado:'
                                : 'Monto Total a Pagar:'}
                        </span>
                        <span className="font-black text-purple-600">
                            ${(data.subtotal_comida + 12.0).toFixed(2)} MXN
                        </span>
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <button
                        type="button"
                        onClick={descargarTicketDigital}
                        className={`w-full rounded-xl py-2.5 text-xs font-bold tracking-wider text-white uppercase transition ${
                            descargado
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-950 hover:bg-gray-800'
                        }`}
                    >
                        {descargado
                            ? '✔️ Ticket Guardado'
                            : '📄 Descargar Ticket de Compra'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = '/historial';
                        }}
                        className="w-full rounded-xl border border-purple-200 py-2.5 text-xs font-bold tracking-wider text-purple-600 uppercase transition hover:bg-purple-50"
                    >
                        ⭐ Ver pedido y Calificar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <h2 className="text-base font-black tracking-tight text-gray-900">
                    Finalizar mi pedido en Eatly
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                    Configura tu entrega en las instalaciones del campus.
                </p>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="space-y-1 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                    <p className="font-bold">
                        ⚠️ Corrige los siguientes errores:
                    </p>
                    <ul className="list-inside list-disc pl-1 text-[11px] font-medium">
                        {Object.entries(errors).map(([key, msg]) => (
                            <li key={key}>{String(msg)}</li>
                        ))}
                    </ul>
                </div>
            )}
            {serverErrors?.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                    ⚠️ {serverErrors.error}
                </div>
            )}

            <div className="flex items-center justify-between rounded-2xl border border-orange-200/60 bg-orange-50 p-3.5">
                <div>
                    <span className="block text-[10px] font-black tracking-wider text-orange-700 uppercase">
                        Destino Seleccionado
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-gray-900">
                        {initialDeliveryLocation || 'Campus UPP - Edificio 2'}
                    </p>
                </div>
                <span className="text-xl">📍</span>
            </div>

            <div>
                <label className="mb-1.5 block text-[11px] font-bold text-gray-400 uppercase">
                    Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setData('metodo_pago', 'efectivo')}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition ${
                            data.metodo_pago === 'efectivo'
                                ? 'border-[#FF5722] bg-orange-50 text-[#FF5722]'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-lg">💵</span> Cash / Efectivo
                    </button>
                    <button
                        type="button"
                        onClick={() => setData('metodo_pago', 'tarjeta')}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition ${
                            data.metodo_pago === 'tarjeta'
                                ? 'border-[#FF5722] bg-orange-50 text-[#FF5722]'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-lg">💳</span> Tarjeta Bancaria
                    </button>
                </div>
            </div>

            {data.metodo_pago === 'tarjeta' && (
                <div className="space-y-3.5 rounded-2xl border border-gray-800 bg-gray-900 p-4 text-white shadow-inner">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-[10px] font-bold tracking-widest text-orange-400 uppercase">
                            Eatly Sandbox Gateway
                        </span>
                        <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                            MODO PRUEBA
                        </span>
                    </div>

                    <div>
                        <label className="mb-1 block text-[9px] font-bold text-gray-400 uppercase">
                            Número de Tarjeta
                        </label>
                        <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={numeroTarjeta}
                            onChange={handleCardNumberChange}
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 font-mono text-xs tracking-widest text-white focus:border-[#FF5722] focus:ring-0"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[9px] font-bold text-gray-400 uppercase">
                                Expiración
                            </label>
                            <input
                                type="text"
                                placeholder="MM/AA"
                                maxLength={5}
                                value={expiracion}
                                onChange={(e) => setExpiracion(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-center font-mono text-xs text-white focus:border-[#FF5722] focus:ring-0"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[9px] font-bold text-gray-400 uppercase">
                                CVV
                            </label>
                            <input
                                type="password"
                                placeholder="***"
                                maxLength={3}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-center font-mono text-xs text-white focus:border-[#FF5722] focus:ring-0"
                                required
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-1.5 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs font-medium text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal alimentos:</span>
                    <span className="font-bold text-gray-900">
                        ${data.subtotal_comida.toFixed(2)} MXN
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Envío Campus (Fijo):</span>
                    <span className="font-bold text-gray-900">$12.00 MXN</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-black text-gray-900">
                    <span>Total a procesar:</span>
                    <span className="text-[#FF5722]">
                        ${(data.subtotal_comida + 12.0).toFixed(2)} MXN
                    </span>
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] py-3.5 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-orange-500/25 transition hover:bg-[#F4511E] disabled:opacity-50"
            >
                {processing
                    ? 'Procesando Transacción...'
                    : `Confirmar y pagar $${(data.subtotal_comida + 12.0).toFixed(2)}`}
            </button>
        </form>
    );
}
