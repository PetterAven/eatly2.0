import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import StarRating from '@/components/StarRating';
import RatingModal from '@/components/RatingModal';

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
  orders: {
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
  cancelled: 'Cancelado',
};

export default function History() {
  const { orders } = usePage<HistoryProps>().props;
  const [ratingOrder, setRatingOrder] = useState<OrderRow | null>(null);

  const hasBranchRating = (order: OrderRow) =>
    order.ratings.some((r) => r.rateable_type.endsWith('Branch'));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mis pedidos (Eatly)</h1>

      <div className="space-y-4">
        {orders.data.map((order) => (
          <div key={order.id} className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">{order.branch?.name ?? 'Comercio'}</p>
                <p className="text-sm text-gray-500">Pedido {order.code}</p>
              </div>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                {statusLabels[order.status] ?? order.status}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>

              {order.status === 'delivered' && !hasBranchRating(order) && (
                <button
                  onClick={() => setRatingOrder(order)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 transition-colors"
                >
                  ⭐ Calificar servicio
                </button>
              )}

              {hasBranchRating(order) && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  Calificación:
                  <StarRating
                    value={order.ratings.find((r) => r.rateable_type.endsWith('Branch'))?.stars ?? 0}
                    readOnly
                    size={18}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {orders.data.length === 0 && (
          <p className="text-center text-gray-500 py-12">Todavía no has realizado pedidos.</p>
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
  );
}
