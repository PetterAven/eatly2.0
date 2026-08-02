import RatingModal from '@/components/RatingModal';
import StarRating from '@/components/StarRating';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';

interface RatingSummary {
    rateable_type: string;
    stars: number;
}

interface OrderRow {
    id: number;
    code: string;
    status: string;
    total: number;
    created_at: string;
    driver_id: number | null;
    branch: { id: number; name: string } | null;
    ratings: RatingSummary[];
}

interface HistoryProps {
    orders?: {
        data: OrderRow[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    [key: string]: unknown;
}

const statusLabels: Record<string, string> = {
    confirmed: 'Confirmado',
    preparing: 'En preparación',
    on_the_way: 'En camino',
    delivered: 'Entregado',
    completed: 'Entregado',
    cancelled: 'Cancelado',
};

export default function History() {
    const { orders } = usePage<HistoryProps>().props;
    const [ratingOrder, setRatingOrder] = useState<OrderRow | null>(null);

    const ordersData = orders?.data ?? [];

    const hasBranchRating = (order: OrderRow) =>
        order.ratings?.some((r) => r.rateable_type.endsWith('Branch')) ?? false;

    // Formateador de fecha amigable en español
    const formatFecha = (fechaStr: string) => {
        try {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return fechaStr;
        }
    };

    // Formateador de hora
    const formatHora = (fechaStr: string) => {
        try {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return '';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Mis Pedidos', href: '/historial' }]}>
            <Head title="Historial de Pedidos - Eatly UPP" />
            <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
                {/* Botón de navegación interna de regreso al menú (Dashboard) */}
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black tracking-wider text-gray-700 uppercase shadow-sm transition hover:bg-gray-50 hover:text-purple-600"
                    >
                        <ArrowLeft className="h-4 w-4 text-purple-600" />
                        Volver al Menú
                    </Link>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tight text-gray-900">
                        Mis Pedidos 🐴
                    </h1>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-400">
                        Historial de compras
                    </span>
                </div>

                <div className="space-y-4">
                    {ordersData.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                                <div>
                                    <p className="text-sm font-extrabold text-gray-900 md:text-base">
                                        {order.branch?.name ??
                                            'Comercio del Campus'}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-gray-400">
                                        <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-black text-purple-600">
                                            {order.code}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                            {formatFecha(order.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                                            {formatHora(order.created_at)}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase ${
                                        order.status === 'delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'cancelled'
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-amber-100 text-amber-700'
                                    }`}
                                >
                                    {statusLabels[order.status] ?? order.status}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">
                                        Total pagado
                                    </span>
                                    <p className="text-lg font-black text-gray-900">
                                        ${Number(order.total).toFixed(2)} MXN
                                    </p>
                                </div>

                                {['delivered', 'completed'].includes(
                                    order.status,
                                ) &&
                                    !hasBranchRating(order) && (
                                        <button
                                            onClick={() =>
                                                setRatingOrder(order)
                                            }
                                            className="rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-sm transition hover:bg-purple-700 hover:shadow-purple-100"
                                        >
                                            ⭐ Calificar Pedido
                                        </button>
                                    )}

                                {hasBranchRating(order) && (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                                            <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                            Pedido Calificado ⭐
                                        </span>
                                        <StarRating
                                            value={
                                                order.ratings?.find((r) =>
                                                    r.rateable_type.endsWith(
                                                        'Branch',
                                                    ),
                                                )?.stars ?? 0
                                            }
                                            readOnly
                                            size={16}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {ordersData.length === 0 && (
                        <div className="border-gray-150 rounded-2xl border bg-white px-4 py-16 text-center">
                            <span className="mb-2 block text-4xl">🍽️</span>
                            <p className="text-sm font-bold text-gray-900">
                                Aún no tienes pedidos registrados
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                Realiza tu primera compra desde el menú del
                                campus.
                            </p>
                            <Link
                                href="/dashboard"
                                className="mt-4 inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
                            >
                                Ver Menú
                            </Link>
                        </div>
                    )}
                </div>

                {ratingOrder && (
                    <RatingModal
                        orderId={ratingOrder.id}
                        branchName={ratingOrder.branch?.name ?? 'este comercio'}
                        hasDriver={!!ratingOrder.driver_id}
                        onClose={() => setRatingOrder(null)}
                    />
                )}
            </div>
        </AppLayout>
    );
}
