import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

interface CartItemProps {
    product: {
        id: number;
        name: string;
        price: number;
        [key: string]: any;
    };
    quantity: number;
}

interface CheckoutProps {
    subtotalComida: number;
    localId: number;
    vendedorId?: number | null;
    repartidorId?: number | null;
    itemsCarrito: CartItemProps[];
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
    items: Array<{ item_id: number; cantidad: number; precio_unitario: number }>;
    error?: string;
}

export default function CheckoutForm({ subtotalComida, localId, vendedorId = null, repartidorId = null, itemsCarrito }: CheckoutProps) {
    // Extraemos de forma segura las props compartidas por el Middleware de Inertia
    const { auth, flash, errors: serverErrors } = usePage<any>().props;

    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [expiracion, setExpiracion] = useState('');
    const [cvv, setCvv] = useState('');

    const { data, setData, post, processing, errors } = useForm<FormState>({
        cliente_id: auth.user ? auth.user.id : '',
        subtotal_comida: subtotalComida || 0,
        destino_edificio: '',
        destino_aula: '',
        metodo_pago: 'efectivo', 
        vendedor_id: vendedorId,
        repartidor_id: repartidorId,
        local_id: localId,
        items: [],
    });

    useEffect(() => {
        const itemsMapeados = itemsCarrito.map(item => ({
            item_id: item.product.id,
            cantidad: item.quantity, 
            precio_unitario: item.product.price
        }));

        setData(prevData => ({
            ...prevData,
            subtotal_comida: subtotalComida,
            local_id: localId,
            items: itemsMapeados
        }));
    }, [subtotalComida, localId, itemsCarrito]);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorLimpio = e.target.value.replace(/\D/g, '');
        const formateado = valorLimpio?.match(/.{1,4}/g)?.join(' ') || valorLimpio;
        setNumeroTarjeta(formateado.substring(0, 19));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Asegúrate de que esta URL coincida exactamente con tu archivo de rutas (web.php)
        post('/pedidos/simular-pago', {
            preserveScroll: true,
        });
    };

    // EVALUACIÓN DE ÉXITO INTEGRADA CON EL FLASH REAL DE LARAVEL
    const pedidoExitoso = flash?.success === true;
    const metodoPagoFinal = flash?.metodoPago || data.metodo_pago;
    const esTarjeta = metodoPagoFinal === 'tarjeta';
    const codigoPedido = flash?.orderCode || 'EAT-PROCESANDO';

    if (pedidoExitoso) {
        return (
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-5 animate-fadeIn">
                {/* Iconografía Dinámica */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl ${
                    esTarjeta ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                }`}>
                    {esTarjeta ? '💳' : '💵'}
                </div>
                
                {/* Mensajes de Confirmación basados en la respuesta */}
                <div>
                    <h3 className="text-lg font-black text-gray-900">
                        {esTarjeta ? '¡Pago Procesado con Éxito!' : '¡Pedido Confirmado!'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 px-4 leading-relaxed">
                        {esTarjeta 
                            ? 'Tu cargo con tarjeta fue aprobado de forma segura. El comercio comenzará tu orden.' 
                            : 'Prepara tu efectivo. Le pagarás directamente al repartidor al recibir tus alimentos.'}
                    </p>
                </div>

                {/* Resumen del Ticket Físico / Digital */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-left text-xs font-medium text-gray-600 border border-gray-100">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Código de Pedido:</span>
                        <span className="font-bold text-gray-900 tracking-wider">{codigoPedido}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Método Registrado:</span>
                        <span className="font-bold text-gray-900 uppercase text-[10px]">
                            {esTarjeta ? 'Transacción Digital' : 'Efectivo contra entrega'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Destino de Entrega:</span>
                        <span className="font-bold text-gray-900">
                            {flash?.edificio || data.destino_edificio}, {flash?.aula || data.destino_aula}
                        </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-950">
                        <span>{esTarjeta ? 'Total Cobrado:' : 'Monto Total a Pagar:'}</span>
                        <span className="text-purple-600 font-black">${(data.subtotal_comida + 12.00).toFixed(2)} MXN</span>
                    </div>
                </div>

                {/* Botones de Acción Posterior */}
                <div className="space-y-2 pt-2">
                    <button 
                        type="button" 
                        onClick={() => alert('Generando archivo de ticket PDF... Próximamente integrado con dompdf.')}
                        className="w-full py-2.5 bg-gray-950 hover:bg-gray-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition"
                    >
                        {esTarjeta ? '📄 Descargar Voucher de Pago' : '📄 Descargar Nota de Entrega'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold rounded-xl text-xs uppercase tracking-wider transition"
                    >
                        Volver al menú de Eatly
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <h2 className="text-base font-black text-gray-900 tracking-tight">Finalizar mi pedido en Eatly</h2>
                <p className="text-xs text-gray-400 mt-0.5">Configura tu entrega en las instalaciones del campus.</p>
            </div>

            {(errors.error || serverErrors.error) && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                    ⚠️ {errors.error || serverErrors.error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">Edificio UPP</label>
                    <select 
                        value={data.destino_edificio}
                        onChange={e => setData('destino_edificio', e.target.value)}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 font-medium"
                        required
                    >
                        <option value="">Selecciona...</option>
                        <option value="Edificio G">Edificio G (Ingenierías)</option>
                        <option value="Edificio UD">Edificio UD (Laboratorios)</option>
                        <option value="Edificio H">Edificio H (Biblioteca)</option>
                        <option value="Cafetería Principal">Cafetería Principal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">Aula / Cubículo</label>
                    <input 
                        type="text" 
                        placeholder="Ej. Aula 105 o Planta Alta"
                        value={data.destino_aula}
                        onChange={e => setData('destino_aula', e.target.value)}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1.5">Método de Pago</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setData('metodo_pago', 'efectivo')}
                        className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 font-bold transition text-xs ${
                            data.metodo_pago === 'efectivo' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-lg">💵</span> Cash / Efectivo
                    </button>
                    <button
                        type="button"
                        onClick={() => setData('metodo_pago', 'tarjeta')}
                        className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 font-bold transition text-xs ${
                            data.metodo_pago === 'tarjeta' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-lg">💳</span> Tarjeta Bancaria
                    </button>
                </div>
            </div>

            {data.metodo_pago === 'tarjeta' && (
                <div className="p-4 bg-gray-900 text-white rounded-2xl space-y-3.5 shadow-inner border border-gray-800">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase">Eatly Sandbox Gateway</span>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-0.5 rounded">MODO PRUEBA</span>
                    </div>

                    <div>
                        <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Número de Tarjeta</label>
                        <input 
                            type="text" 
                            placeholder="4242 4242 4242 4242"
                            value={numeroTarjeta}
                            onChange={handleCardNumberChange}
                            className="w-full text-xs p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono tracking-widest focus:border-purple-500 focus:ring-0"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Expiración</label>
                            <input 
                                type="text" 
                                placeholder="MM/AA"
                                maxLength={5}
                                value={expiracion}
                                onChange={e => setExpiracion(e.target.value)}
                                className="w-full text-xs p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:border-purple-500 focus:ring-0 text-center"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">CVV</label>
                            <input 
                                type="password" 
                                placeholder="***"
                                maxLength={3}
                                value={cvv}
                                onChange={e => setCvv(e.target.value)}
                                className="w-full text-xs p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:border-purple-500 focus:ring-0 text-center"
                                required
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 border border-gray-100 font-medium text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal alimentos:</span>
                    <span className="font-bold text-gray-900">${data.subtotal_comida.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between">
                    <span>Envío Campus (Fijo):</span>
                    <span className="font-bold text-gray-900">$12.00 MXN</span>
                </div>
                <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-gray-200 mt-2">
                    <span>Total a procesar:</span>
                    <span className="text-purple-600">${(data.subtotal_comida + 12.00).toFixed(2)} MXN</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
            >
                {processing ? 'Procesando Transacción...' : `Confirmar y pagar $${(data.subtotal_comida + 12.00).toFixed(2)}`}
            </button>
        </form>
    );
}