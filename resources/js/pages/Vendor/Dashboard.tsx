import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Utensils, Plus, Trash2, Edit, Store, Package, Settings, LogOut } from 'lucide-react';
import ImageUploadPreview from '@/components/ImageUploadPreview';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    category_id: number;
    category?: { name: string };
    price: number;
    description: string;
    is_available: boolean;
    sale_unit?: string;
    unit_label?: string | null;
    images?: { url: string }[];
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    item?: { name: string };
}

interface Order {
    id: number;
    code: string;
    status: string;
    total: number;
    user?: { name: string; email: string };
    items: OrderItem[];
    driver?: { name: string };
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
    products: Product[];
    categories: Category[];
    orders: Order[];
    ratings: Rating[];
}

export default function VendorDashboard({ products, categories, orders, ratings }: Props) {
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'ratings'>('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        category_id: categories[0]?.id || 1,
        price: '',
        description: '',
        is_available: true,
        sale_unit: 'orden',
        unit_label: '',
        image: null as File | string | null,
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            category_id: product.category_id,
            price: product.price.toString(),
            description: product.description || '',
            is_available: product.is_available,
            sale_unit: product.sale_unit || 'orden',
            unit_label: product.unit_label || '',
            image: product.images?.[0]?.url || null,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.post(`/vendor/products/${editingProduct.id}`, {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error('Error updating product:', errors);
                }
            });
        } else {
            post('/vendor/products', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error('Error creating product:', errors);
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este platillo?')) {
            destroy(`/vendor/products/${id}`);
        }
    };

    const updateOrderStatus = (orderId: number, status: string) => {
        setLoadingOrderId(orderId);
        router.put(`/vendor/orders/${orderId}/status`, { status }, {
            preserveScroll: true,
            onFinish: () => setLoadingOrderId(null),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Pendiente</span>;
            case 'preparing':
                return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">En preparación</span>;
            case 'ready':
                return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">Listo para entrega</span>;
            case 'completed':
                return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Entregado</span>;
            default:
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">{status}</span>;
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
            <Head title="Panel de Tienda - Eatly UPP" />

            {/* Header unificado horizontal */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5 shadow-sm">
                <div className="flex items-center space-x-4">
                    <Link href="/vendor/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                            Eatly <span className="text-[#FF5722]">Eats</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        href="/vendor/dashboard"
                        className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                    >
                        Panel de tienda
                    </Link>

                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-1 rounded-2xl bg-gray-100 px-3.5 py-2 text-xs font-bold text-gray-700 transition duration-200 hover:bg-gray-200"
                        title="Ajustes"
                    >
                        <Settings className="h-4 w-4 text-[#FF5722]" /> Ajustes
                    </Link>

                    <button
                        onClick={() => router.post('/logout')}
                        className="flex items-center gap-1 rounded-2xl px-3 py-2 text-xs font-bold text-red-600 transition duration-200 hover:bg-red-50"
                    >
                        <LogOut className="h-3.5 w-3.5" /> Salir
                    </button>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 pb-24">
                {/* Banner de Sección */}
                <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-6 md:p-8 text-white shadow-xl">
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                            Concesionario UPP
                        </span>
                        <h1 className="text-2xl font-black tracking-tight lg:text-3xl">
                            Panel de gestión del local
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Administra tu menú de platillos y supervisa los pedidos de los comensales.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-200/85">
                    <Link
                        href="/vendor/profile"
                        className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-2"
                    >
                        <Store className="h-4 w-4 text-[#FF5722]" /> Perfil y Ubicación
                    </Link>
                    <Link
                        href="/settings/profile"
                        className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-2"
                    >
                        <Settings className="h-4 w-4 text-[#FF5722]" /> Ajustes
                    </Link>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'products' ? 'bg-[#FF5722] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Utensils className="h-4 w-4" /> Mis Platillos ({products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'orders' ? 'bg-[#FF5722] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Package className="h-4 w-4" /> Pedidos Recibidos ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ratings')}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'ratings' ? 'bg-[#FF5722] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Reseñas ({ratings.length})
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-200/85">
                            <h2 className="text-base font-black text-gray-900">Catálogo de Alimentos y Bebidas</h2>
                            <button
                                onClick={openCreateModal}
                                className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-black px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition"
                            >
                                <Plus className="h-4 w-4" /> Nuevo Platillo
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-200/85 overflow-hidden flex flex-col justify-between p-6">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="bg-orange-50 text-[#FF5722] text-xs font-bold px-3 py-1 rounded-xl">
                                                {product.category?.name || 'General'}
                                            </span>
                                            <span className="text-base font-black text-gray-900">
                                                ${Number(product.price).toFixed(2)}{' '}
                                                <span className="text-[10px] font-normal text-gray-400">
                                                    {product.unit_label ? `(${product.unit_label})` : product.sale_unit === 'pieza' ? '(Por pza)' : '(Por orden)'}
                                                </span>
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-base mb-1">{product.name}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-3 mb-4">{product.description}</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-xl ${product.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.is_available ? 'Disponible' : 'Agotado'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/85">
                            <h2 className="text-base font-black text-gray-900">Control de Pedidos en Tiempo Real</h2>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/85 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            <th className="p-4">Pedido / Cliente</th>
                                            <th className="p-4">Platillos</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Repartidor</th>
                                            <th className="p-4">Estado Actual</th>
                                            <th className="p-4 text-right">Acciones de Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                                <td className="p-4 font-medium text-gray-900">
                                                    <div className="font-bold text-[#FF5722]">#{order.code || order.id}</div>
                                                    <div className="text-xs text-gray-500">{order.user?.name || 'Cliente UPP'}</div>
                                                </td>
                                                <td className="p-4 text-xs text-gray-600">
                                                    {order.items?.map((i, idx) => (
                                                        <div key={idx}>• {i.quantity}x {i.item?.name || 'Platillo'}</div>
                                                    ))}
                                                </td>
                                                <td className="p-4 font-bold text-gray-900">${Number(order.total).toFixed(2)}</td>
                                                <td className="p-4 text-xs text-gray-600">
                                                    {order.driver?.name ? (
                                                        <span className="font-semibold text-gray-900">{order.driver.name}</span>
                                                    ) : (
                                                        <span className="text-amber-600 italic">Sin asignar</span>
                                                    )}
                                                </td>
                                                 <td className="p-4">{getStatusBadge(order.status)}</td>
                                                 <td className="p-4 text-right space-x-2">
                                                     {order.status === 'pending' && (
                                                         <button
                                                             onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                             disabled={loadingOrderId === order.id}
                                                             className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                                                         >
                                                             {loadingOrderId === order.id ? (
                                                                 <div className="w-3 h-3 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                                                             ) : null} Preparar
                                                         </button>
                                                     )}
                                                     {order.status === 'preparing' && (
                                                         <button
                                                             onClick={() => updateOrderStatus(order.id, 'ready')}
                                                             disabled={loadingOrderId === order.id}
                                                             className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF5722] font-bold text-xs rounded-xl transition shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                                                         >
                                                             {loadingOrderId === order.id ? (
                                                                 <div className="w-3 h-3 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin" />
                                                             ) : null} Listo
                                                         </button>
                                                     )}
                                                 </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ratings' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/85">
                            <h2 className="text-base font-black text-gray-900">Calificaciones y Opiniones de Clientes</h2>
                        </div>
                        {ratings.length === 0 ? (
                            <div className="bg-white p-8 rounded-3xl text-center border border-gray-200/85 text-gray-400 text-sm font-medium">
                                Aún no hay reseñas registradas para tu local.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ratings.map((rating) => (
                                    <div key={rating.id} className="bg-white rounded-3xl shadow-sm border border-gray-200/85 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-900 text-sm">{rating.user?.name || 'Comensal UPP'}</span>
                                                <div className="flex items-center text-amber-500 font-bold text-sm">
                                                    ({rating.stars}/5)
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">Pedido: #{rating.order?.code || 'N/A'}</p>
                                            <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                "{rating.comment || 'Sin comentario escrito.'}"
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
                                            {new Date(rating.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Modal Crear / Editar Platillo */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6">
                                {editingProduct ? 'Editar Platillo' : 'Nuevo Platillo para el Menú'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Platillo</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
                                        placeholder="Ej. Hamburguesa Doble con Queso"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría</label>
                                        <select
                                            value={data.category_id}
                                            onChange={e => setData('category_id', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
                                        >
                                            {categories && categories.length > 0 ? (
                                                categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))
                                            ) : (
                                                <option value={1}>Comida General</option>
                                            )}
                                        </select>
                                        {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Precio ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
                                            placeholder="55.00"
                                        />
                                        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Se vende por</label>
                                        <select
                                            value={data.sale_unit}
                                            onChange={e => setData('sale_unit', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
                                        >
                                            <option value="orden">Orden completa</option>
                                            <option value="pieza">Pieza individual</option>
                                            <option value="otro">Otro (especificar)</option>
                                        </select>
                                        {errors.sale_unit && <p className="text-xs text-red-500 mt-1">{errors.sale_unit}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Etiqueta de Unidad</label>
                                        <input
                                            type="text"
                                            value={data.unit_label}
                                            onChange={e => setData('unit_label', e.target.value)}
                                            disabled={data.sale_unit !== 'otro'}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm disabled:opacity-50"
                                            placeholder={data.sale_unit === 'otro' ? 'Ej. 1L, 5 pzas, porción' : 'N/A'}
                                        />
                                        {errors.unit_label && <p className="text-xs text-red-500 mt-1">{errors.unit_label}</p>}
                                    </div>
                                </div>

                                 <div>
                                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Imagen de Referencia del Platillo</label>
                                     <ImageUploadPreview
                                         value={data.image}
                                         onChange={(file) => setData('image', file)}
                                         label="Sube una foto del platillo"
                                     />
                                     {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
                                 </div>

                                 <div>
                                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
                                        placeholder="Ingredientes y detalles..."
                                    />
                                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-2xl transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-[#FF5722] hover:bg-[#F4511E] text-white font-black text-xs uppercase rounded-2xl shadow transition"
                                    >
                                        {editingProduct ? 'Guardar Cambios' : 'Crear Platillo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
