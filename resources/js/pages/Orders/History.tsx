import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import StarRating from '@/components/StarRating';
import RatingModal from '@/components/RatingModal';
import { ArrowLeft, Clock, Calendar, CheckCircle2 } from 'lucide-react';

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
  [key: string]: any;
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
    } catch (e) {
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
        hour12: true
      });
    } catch (e) {
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
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-700 shadow-sm hover:bg-gray-50 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-4 h-4 text-purple-600" />
            Volver al Menú
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mis Pedidos 🐴</h1>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            Historial de compras
          </span>
        </div>

        <div className="space-y-4">
          {ordersData.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-200/80 p-5 shadow-sm bg-white hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="font-extrabold text-gray-900 text-sm md:text-base">{order.branch?.name ?? 'Comercio del Campus'}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-400 font-semibold items-center">
                    <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md text-[10px] font-black">
                      {order.code}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formatFecha(order.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatHora(order.created_at)}
                    </span>
                  </div>
                </div>
                
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                  order.status === 'delivered' 
                    ? 'bg-green-100 text-green-700' 
                    : order.status === 'cancelled' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Total pagado</span>
                  <p className="text-lg font-black text-gray-900">${Number(order.total).toFixed(2)} MXN</p>
                </div>

                {['delivered', 'completed'].includes(order.status) && !hasBranchRating(order) && (
                  <button
                    onClick={() => setRatingOrder(order)}
                    className="rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-purple-700 transition shadow-sm hover:shadow-purple-100"
                  >
                    ⭐ Calificar Pedido
                  </button>
                )}

                {hasBranchRating(order) && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pedido Calificado ⭐
                    </span>
                    <StarRating
                      value={order.ratings?.find((r) => r.rateable_type.endsWith('Branch'))?.stars ?? 0}
                      readOnly
                      size={16}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {ordersData.length === 0 && (
            <div className="text-center bg-white border border-gray-150 rounded-2xl py-16 px-4">
              <span className="text-4xl block mb-2">🍽️</span>
              <p className="text-sm font-bold text-gray-900">Aún no tienes pedidos registrados</p>
              <p className="text-xs text-gray-400 mt-1">Realiza tu primera compra desde el menú del campus.</p>
              <Link 
                href="/dashboard"
                className="inline-block mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
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