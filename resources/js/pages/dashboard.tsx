import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CheckoutForm from './Checkout/CheckoutForm';
import Sidebar from '@/components/Sidebar';

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
    const [coords, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
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
                setLocationText(`📍 Ubicación detectada en Campus UPP (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                setIsConfirmed(true);
                setLoadingGeo(false);
            },
            (error) => {
                console.error(error);
                alert('No se pudo obtener tu ubicación. Por favor ingresa tu edificio o referencia manualmente.');
                setLoadingGeo(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const updateReference = (ref: string) => {
        setLocationText(ref);
        setIsConfirmed(ref.trim().length > 0);
    };

    return { locationText, coords, isConfirmed, loadingGeo, requestGeolocation, updateReference };
}

export default function Dashboard({ auth, databaseProducts, restaurants = [] }: DashboardProps) {
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
    const getDynamicGreeting = (name: string) => {
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

    // Listado de productos del campus (combina BD y respaldo estático)
    const staticProducts: Product[] = [
        { id: 1, name: 'Chilaquiles Tecolote con Pollo', price: 65, description: 'Totopos crujientes, salsa verde viva, crema, queso de aro y pollo deshebrado.', category: 'Comida', restaurant_name: 'Moto Restaurante', restaurant_description: 'Especialidad en antojitos y comida caliente UPP.', image: 'https://images.unsplash.com/photo-1640719028782-8230f1bdc42a?auto=format&fit=crop&w=400&q=80', local_id: 1 },
        { id: 2, name: 'Hamburguesa Monumental Potro', price: 85, description: '150g de res, queso cheddar, tocino ahumado y papas a la francesa.', category: 'Comida', restaurant_name: 'Moto Restaurante', restaurant_description: 'Especialidad en antojitos y comida caliente UPP.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', local_id: 2 },
        { id: 3, name: 'Tacos de Cecina con Papas (3 pzas)', price: 55, description: 'Cecina de Yecapixtla en tortilla de maíz doble con papas fritas arriba.', category: 'Comida', restaurant_name: 'Antojitos Los Pasillos', restaurant_description: 'Antojitos mexicanos rápidos en campus.', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80', local_id: 3 },
        { id: 4, name: 'Dorilocos Preparados con Todo', price: 45, description: 'Doritos, jícama, pepino, cueritos, cacahuates, chamoy y salsa secreta.', category: 'Snacks', restaurant_name: 'El Sultán Snack Bar', restaurant_description: 'Snacks y bebidas preparadas.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80', local_id: 4 },
        { id: 5, name: 'Papas Locas con Queso y Tocino', price: 40, description: 'Papas corte francés bañadas en queso cheddar líquido y tocino picado.', category: 'Snacks', restaurant_name: 'Moto Restaurante', restaurant_description: 'Especialidad en antojitos y comida caliente UPP.', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80', local_id: 2 },
        { id: 6, name: 'Frappé Oreo Supremo', price: 45, description: 'Base cremosa de leche, galleta Oreo triturada, crema batida y chocolate.', category: 'Bares', restaurant_name: 'Bebidas & Co. Campus', restaurant_description: 'Café y bebidas frías.', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80', local_id: 5 },
        { id: 7, name: 'Gomiboing Escarchado Fresa', price: 35, description: 'Jugo Boing frío con hielos, escarchado con miguelito, chamoy y gomitas.', category: 'Bares', restaurant_name: 'El Sultán Snack Bar', restaurant_description: 'Snacks y bebidas preparadas.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', local_id: 4 }
    ];

    const products: Product[] = (databaseProducts && databaseProducts.length > 0) ? databaseProducts : staticProducts;

    // Filtrado de productos basado en la categoría y barra de búsqueda en tiempo real (case-insensitive)
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
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
            const existing = prev.find(
                (item) => item.product.id === product.id,
            );
            if (existing) {
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

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const activeLocalId = cart.length > 0 ? (cart[0].product.local_id || 1) : 1;

    return (
        <>
            <Head title="Eatly Eats - Campus UPP" />
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
                
                {/* 3. NAVBAR SUPERIOR */}
                <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center space-x-4">
                        {/* Botón ☰ a la izquierda para abrir el sidebar */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-xl text-gray-700 transition focus:outline-none"
                            aria-label="Abrir menú"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo de Eatly Eats */}
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-gray-900">Eatly <span className="text-[#FF5722]">Eats</span> 🐴</span>
                        </Link>
                        
                        {/* Selector de ubicación */}
                        <div className="hidden md:flex items-center gap-2 bg-gray-100/85 hover:bg-gray-100 px-3.5 py-2 rounded-2xl text-xs font-bold text-gray-700 cursor-pointer transition">
                            <span className="text-base">📍</span>
                            <div>
                                <p className="text-[10px] text-gray-400 font-extrabold uppercase">Entrega en</p>
                                <p className="text-gray-900 font-black truncate max-w-[200px]">{deliveryLocation.locationText}</p>
                            </div>
                        </div>
                    </div>

                    {/* Barra de búsqueda central en navbar (Sincronizada con searchQuery) */}
                    <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
                        <span className="absolute left-3.5 text-gray-400">🔍</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Comida, cafeterías, platillos..."
                            className="w-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-[#FF5722] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-800 transition"
                        />
                    </div>

                    {/* Enlaces a la derecha: Avatar con primera letra, Carrito con contador y Mis Pedidos */}
                    <div className="flex items-center space-x-3">
                        <Link 
                            href="/historial" 
                            className="text-xs font-extrabold text-gray-700 hover:text-[#FF5722] hover:bg-orange-50 px-3.5 py-2.5 rounded-2xl transition duration-200 flex items-center gap-1.5"
                        >
                            📋 Mis Pedidos
                        </Link>

                        {/* Avatar de usuario que redirige a /profile */}
                        <Link 
                            href="/profile" 
                            className="flex items-center gap-2 group"
                            title="Mi Cuenta"
                        >
                            <div className="bg-white text-orange-600 rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition border border-orange-100">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </Link>
                        
                        {/* Botón de Carrito con Contador */}
                        <button 
                            onClick={() => {
                                const aside = document.getElementById('cart-sidebar');
                                aside?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="relative bg-orange-50 hover:bg-orange-100 text-[#FF5722] px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition"
                        >
                            🛒 Carrito
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-[#FF5722] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button onClick={() => router.post('/logout')} className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-2xl transition duration-200">Salir</button>
                    </div>
                </header>

                {/* MENÚ LATERAL ESTILO RAPPI (SIDEBAR / DRAWER) */}
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    auth={auth} 
                    onSelectCategory={setSelectedCategory}
                />

                <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        
                        {/* 2. HERO BANNER PRINCIPAL CON SALUDO DINÁMICO */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-8 translate-y-8 pointer-events-none">
                                <span className="text-9xl">🍔</span>
                            </div>
                            <div className="relative z-10 max-w-xl mb-6">
                                <span className="bg-white/25 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                                    🚀 Delivery Express en Campus UPP
                                </span>
                                {/* Título dinámico según la hora del día y el nombre del usuario */}
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
                                    {getDynamicGreeting(auth?.user?.name)}
                                </h1>
                                <p className="text-xs lg:text-sm text-orange-100 font-medium">
                                    Pide tus antojos favoritos de las cafeterías del campus directamente a tu edificio o salón.
                                </p>
                            </div>

                            {/* Buscador central de fondo blanco con sombra (Sincronizado con searchQuery) */}
                            <div className="relative z-10 bg-white rounded-2xl p-4 shadow-xl flex items-center max-w-2xl text-gray-900">
                                <span className="pl-2 text-lg">🔍</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="¿Qué se te antoja hoy?"
                                    className="w-full bg-transparent border-0 focus:ring-0 px-3 py-2 text-xs lg:text-sm font-bold placeholder-gray-400 text-gray-900 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const catalogEl = document.getElementById('catalog-section');
                                        catalogEl?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition whitespace-nowrap"
                                >
                                    Buscar
                                </button>
                            </div>

                            {/* Subtexto: "📍 Campus UPP - Jagüey de Téllez" */}
                            <div className="relative z-10 mt-4 flex items-center gap-2 text-[11px] font-bold text-orange-100">
                                <span>📍 Campus UPP - Jagüey de Téllez</span>
                            </div>
                        </div>

                        {/* SECCIÓN DE GEOLOCALIZACIÓN Y SELECTOR DE ENTREGA */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-8 shadow-sm">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                                        📍 Dirección de Entrega en Campus UPP
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Usa tu ubicación GPS o indica tu edificio y aula exactos.</p>
                                </div>
                                
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {deliveryLocation.isConfirmed && (
                                        <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1.5 rounded-xl font-black flex items-center gap-1 shadow-sm whitespace-nowrap">
                                            🟢 Ubicación confirmada
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={deliveryLocation.requestGeolocation}
                                        disabled={deliveryLocation.loadingGeo}
                                        className="flex-1 md:flex-initial bg-orange-50 hover:bg-orange-100 text-[#FF5722] px-4 py-2.5 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                                    >
                                        {deliveryLocation.loadingGeo ? 'Obteniendo GPS...' : '📍 Usa tu ubicación actual'}
                                    </button>
                                </div>
                            </div>

                            {/* Input editable de entrega */}
                            <div className="relative">
                                <span className="absolute left-3.5 top-3.5 text-gray-400 text-sm">🏫</span>
                                <input
                                    type="text"
                                    value={deliveryLocation.locationText}
                                    onChange={(e) => deliveryLocation.updateReference(e.target.value)}
                                    placeholder="¿Dónde quieres recibir tu compra? (ej. Edificio 2 - Aula 104, Biblioteca, Canchas)"
                                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#FF5722] rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-gray-800 transition"
                                />
                            </div>
                        </div>

                        {/* 3. SECCIÓN DE CATEGORÍAS Y LOCALES */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-black text-gray-900">¿Necesitas algo más?</h2>
                                <span className="text-xs font-bold text-gray-400">Explora por categorías</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { id: 'Todos', label: '📱 Todo el Menú', color: 'from-purple-500 to-indigo-600', icon: '🍽️' },
                                    { id: 'Comida', label: '🍔 Comida Caliente', color: 'from-amber-500 to-orange-600', icon: '🔥' },
                                    { id: 'Snacks', label: '🍿 Snacks & Antojos', color: 'from-pink-500 to-rose-600', icon: '🍟' },
                                    { id: 'Bares', label: '🥤 Bebidas & Bares', color: 'from-emerald-500 to-teal-600', icon: '🧋' }
                                ].map(cat => (
                                    <div
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`cursor-pointer rounded-2xl p-4 flex flex-col justify-between items-start transition-all duration-300 transform active:scale-95 shadow-sm border ${
                                            selectedCategory === cat.id 
                                                ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-lg border-transparent scale-[1.02]' 
                                                : 'bg-white border-gray-100 hover:border-orange-200 text-gray-800 hover:shadow-md'
                                        }`}
                                    >
                                        <span className="text-2xl mb-2">{cat.icon}</span>
                                        <div>
                                            <p className="font-black text-xs lg:text-sm">{cat.label}</p>
                                            <p className={`text-[10px] font-semibold mt-0.5 ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                                                Disponibles hoy
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Título de Cafeterías en tu Campus */}
                        <div id="catalog-section" className="mb-6">
                            <h2 className="text-lg font-black text-gray-900">Cafeterías en tu Campus</h2>
                            <p className="text-xs text-gray-500">Locales y concesionarios activos en la UPP</p>
                        </div>

                        {uniqueRestaurants.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                <span className="text-5xl block mb-3">🔍</span>
                                <h3 className="font-black text-base text-gray-800">No se encontraron platillos o cafeterías que coincidan con la búsqueda.</h3>
                                <p className="text-xs text-gray-400 mt-1">Intenta con otro término de búsqueda o categoría.</p>
                            </div>
                        ) : (
                            uniqueRestaurants.map(restaurantName => {
                                const matchedRestaurant = restaurants.find(r => r.name === restaurantName);
                                const matchedProduct = filteredProducts.find(p => p.restaurant_name === restaurantName);
                                const restaurantDesc = matchedRestaurant?.description || matchedRestaurant?.address || matchedProduct?.restaurant_description || 'Concesionario Oficial UPP';
                                const actualName = matchedRestaurant?.name || restaurantName;

                                return (
                                    <div key={restaurantName} className="mb-12">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5722] flex items-center justify-center font-black text-base shadow-sm">
                                                    🏪
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-gray-900">
                                                        {actualName}
                                                    </h3>
                                                    <p className="text-[11px] text-gray-400 font-semibold">{restaurantDesc}</p>
                                                </div>
                                            </div>
                                            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-full font-black tracking-wide flex items-center gap-1 shadow-sm">
                                                🟢 Abierto Ahora
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {filteredProducts.filter(p => p.restaurant_name === restaurantName).map(product => (
                                                <div 
                                                    key={product.id} 
                                                    onClick={() => addToCart(product)}
                                                    className="bg-white border border-gray-100 p-5 rounded-3xl flex justify-between items-center gap-5 hover:border-[#FF5722]/50 hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer group shadow-sm"
                                                >
                                                    <div className="flex-1 flex flex-col justify-between h-28">
                                                        <div>
                                                            <h4 className="font-black text-gray-900 text-sm group-hover:text-[#FF5722] transition-colors">{product.name}</h4>
                                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                                                        </div>
                                                        <span className="font-black text-base text-[#FF5722]">${product.price.toFixed(2)} <span className="text-[10px] text-gray-400 font-normal">MXN</span></span>
                                                    </div>
                                                    <div className="relative">
                                                        <img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-2xl bg-gray-100 flex-shrink-0 shadow-inner group-hover:scale-105 transition duration-300" />
                                                        <div className="absolute -bottom-2 -right-2 bg-[#FF5722] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 transform group-hover:scale-110">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </main>

                    {/* Sidebar del Carrito Estilo Rappi */}
                    <aside id="cart-sidebar" className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200/80 p-6 flex flex-col justify-between sticky lg:top-[73px] h-[calc(100vh-73px)] shadow-sm">
                        <div className="overflow-y-auto flex-1 pr-1">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                                <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                                    🛒 Tu Pedido Actual
                                </h2>
                                <span className="bg-orange-50 text-[#FF5722] px-2.5 py-1 rounded-xl text-xs font-black">{totalItems} ítems</span>
                            </div>

                            {cart.length === 0 ? (
                                <div className="text-center py-24 px-4">
                                    <span className="text-5xl block mb-3 animate-bounce">🛒</span>
                                    <p className="text-xs font-bold text-gray-700">Tu carrito está vacío</p>
                                    <p className="text-[11px] text-gray-400 mt-1">Selecciona deliciosos platillos y agrégalos a tu pedido.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.product.id} className="flex justify-between items-center text-xs pb-4 border-b border-gray-100">
                                            <div className="flex-1 pr-2">
                                                <p className="font-extrabold text-gray-900">{item.product.name}</p>
                                                <p className="text-[#FF5722] font-black mt-0.5">${(item.product.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center bg-gray-100 rounded-2xl px-3 py-1.5 space-x-3 shadow-inner">
                                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -1); }} className="font-bold text-sm text-gray-600 hover:text-black">-</button>
                                                <span className="font-black text-black text-xs">{item.quantity}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, 1); }} className="font-bold text-sm text-gray-600 hover:text-black">+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-100 pt-5 bg-white">
                                <div className="flex justify-between font-black text-base mb-4 text-gray-900">
                                    <span>Total a pagar:</span>
                                    <span className="text-[#FF5722]">${cartTotal.toFixed(2)} MXN</span>
                                </div>
                                <button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="w-full py-4 bg-[#FF5722] hover:bg-[#F4511E] text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all duration-200 transform active:scale-95 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                                >
                                    <span>Proceder al Pago Seguro</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                {isCheckoutOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
                            <button 
                                onClick={() => setIsCheckoutOpen(false)} 
                                className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition"
                            >
                                ✕
                            </button>

                            <CheckoutForm
                                subtotalComida={cartTotal}
                                localId={activeLocalId}
                                itemsCarrito={cart}
                                initialDeliveryLocation={deliveryLocation.locationText}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
