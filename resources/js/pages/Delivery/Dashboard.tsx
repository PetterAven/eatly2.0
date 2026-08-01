import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Bike, Package, CheckCircle, Clock, MapPin, Navigation, LogOut } from 'lucide-react';

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

export default function DeliveryDashboard({ auth, availableOrders, myDeliveries, myRatings }: Props) {
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    const takeOrder = (orderId: number) => {
        setLoadingOrderId(orderId);
        router.post(`/delivery/orders/${orderId}/take`, {}, {
            preserveScroll: true,
            onFinish: () => setLoadingOrderId(null),
        });
    };

    const updateStatus = (orderId: number, status: string) => {
        setLoadingOrderId(orderId);
        router.patch(`/delivery/orders/${orderId}/status`, { status }, {
            preserveScroll: true,
            onFinish: () => setLoadingOrderId(null),
        });
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Head title="Panel de Repartidor - Eatly UPP" />

            {/* Top Navbar Clean */}
            <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                <div className="flex items-center space-x-4">
                    <Link href="/delivery/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-gray-900">Eatly <span className="text-[#FF5722]">Eats</span> 🐴</span>
                    </Link>
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Bike className="w-3.5 h-3.5" /> Panel de Repartidor
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-xs font-bold text-gray-700 hidden sm:inline">
                        👤 {auth?.user?.name || 'Repartidor'}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-2xl transition duration-200 flex items-center gap-1"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Salir
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-8 translate-y-8 pointer-events-none">
                        <span className="text-9xl">🛵</span>
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <span className="bg-white/25 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                            🚀 Logística Campus UPP
                        </span>
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
                            Entregas en Campus UPP
                        </h1>
                        <p className="text-xs lg:text-sm text-amber-100 font-medium">
                            Toma pedidos listos en las cafeterías y llévalos puntualmente a la comunidad universitaria.
                        </p>
                    </div>
                </div>

                {/* Mis Entregas Activas */}
                <div>
                    <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-purple-700" /> Mis Pedidos Asignados ({myDeliveries.length})
                    </h2>

                    {myDeliveries.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-400 text-sm font-medium shadow-sm">
                            No tienes entregas activas en este momento. ¡Toma un pedido disponible abajo!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myDeliveries.map((order) => (
                                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-purple-200 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-purple-900 text-base">Pedido #{order.code || order.id}</span>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {order.status === 'completed' ? 'Entregado' : 'En Ruta / Preparando'}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-xs text-slate-600 mb-4">
                                            <div><strong className="text-slate-800">Cliente:</strong> {order.user?.name || 'Comensal UPP'}</div>
                                            <div><strong className="text-slate-800">Local:</strong> {order.branch?.name || 'Cafetería UPP'}</div>
                                            <div>
                                                <strong className="text-slate-800">Platillos:</strong>
                                                <ul className="list-disc list-inside mt-1">
                                                    {order.items?.map((i, idx) => (
                                                        <li key={idx}>{i.quantity}x {i.item?.name || 'Platillo'}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="font-black text-slate-900">${Number(order.total).toFixed(2)}</span>
                                        {order.status !== 'completed' && (
                                             <button
                                                 onClick={() => updateStatus(order.id, 'completed')}
                                                 disabled={loadingOrderId === order.id}
                                                 className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
                                             >
                                                 {loadingOrderId === order.id && (
                                                     <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                    <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-600" /> Pedidos Listos para Tomar ({availableOrders.length})
                    </h2>

                    {availableOrders.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-400 text-sm font-medium shadow-sm">
                            No hay pedidos disponibles para entrega en este momento.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-slate-900 text-base">Pedido #{order.code || order.id}</span>
                                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                                                Listo / Preparando
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-xs text-slate-600 mb-4">
                                            <div><strong className="text-slate-800">Cliente:</strong> {order.user?.name || 'Comensal UPP'}</div>
                                            <div><strong className="text-slate-800">Cafetería:</strong> {order.branch?.name || 'Cafetería UPP'}</div>
                                            <div>
                                                <strong className="text-slate-800">Contenido:</strong>
                                                <ul className="list-disc list-inside mt-1">
                                                    {order.items?.map((i, idx) => (
                                                        <li key={idx}>{i.quantity}x {i.item?.name || 'Platillo'}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="font-black text-slate-900">${Number(order.total).toFixed(2)}</span>
                                         <button
                                             onClick={() => takeOrder(order.id)}
                                             disabled={loadingOrderId === order.id}
                                             className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-purple-950 font-black text-xs uppercase rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
                                         >
                                             {loadingOrderId === order.id && (
                                                 <div className="w-3.5 h-3.5 border-2 border-purple-950 border-t-transparent rounded-full animate-spin" />
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
                    <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        ⭐ Mis Calificaciones Recibidas ({myRatings.length})
                    </h2>

                    {myRatings.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-400 text-sm font-medium shadow-sm">
                            Aún no tienes calificaciones de los comensales. ¡Completa más entregas con amabilidad y rapidez!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myRatings.map((rating) => (
                                <div key={rating.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-900 text-sm">{rating.user?.name || 'Comensal UPP'}</span>
                                            <div className="flex items-center text-amber-500 font-bold text-sm">
                                                {'⭐'.repeat(rating.stars)} ({rating.stars}/5)
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">Pedido: #{rating.order?.code || 'N/A'}</p>
                                        <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            "{rating.comment || 'Sin comentario escrito.'}"
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                                        {new Date(rating.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-gray-900 text-gray-400 py-8 text-center text-xs border-t border-gray-800 mt-12">
                <p>&copy; {new Date().getFullYear()} Eatly Eats UPP - Panel de Repartidores.</p>
            </footer>
        </div>
    );
}
