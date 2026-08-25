import RatingModal from '@/components/RatingModal';
import StarRating from '@/components/StarRating';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    LogOut,
    Settings,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

const statusLabels: Record<string, string> = {
    pending: 'Tu pedido está pendiente',
    confirmed: 'Tu pedido ha sido confirmado',
    preparing: 'Tu pedido está en preparación',
    ready: 'Tu pedido está listo',
    ready_for_pickup: 'Tu pedido está listo',
    delivering: 'Tu pedido ha sido entregado al repartidor',
    delivery: 'Tu pedido ha sido entregado al repartidor',
    on_the_way: 'Tu pedido ha sido entregado al repartidor',
    delivered: 'Confirma que recibiste tu pedido',
    completed: 'Entrega confirmada',
    cancelled: 'Cancelado',
};

export default function History() {
    const { orders, auth } = usePage<HistoryProps & SharedData>().props;
    const userRole =
        ((auth?.user as Record<string, unknown>)?.role as string) || 'client';
    const getHomeUrl = () => {
        if (userRole === 'merchant') return '/vendor/dashboard';
        if (userRole === 'driver') return '/delivery/dashboard';
        return '/dashboard';
    };

    const getHomeLabel = () => {
        if (userRole === 'merchant') return 'Panel de concesionario';
        if (userRole === 'driver') return 'Panel de repartidor';
        return 'Menú / catálogo';
    };

    const homeUrl = getHomeUrl();
    const homeLabel = getHomeLabel();
    const [ratingOrder, setRatingOrder] = useState<OrderRow | null>(null);
    const [processingOrderId, setProcessingOrderId] = useState<number | null>(
        null,
    );
    const [deliveryNoticeOrder, setDeliveryNoticeOrder] =
        useState<OrderRow | null>(null);

    const ordersData = orders?.data ?? [];

    useEffect(() => {
        const interval = window.setInterval(() => {
            router.reload({ only: ['orders'] });
        }, 15000);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        const deliveredOrder = ordersData.find((order) => {
            const noticeKey = `eatly-delivery-notice-${order.id}`;
            return (
                order.status === 'delivered' &&
                !window.sessionStorage.getItem(noticeKey)
            );
        });

        if (!deliveredOrder) {
            return;
        }

        window.sessionStorage.setItem(
            `eatly-delivery-notice-${deliveredOrder.id}`,
            'shown',
        );
        // Deferred to avoid cascading renders and linting warnings
        setTimeout(() => setDeliveryNoticeOrder(deliveredOrder), 0);

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('¿Recibiste tu pedido?', {
                body: `El repartidor marcó como entregado el pedido ${deliveredOrder.code}. Confírmalo desde Eatly.`,
            });
        }
    }, [ordersData]);

    const hasBranchRating = (order: OrderRow) =>
        order.ratings?.some((r) => r.rateable_type.endsWith('Branch')) ?? false;

    const canCancel = (order: OrderRow) =>
        ['pending', 'preparing', 'ready'].includes(order.status) &&
        !order.driver_id;

    const confirmDelivery = (orderId: number) => {
        setProcessingOrderId(orderId);
        router.patch(
            `/pedidos/${orderId}/confirmar-entrega`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingOrderId(null),
            },
        );
    };

    const cancelOrder = (order: OrderRow) => {
        if (
            !window.confirm(
                '¿Quieres cancelar este pedido? Esta acción no se puede deshacer.',
            )
        ) {
            return;
        }

        setProcessingOrderId(order.id);
        router.patch(
            `/pedidos/${order.id}/cancelar`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingOrderId(null),
            },
        );
    };

    const getStatusClasses = (status: string) => {
        if (status === 'completed') {
            return 'bg-green-100 text-green-700';
        }

        if (status === 'delivered') {
            return 'bg-blue-100 text-blue-700';
        }

        if (status === 'cancelled') {
            return 'bg-red-100 text-red-700';
        }

        return 'bg-amber-100 text-amber-700';
    };

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
        <>
            <Head title="Historial de Pedidos - Eatly UPP" />
            <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
                {/* Navbar unificado con la identidad de marca */}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={homeUrl}
                            className="flex items-center gap-2"
                        >
                            <span className="text-2xl font-black tracking-tight text-gray-900">
                                Eatly{' '}
                                <span className="text-[#FF5722]">Eats</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            href={homeUrl}
                            className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                        >
                            {homeLabel}
                        </Link>

                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-1 rounded-2xl bg-gray-100 px-3.5 py-2 text-xs font-bold text-gray-700 transition duration-200 hover:bg-gray-200"
                            title="Ajustes"
                        >
                            <Settings className="h-4 w-4 text-[#FF5722]" />{' '}
                            Ajustes
                        </Link>

                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="flex items-center gap-1 rounded-2xl px-3 py-2 text-xs font-bold text-red-600 transition duration-200 hover:bg-red-50"
                        >
                            <LogOut className="h-3.5 w-3.5" /> Salir
                        </button>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 pb-24">
                    {/* Banner de Sección con identidad de marca */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-xl">
                        <div className="relative z-10">
                            <span className="mb-2 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                                Historial de compras
                            </span>
                            <h1 className="text-2xl font-black tracking-tight lg:text-3xl">
                                Mis pedidos
                            </h1>
                            <p className="mt-1 text-xs text-orange-100">
                                Revisa el estado de tus pedidos anteriores y
                                califica tu experiencia.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black tracking-wider text-gray-700 uppercase shadow-sm transition hover:bg-gray-50 hover:text-[#FF5722]"
                        >
                            <ArrowLeft className="h-4 w-4 text-[#FF5722]" />
                            Volver al Menú Principal
                        </Link>
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
                                            <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-black text-[#FF5722]">
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
                                        className={`rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase ${getStatusClasses(order.status)}`}
                                    >
                                        {statusLabels[order.status] ??
                                            order.status}
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase">
                                            Total pagado
                                        </span>
                                        <p className="text-lg font-black text-gray-900">
                                            ${Number(order.total).toFixed(2)}{' '}
                                            MXN
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap justify-end gap-2">
                                        {order.status === 'delivered' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    confirmDelivery(order.id)
                                                }
                                                disabled={
                                                    processingOrderId ===
                                                    order.id
                                                }
                                                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                                            >
                                                {processingOrderId === order.id
                                                    ? 'Confirmando...'
                                                    : 'Confirmar entrega'}
                                            </button>
                                        )}

                                        {canCancel(order) && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cancelOrder(order)
                                                }
                                                disabled={
                                                    processingOrderId ===
                                                    order.id
                                                }
                                                className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-black tracking-wider text-red-600 uppercase transition hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <XCircle className="h-4 w-4" />{' '}
                                                Cancelar
                                            </button>
                                        )}

                                        {order.status === 'completed' &&
                                            !hasBranchRating(order) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRatingOrder(order)
                                                    }
                                                    className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-sm transition hover:bg-[#F4511E]"
                                                >
                                                    Calificar pedido
                                                </button>
                                            )}

                                        {hasBranchRating(order) && (
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                    Pedido calificado
                                                </span>
                                                <StarRating
                                                    value={
                                                        order.ratings?.find(
                                                            (r) =>
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
                            </div>
                        ))}

                        {ordersData.length === 0 && (
                            <div className="border-gray-150 rounded-2xl border bg-white px-4 py-16 text-center">
                                <p className="text-sm font-bold text-gray-900">
                                    Aún no tienes pedidos registrados
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Realiza tu primera compra desde el menú del
                                    campus.
                                </p>
                                <Link
                                    href={homeUrl}
                                    className="mt-4 inline-block rounded-xl bg-[#FF5722] px-4 py-2 text-xs font-bold text-white hover:bg-[#F4511E]"
                                >
                                    Ver Menú / Panel
                                </Link>
                            </div>
                        )}
                    </div>

                    {ratingOrder && (
                        <RatingModal
                            orderId={ratingOrder.id}
                            branchName={
                                ratingOrder.branch?.name ?? 'este comercio'
                            }
                            hasDriver={!!ratingOrder.driver_id}
                            onClose={() => setRatingOrder(null)}
                        />
                    )}

                    {deliveryNoticeOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
                            <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF5722]">
                                    <Bell className="h-6 w-6" />
                                </div>
                                <h2 className="text-lg font-black text-slate-900">
                                    ¿Recibiste tu pedido?
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    El repartidor reportó la entrega del pedido{' '}
                                    <span className="font-bold text-slate-800">
                                        {deliveryNoticeOrder.code}
                                    </span>
                                    . Confírmala solo si todo llegó bien.
                                </p>
                                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeliveryNoticeOrder(null)
                                        }
                                        className="rounded-xl px-4 py-2.5 text-xs font-black text-slate-600 transition hover:bg-slate-100"
                                    >
                                        Revisar después
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            confirmDelivery(
                                                deliveryNoticeOrder.id,
                                            );
                                            setDeliveryNoticeOrder(null);
                                        }}
                                        disabled={
                                            processingOrderId ===
                                            deliveryNoticeOrder.id
                                        }
                                        className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#F4511E] disabled:opacity-50"
                                    >
                                        Confirmar entrega
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
