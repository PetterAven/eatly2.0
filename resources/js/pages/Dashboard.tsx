import Sidebar from '@/components/Sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CheckoutForm from './Checkout/CheckoutForm';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: 'Comida' | 'Snacks' | 'Bares';
    restaurant_name: string;
    restaurant_description?: string;
    image: string;
    local_id?: number;
    [key: string]: unknown;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface RestaurantProp {
    name: string;
    description?: string;
    address?: string;
}

interface DashboardProps {
    auth: {
        user?: {
            name: string;
            email: string;
        };
    };
    databaseProducts?: Product[];
    restaurants?: RestaurantProp[];
}

// Custom hook para manejar la ubicación de entrega y geolocalización
function useDeliveryLocation() {
    const [locationText, setLocationText] = useState('Edificio 2 - Aula 104');
    const [coords, setCoords] = useState<{
        latitude: number | null;
        longitude: number | null;
    }>({ latitude: null, longitude: null });
    const [isConfirmed, setIsConfirmed] = useState(true);
    const [loadingGeo, setLoadingGeo] = useState(false);

    const requestGeolocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocalización no soportada por tu navegador');
            return;
        }
        setLoadingGeo(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ latitude, longitude });
                setLocationText(
                    `Ubicación detectada en Campus UPP (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                );
                setIsConfirmed(true);
                setLoadingGeo(false);
            },
            (error) => {
                console.error(error);
                alert(
                    'No se pudo obtener tu ubicación. Por favor ingresa tu edificio o referencia manualmente.',
                );
                setLoadingGeo(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    const updateReference = (ref: string) => {
        setLocationText(ref);
        setIsConfirmed(ref.trim().length > 0);
    };

    return {
        locationText,
        coords,
        isConfirmed,
        loadingGeo,
        requestGeolocation,
        updateReference,
    };
}

export default function Dashboard({
    auth,
    databaseProducts,
    restaurants = [],
}: Readonly<DashboardProps>) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const deliveryLocation = useDeliveryLocation();

    // Solicitar permiso de notificaciones push del navegador al entrar al dashboard
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().catch(() => {});
            }
        }
    }, []);

    // Saludo dinámico según la hora del día y el nombre del usuario
    const getDynamicGreeting = (name?: string) => {
        const hour = new Date().getHours();
        const userName = name || 'Comensal';
        if (hour >= 6 && hour < 12) {
            return `Hola, buenos días, ${userName}.`;
        } else if (hour >= 12 && hour < 20) {
            return `Hola, buenas tardes, ${userName}.`;
        } else {
            return `Hola, buenas noches, ${userName}.`;
        }
    };

    const products: Product[] = databaseProducts ?? [];

    // Filtrado de productos basado en la categoría y barra de búsqueda en tiempo real (case-insensitive)
    const filteredProducts = products.filter((p) => {
        const matchesCategory =
            selectedCategory === 'Todos' || p.category === selectedCategory;
        const matchesSearch =
            searchQuery === '' ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const uniqueRestaurants = Array.from(
        new Set(filteredProducts.map((p) => p.restaurant_name)),
    );

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const itemExists = prev.some(
                (item) => item.product.id === product.id,
            );
            if (itemExists) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, amount: number) => {
        setCart(
            (prev) =>
                prev
                    .map((item) => {
                        if (item.product.id === productId) {
                            const newQty = item.quantity + amount;
                            return newQty > 0
                                ? { ...item, quantity: newQty }
                                : null;
                        }
                        return item;
                    })
                    .filter(Boolean) as CartItem[],
        );
    };

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const activeLocalId = cart.length > 0 ? cart[0].product.local_id || 1 : 1;

    return (
        <>
            <Head title="Eatly Eats - Campus UPP" />
            <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
                {/* 3. NAVBAR SUPERIOR */}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5 shadow-sm">
                    <div className="flex items-center space-x-4">
                        {/* Botón ☰ a la izquierda para abrir el sidebar */}
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none"
                            aria-label="Abrir menú"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        {/* Logo de Eatly Eats */}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2"
                        >
                            <span className="text-2xl font-black tracking-tight text-gray-900">
                                Eatly{' '}
                                <span className="text-[#FF5722]">Eats</span>
                            </span>
                        </Link>

                        {/* Selector de ubicación */}
                        <div className="hidden cursor-pointer items-center gap-2 rounded-2xl bg-gray-100/85 px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 md:flex">
                            <div>
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase">
                                    Entrega en
                                </p>
                                <p className="max-w-[200px] truncate font-black text-gray-900">
                                    {deliveryLocation.locationText}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enlaces a la derecha: Avatar con primera letra, Carrito con contador y Mis Pedidos */}
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/historial"
                            className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                        >
                            Mis pedidos
                        </Link>

                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-1 rounded-2xl bg-gray-100 px-3.5 py-2.5 text-xs font-bold text-gray-700 transition duration-200 hover:bg-gray-200"
                            title="Ajustes"
                        >
                            Ajustes
                        </Link>

                        {/* Botón de Carrito con Contador */}
                        <button
                            type="button"
                            onClick={() => {
                                const aside =
                                    document.getElementById('cart-sidebar');
                                aside?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="relative flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-2.5 text-xs font-black text-[#FF5722] transition hover:bg-orange-100"
                        >
                            Carrito
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-[10px] font-black text-white shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="rounded-2xl px-3 py-2 text-xs font-bold text-red-600 transition duration-200 hover:bg-red-50"
                        >
                            Salir
                        </button>
                    </div>
                </header>

                {/* MENÚ LATERAL ESTILO RAPPI (SIDEBAR / DRAWER) */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    auth={auth}
                    onSelectCategory={setSelectedCategory}
                />

                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
                    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                        {/* 2. HERO BANNER PRINCIPAL CON SALUDO DINÁMICO */}
                        <div className="relative mb-8 flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white shadow-xl">
                            <div className="relative z-10 mb-6 max-w-xl">
                                <span className="mb-3 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                                    Delivery express en campus UPP
                                </span>
                                {/* Título dinámico según la hora del día y el nombre del usuario */}
                                <h1 className="mb-2 text-3xl font-black tracking-tight lg:text-4xl">
                                    {getDynamicGreeting(auth?.user?.name)}
                                </h1>
                                <p className="text-xs font-medium text-orange-100 lg:text-sm">
                                    Pide tus antojos favoritos de las cafeterías
                                    del campus directamente a tu edificio o
                                    salón.
                                </p>
                            </div>

                            {/* Buscador central de fondo blanco con sombra (Sincronizado con searchQuery) */}
                            <div className="relative z-10 flex max-w-2xl items-center rounded-2xl bg-white p-4 text-gray-900 shadow-xl">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="¿Qué se te antoja hoy?"
                                    className="w-full border-0 bg-transparent px-3 py-2 text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:ring-0 lg:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const catalogEl =
                                            document.getElementById(
                                                'catalog-section',
                                            );
                                        catalogEl?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                    }}
                                    className="cursor-pointer rounded-xl bg-[#FF5722] px-5 py-2.5 text-xs font-black tracking-wider whitespace-nowrap text-white uppercase shadow-md transition hover:bg-[#F4511E]"
                                >
                                    Buscar
                                </button>
                            </div>

                            <div className="relative z-10 mt-4 flex items-center gap-2 text-[11px] font-bold text-orange-100">
                                <span>Campus UPP - Jagüey de Téllez</span>
                            </div>
                        </div>

                        {/* SECCIÓN DE GEOLOCALIZACIÓN Y SELECTOR DE ENTREGA */}
                        <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-black text-gray-900">
                                        Dirección de entrega en campus UPP
                                    </h3>
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        Usa tu ubicación GPS o indica tu
                                        edificio y aula exactos.
                                    </p>
                                </div>

                                <div className="flex w-full items-center gap-3 md:w-auto">
                                    {deliveryLocation.isConfirmed && (
                                        <span className="flex items-center gap-1 rounded-xl border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-[11px] font-black whitespace-nowrap text-emerald-700 shadow-sm">
                                            Ubicación confirmada
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={
                                            deliveryLocation.requestGeolocation
                                        }
                                        disabled={deliveryLocation.loadingGeo}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-50 px-4 py-2.5 text-xs font-black whitespace-nowrap text-[#FF5722] shadow-sm transition hover:bg-orange-100 md:flex-initial"
                                    >
                                        {deliveryLocation.loadingGeo
                                            ? 'Obteniendo GPS...'
                                            : 'Usa tu ubicación actual'}
                                    </button>
                                </div>
                            </div>

                            {/* Input editable de entrega */}
                            <div className="relative">
                                <span className="absolute top-3.5 left-3.5 text-sm text-gray-400" />
                                <input
                                    type="text"
                                    value={deliveryLocation.locationText}
                                    onChange={(e) =>
                                        deliveryLocation.updateReference(
                                            e.target.value,
                                        )
                                    }
                                    placeholder="¿Dónde quieres recibir tu compra? (ej. Edificio 2 - Aula 104, Biblioteca, Canchas)"
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 text-xs font-bold text-gray-800 transition focus:bg-white focus:ring-2 focus:ring-[#FF5722]"
                                />
                            </div>
                        </div>

                        {/* 3. SECCIÓN DE CATEGORÍAS Y LOCALES */}
                        <div className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-black text-gray-900">
                                    ¿Necesitas algo más?
                                </h2>
                                <span className="text-xs font-bold text-gray-400">
                                    Explora por categorías
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {[
                                    {
                                        id: 'Todos',
                                        label: 'Todo el menú',
                                        color: 'from-purple-500 to-indigo-600',
                                    },
                                    {
                                        id: 'Comida',
                                        label: 'Comida caliente',
                                        color: 'from-amber-500 to-orange-600',
                                    },
                                    {
                                        id: 'Snacks',
                                        label: 'Snacks y antojitos',
                                        color: 'from-pink-500 to-rose-600',
                                    },
                                    {
                                        id: 'Bares',
                                        label: 'Bebidas y bares',
                                        color: 'from-emerald-500 to-teal-600',
                                    },
                                ].map((cat) => (
                                    <button
                                        type="button"
                                        key={cat.id}
                                        onClick={() =>
                                            setSelectedCategory(cat.id)
                                        }
                                        className={`flex transform flex-col items-start justify-between rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 active:scale-95 ${
                                            selectedCategory === cat.id
                                                ? 'bg-gradient-to-br ' +
                                                  cat.color +
                                                  ' scale-[1.02] border-transparent text-white shadow-lg'
                                                : 'border-gray-100 bg-white text-gray-800 hover:border-orange-200 hover:shadow-md'
                                        }`}
                                    >
                                        <div>
                                            <p className="text-xs font-black lg:text-sm">
                                                {cat.label}
                                            </p>
                                            <p
                                                className={`mt-0.5 text-[10px] font-semibold ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}
                                            >
                                                Disponibles hoy
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Título de Cafeterías en tu Campus */}
                        <div id="catalog-section" className="mb-6">
                            <h2 className="text-lg font-black text-gray-900">
                                Cafeterías en tu Campus
                            </h2>
                            <p className="text-xs text-gray-500">
                                Locales y concesionarios activos en la UPP
                            </p>
                        </div>

                        {uniqueRestaurants.length === 0 ? (
                            <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                                <h3 className="text-base font-black text-gray-800">
                                    No se encontraron platillos o cafeterías que
                                    coincidan con la búsqueda.
                                </h3>
                                <p className="mt-1 text-xs text-gray-400">
                                    Intenta con otro término de búsqueda o
                                    categoría.
                                </p>
                            </div>
                        ) : (
                            uniqueRestaurants.map((restaurantName) => {
                                const matchedRestaurant = restaurants.find(
                                    (r) => r.name === restaurantName,
                                );
                                const matchedProduct = filteredProducts.find(
                                    (p) => p.restaurant_name === restaurantName,
                                );
                                const restaurantDesc =
                                    matchedRestaurant?.description ||
                                    matchedRestaurant?.address ||
                                    matchedProduct?.restaurant_description ||
                                    'Concesionario Oficial UPP';
                                const actualName =
                                    matchedRestaurant?.name || restaurantName;

                                return (
                                    <div key={restaurantName} className="mb-12">
                                        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-base font-black text-[#FF5722] shadow-sm">
                                                    •
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-gray-900">
                                                        {actualName}
                                                    </h3>
                                                    <p className="text-[11px] font-semibold text-gray-400">
                                                        {restaurantDesc}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-[11px] font-black tracking-wide text-emerald-700 shadow-sm">
                                                Abierto ahora
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {filteredProducts
                                                .filter(
                                                    (p) =>
                                                        p.restaurant_name ===
                                                        restaurantName,
                                                )
                                                .map((product) => (
                                                    <button
                                                        type="button"
                                                        key={product.id}
                                                        onClick={() =>
                                                            addToCart(product)
                                                        }
                                                        className="group flex w-full transform items-center justify-between gap-5 rounded-3xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:border-[#FF5722]/50 hover:shadow-xl active:scale-[0.98]"
                                                    >
                                                        <div className="flex h-28 flex-1 flex-col justify-between">
                                                            <div>
                                                                <h4 className="text-sm font-black text-gray-900 transition-colors group-hover:text-[#FF5722]">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h4>
                                                                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                                                                    {
                                                                        product.description
                                                                    }
                                                                </p>
                                                            </div>
                                                            <span className="text-base font-black text-[#FF5722]">
                                                                $
                                                                {product.price.toFixed(
                                                                    2,
                                                                )}{' '}
                                                                <span className="text-[10px] font-normal text-gray-400">
                                                                    MXN
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="relative">
                                                            {product.image ? (
                                                                <img
                                                                    src={
                                                                        product.image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="h-28 w-28 flex-shrink-0 rounded-2xl bg-gray-100 object-cover shadow-inner transition duration-300 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-28 w-28 flex-shrink-0 flex-col items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-400 shadow-inner">
                                                                    <span className="px-1 text-center text-[9px] font-black tracking-wider text-orange-500 uppercase">Sin imagen</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute -right-2 -bottom-2 transform rounded-full bg-[#FF5722] p-2 text-white opacity-0 shadow-lg transition duration-300 group-hover:scale-110 group-hover:opacity-100">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2.5
                                                                        }
                                                                        d="M12 4v16m8-8H4"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </main>

                    {/* Sidebar del Carrito Estilo Rappi */}
                    <aside
                        id="cart-sidebar"
                        className="sticky flex h-[calc(100vh-73px)] w-full flex-col justify-between border-t border-gray-200/80 bg-white p-6 shadow-sm lg:top-[73px] lg:w-96 lg:border-t-0 lg:border-l"
                    >
                        <div className="flex-1 overflow-y-auto pr-1">
                            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                                <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-gray-900 uppercase">
                                    Tu pedido actual
                                </h2>
                                <span className="rounded-xl bg-orange-50 px-2.5 py-1 text-xs font-black text-[#FF5722]">
                                    {totalItems} ítems
                                </span>
                            </div>

                            {cart.length === 0 ? (
                                <div className="px-4 py-24 text-center">
                                    <p className="text-xs font-bold text-gray-700">
                                        Tu carrito está vacío
                                    </p>
                                    <p className="mt-1 text-[11px] text-gray-400">
                                        Selecciona deliciosos platillos y
                                        agrégalos a tu pedido.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center justify-between border-b border-gray-100 pb-4 text-xs"
                                        >
                                            <div className="flex-1 pr-2">
                                                <p className="font-extrabold text-gray-900">
                                                    {item.product.name}
                                                </p>
                                                <p className="mt-0.5 font-black text-[#FF5722]">
                                                    $
                                                    {(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3 rounded-2xl bg-gray-100 px-3 py-1.5 shadow-inner">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(
                                                            item.product.id,
                                                            -1,
                                                        );
                                                    }}
                                                    className="text-sm font-bold text-gray-600 hover:text-black"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-black text-black">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(
                                                            item.product.id,
                                                            1,
                                                        );
                                                    }}
                                                    className="text-sm font-bold text-gray-600 hover:text-black"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-100 bg-white pt-5">
                                <div className="mb-4 flex justify-between text-base font-black text-gray-900">
                                    <span>Total a pagar:</span>
                                    <span className="text-[#FF5722]">
                                        ${cartTotal.toFixed(2)} MXN
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="flex w-full transform items-center justify-center gap-2 rounded-2xl bg-[#FF5722] py-4 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-[#F4511E] active:scale-95"
                                >
                                    <span>Proceder al Pago Seguro</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setIsCheckoutOpen(false)}
                                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-400 transition hover:text-black"
                            >
                                ✕
                            </button>

                            <CheckoutForm
                                subtotalComida={cartTotal}
                                localId={activeLocalId}
                                itemsCarrito={cart}
                                initialDeliveryLocation={
                                    deliveryLocation.locationText
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
