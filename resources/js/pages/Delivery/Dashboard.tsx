import { Head, Link, router } from '@inertiajs/react';
import { Bike, LogOut, Navigation, Package } from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
    id: number;
    quantity: number;
    item?: { name: string };
}

interface Order {
    id: number;
    code: string;
    status: string;
    total: number;
    user?: { name: string; phone?: string };
    branch?: { name: string };
    items: OrderItem[];
    driver_id?: number;
}

interface Rating {
    id: number;
    stars: number;
    comment: string | null;
    created_at: string;
    user?: { name: string };
    order?: { code: string };
}

interface Props {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    availableOrders: Order[];
    myDeliveries: Order[];
    myRatings: Rating[];
}

export default function DeliveryDashboard({
    auth,
    availableOrders,
    myDeliveries,
    myRatings,
}: Props) {
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    const takeOrder = (orderId: number) => {
        setLoadingOrderId(orderId);
        router.post(
            `/delivery/orders/${orderId}/take`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoadingOrderId(null),
            },
        );
    };

    const updateStatus = (orderId: number, status: string) => {
        setLoadingOrderId(orderId);
        router.patch(
            `/delivery/orders/${orderId}/status`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setLoadingOrderId(null),
            },
        );
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
            <Head title="Panel de Repartidor - Eatly UPP" />

            {/* Top Navbar Clean */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5 shadow-sm">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/delivery/dashboard"
                        className="flex items-center gap-2"
                    >
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                            Eatly <span className="text-[#FF5722]">Eats</span>{' '}
                            🐴
                        </span>
                    </Link>
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        <Bike className="h-3.5 w-3.5" /> Panel de Repartidor
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="hidden text-xs font-bold text-gray-700 sm:inline">
                        👤 {auth?.user?.name || 'Repartidor'}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 rounded-2xl px-3.5 py-2 text-xs font-bold text-red-600 transition duration-200 hover:bg-red-50"
                    >
                        <LogOut className="h-3.5 w-3.5" /> Salir
                    </button>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-8">
                {/* Header Banner */}
                <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white shadow-xl">
                    <div className="pointer-events-none absolute right-0 bottom-0 translate-x-8 translate-y-8 transform opacity-15">
                        <span className="text-9xl">🛵</span>
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <span className="mb-3 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                            🚀 Logística Campus UPP
                        </span>
                        <h1 className="mb-2 text-3xl font-black tracking-tight lg:text-4xl">
                            Entregas en Campus UPP
                        </h1>
                        <p className="text-xs font-medium text-amber-100 lg:text-sm">
                            Toma pedidos listos en las cafeterías y llévalos
                            puntualmente a la comunidad universitaria.
                        </p>
                    </div>
                </div>

                {/* Mis Entregas Activas */}
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
                        <Navigation className="h-5 w-5 text-purple-700" /> Mis
                        Pedidos Asignados ({myDeliveries.length})
                    </h2>

                    {myDeliveries.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400 shadow-sm">
                            No tienes entregas activas en este momento. ¡Toma un
                            pedido disponible abajo!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {myDeliveries.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col justify-between rounded-3xl border border-purple-200 bg-white p-6 shadow-sm"
                                >
                                    <div>
                                        <div className="mb-3 flex items-start justify-between">
                                            <span className="text-base font-bold text-purple-900">
                                                Pedido #{order.code || order.id}
                                            </span>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}
                                            >
                                                {order.status === 'completed'
                                                    ? 'Entregado'
                                                    : 'En Ruta / Preparando'}
                                            </span>
                                        </div>

                                        <div className="mb-4 space-y-2 text-xs text-slate-600">
                                            <div>
                                                <strong className="text-slate-800">
                                                    Cliente:
                                                </strong>{' '}
                                                {order.user?.name ||
                                                    'Comensal UPP'}
                                            </div>
                                            <div>
                                                <strong className="text-slate-800">
                                                    Local:
                                                </strong>{' '}
                                                {order.branch?.name ||
                                                    'Cafetería UPP'}
                                            </div>
                                            <div>
                                                <strong className="text-slate-800">
                                                    Platillos:
                                                </strong>
                                                <ul className="mt-1 list-inside list-disc">
                                                    {order.items?.map(
                                                        (i, idx) => (
                                                            <li key={idx}>
                                                                {i.quantity}x{' '}
                                                                {i.item?.name ||
                                                                    'Platillo'}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                        <span className="font-black text-slate-900">
                                            ${Number(order.total).toFixed(2)}
                                        </span>
                                        {order.status !== 'completed' && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        order.id,
                                                        'completed',
                                                    )
                                                }
                                                disabled={
                                                    loadingOrderId === order.id
                                                }
                                                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white uppercase shadow transition hover:bg-emerald-600 disabled:opacity-50"
                                            >
                                                {loadingOrderId ===
                                                    order.id && (
                                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                )}
                                                Marcar Entregado
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pedidos Disponibles */}
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
                        <Package className="h-5 w-5 text-amber-600" /> Pedidos
                        Listos para Tomar ({availableOrders.length})
                    </h2>

                    {availableOrders.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400 shadow-sm">
                            No hay pedidos disponibles para entrega en este
                            momento.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {availableOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div>
                                        <div className="mb-3 flex items-start justify-between">
                                            <span className="text-base font-bold text-slate-900">
                                                Pedido #{order.code || order.id}
                                            </span>
                                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                                                Listo / Preparando
                                            </span>
                                        </div>

                                        <div className="mb-4 space-y-2 text-xs text-slate-600">
                                            <div>
                                                <strong className="text-slate-800">
                                                    Cliente:
                                                </strong>{' '}
                                                {order.user?.name ||
                                                    'Comensal UPP'}
                                            </div>
                                            <div>
                                                <strong className="text-slate-800">
                                                    Cafetería:
                                                </strong>{' '}
                                                {order.branch?.name ||
                                                    'Cafetería UPP'}
                                            </div>
                                            <div>
                                                <strong className="text-slate-800">
                                                    Contenido:
                                                </strong>
                                                <ul className="mt-1 list-inside list-disc">
                                                    {order.items?.map(
                                                        (i, idx) => (
                                                            <li key={idx}>
                                                                {i.quantity}x{' '}
                                                                {i.item?.name ||
                                                                    'Platillo'}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                        <span className="font-black text-slate-900">
                                            ${Number(order.total).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => takeOrder(order.id)}
                                            disabled={
                                                loadingOrderId === order.id
                                            }
                                            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-purple-950 uppercase shadow transition hover:bg-amber-600 disabled:opacity-50"
                                        >
                                            {loadingOrderId === order.id && (
                                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-purple-950 border-t-transparent" />
                                            )}
                                            Tomar Pedido
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mis Calificaciones y Reseñas como Repartidor */}
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
                        ⭐ Mis Calificaciones Recibidas ({myRatings.length})
                    </h2>

                    {myRatings.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400 shadow-sm">
                            Aún no tienes calificaciones de los comensales.
                            ¡Completa más entregas con amabilidad y rapidez!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {myRatings.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div>
                                        <div className="mb-2 flex items-start justify-between">
                                            <span className="text-sm font-bold text-slate-900">
                                                {rating.user?.name ||
                                                    'Comensal UPP'}
                                            </span>
                                            <div className="flex items-center text-sm font-bold text-amber-500">
                                                {'⭐'.repeat(rating.stars)} (
                                                {rating.stars}/5)
                                            </div>
                                        </div>
                                        <p className="mb-2 text-xs text-slate-500">
                                            Pedido: #
                                            {rating.order?.code || 'N/A'}
                                        </p>
                                        <p className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 italic">
                                            "
                                            {rating.comment ||
                                                'Sin comentario escrito.'}
                                            "
                                        </p>
                                    </div>
                                    <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                                        {new Date(
                                            rating.created_at,
                                        ).toLocaleDateString('es-MX', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="mt-12 border-t border-gray-800 bg-gray-900 py-8 text-center text-xs text-gray-400">
                <p>
                    &copy; {new Date().getFullYear()} Eatly Eats UPP - Panel de
                    Repartidores.
                </p>
            </footer>
        </div>
    );
}
