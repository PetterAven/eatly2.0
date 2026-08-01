import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface CafeBranch {
    id: number;
    name: string;
    location: string;
    phone: string;
    image: string;
    schedule: string;
}

interface WelcomeProps {
    auth: {
        user?: {
            name: string;
            email: string;
        };
    };
    branches?: CafeBranch[];
}

export default function Welcome({ auth, branches = [] }: WelcomeProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const defaultCafes: CafeBranch[] = [
        {
            id: 1,
            name: 'Cafetería Central UPP',
            location: 'Edificio de Servicios Estudiantiles, Planta Baja',
            phone: '771 555 1234 ext. 101',
            schedule: 'Lunes a Viernes - 7:00 AM a 6:00 PM',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 2,
            name: 'Snack Bar El Potro',
            location: 'Anexo al Edificio de Laboratorios Pesados',
            phone: '771 555 1234 ext. 102',
            schedule: 'Lunes a Viernes - 8:00 AM a 4:00 PM',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        },
    ];

    const cafeList = branches.length > 0 ? branches : defaultCafes;

    return (
        <>
            <Head title="Eatly Eats - Campus UPP" />
            
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
                
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
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-gray-900">Eatly <span className="text-[#FF5722]">Eats</span> 🐴</span>
                        </Link>
                        
                        {/* Selector de ubicación */}
                        <div className="hidden md:flex items-center gap-2 bg-gray-100/85 hover:bg-gray-100 px-3.5 py-2 rounded-2xl text-xs font-bold text-gray-700 cursor-pointer transition">
                            <span className="text-base">📍</span>
                            <div>
                                <p className="text-[10px] text-gray-400 font-extrabold uppercase">Entrega en</p>
                                <p className="text-gray-900 font-black">Campus UPP - Jagüey de Téllez</p>
                            </div>
                        </div>
                    </div>

                    {/* Barra de búsqueda central en navbar */}
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

                    {/* Enlaces a la derecha */}
                    <div className="flex items-center space-x-3">
                        {auth.user ? (
                            <>
                                <Link 
                                    href="/historial" 
                                    className="text-xs font-extrabold text-gray-700 hover:text-[#FF5722] hover:bg-orange-50 px-3.5 py-2.5 rounded-2xl transition duration-200 flex items-center gap-1.5"
                                >
                                    📋 Mis Pedidos
                                </Link>
                                <Link 
                                    href="/profile" 
                                    className="text-xs font-extrabold text-gray-700 hover:text-[#FF5722] hover:bg-orange-50 px-3.5 py-2.5 rounded-2xl transition duration-200 flex items-center gap-1.5"
                                >
                                    ⚙️ Mi Cuenta
                                </Link>
                                <Link 
                                    href="/dashboard" 
                                    className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-4 py-2.5 rounded-2xl font-black text-xs transition shadow-md"
                                >
                                    Ir al Menú
                                </Link>
                                <button onClick={handleLogout} className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-2xl transition duration-200">Salir</button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    className="text-xs font-bold text-gray-700 hover:text-[#FF5722] px-4 py-2.5 rounded-2xl transition duration-200"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-4 py-2.5 rounded-2xl font-black text-xs transition shadow-md"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                {/* 1. MENÚ LATERAL DESPLEGABLE (SIDEBAR / DRAWER) */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        {/* Fondo oscuro traslúcido (backdrop/overlay) que cierre el menú al hacer clic fuera */}
                        <div 
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        
                        {/* Barra lateral desplegable desde la izquierda */}
                        <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                            {/* Cabecera del Sidebar */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black tracking-tight text-gray-900">Eatly <span className="text-[#FF5722]">Eats</span> 🐴</span>
                                </div>
                                {/* Botón de cerrar (✖) arriba a la derecha del sidebar */}
                                <button 
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition"
                                    aria-label="Cerrar menú"
                                >
                                    ✖
                                </button>
                            </div>

                            {/* Contenido del Sidebar */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                
                                {/* Enlaces de sesión/perfil: "Mi Perfil", "Mis Pedidos", "Cerrar Sesión" */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Mi Cuenta UPP</p>
                                    {auth.user ? (
                                        <>
                                            <Link 
                                                href="/profile" 
                                                onClick={() => setIsSidebarOpen(false)}
                                                className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition"
                                            >
                                                <span>Mi Perfil</span>
                                                <span className="text-gray-400">&gt;</span>
                                            </Link>
                                            <Link 
                                                href="/historial" 
                                                onClick={() => setIsSidebarOpen(false)}
                                                className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition"
                                            >
                                                <span>Mis Pedidos</span>
                                                <span className="text-gray-400">&gt;</span>
                                            </Link>
                                            <button 
                                                onClick={(e) => { setIsSidebarOpen(false); handleLogout(e); }} 
                                                className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 text-xs font-bold text-red-600 transition"
                                            >
                                                <span>Cerrar Sesión</span>
                                                <span className="text-red-400">&gt;</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link 
                                                href="/login" 
                                                onClick={() => setIsSidebarOpen(false)}
                                                className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition"
                                            >
                                                <span>Iniciar Sesión</span>
                                                <span className="text-gray-400">&gt;</span>
                                            </Link>
                                            <Link 
                                                href="/register" 
                                                onClick={() => setIsSidebarOpen(false)}
                                                className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition"
                                            >
                                                <span>Registrarse</span>
                                                <span className="text-gray-400">&gt;</span>
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Una tarjeta destacada: "🎁 Descubre las promociones de la UPP" */}
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                                    <div className="absolute right-2 bottom-2 text-3xl opacity-25">🎁</div>
                                    <h4 className="font-black text-sm mb-1">🎁 Descubre las promociones de la UPP</h4>
                                    <p className="text-[11px] text-orange-100">Descuentos exclusivos en cafeterías del campus para estudiantes y profesores.</p>
                                </div>

                                {/* Lista de secciones con flechas (>): "Cafeterías en Campus", "Snacks & Botanas", "Bebidas", "Pedidos Express" */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Secciones del Campus</p>
                                    {[
                                        { label: 'Cafeterías en Campus', href: '#cafes' },
                                        { label: 'Snacks & Botanas', href: '#cafes' },
                                        { label: 'Bebidas', href: '#cafes' },
                                        { label: 'Pedidos Express', href: auth.user ? '/dashboard' : '/login' }
                                    ].map((sec, idx) => (
                                        <a 
                                            key={idx}
                                            href={sec.href}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition"
                                        >
                                            <span>{sec.label}</span>
                                            <span className="text-gray-400">&gt;</span>
                                        </a>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
                    
                    {/* 2. HERO BANNER PRINCIPAL */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 mb-12 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-8 translate-y-8 pointer-events-none">
                            <span className="text-9xl">🍔</span>
                        </div>
                        <div className="relative z-10 max-w-xl mb-6">
                            <span className="bg-white/25 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                                🚀 Delivery Express en Campus UPP
                            </span>
                            {/* Título blanco: "Si tienes Eatly Eats, tienes Todo." */}
                            <h1 className="text-3xl lg:text-5xl font-black tracking-tight mb-3">
                                Si tienes Eatly Eats, tienes Todo.
                            </h1>
                            <p className="text-xs lg:text-sm text-orange-100 font-medium">
                                Ordena tus platillos favoritos de las cafeterías del campus sin hacer filas eternas.
                            </p>
                        </div>

                        {/* Buscador central de fondo blanco con sombra (rounded-2xl p-4 shadow-xl) y el placeholder "¿Qué se te antoja hoy?" */}
                        <div className="relative z-10 bg-white rounded-2xl p-4 shadow-xl flex items-center max-w-2xl text-gray-900">
                            <span className="pl-2 text-lg">🔍</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="¿Qué se te antoja hoy?"
                                className="w-full bg-transparent border-0 focus:ring-0 px-3 py-2 text-xs lg:text-sm font-bold placeholder-gray-400 text-gray-900 outline-none"
                            />
                            <Link 
                                href={auth.user ? "/dashboard" : "/login"}
                                className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition text-center whitespace-nowrap"
                            >
                                Buscar
                            </Link>
                        </div>

                        {/* Subtexto: "📍 Campus UPP - Jagüey de Téllez" */}
                        <div className="relative z-10 mt-4 flex items-center gap-2 text-[11px] font-bold text-orange-100">
                            <span>📍 Campus UPP - Jagüey de Téllez</span>
                        </div>
                    </div>

                    {/* SECCIÓN DE CAFETERÍAS */}
                    <section id="cafes" className="mb-12">
                        <div className="mb-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Cafeterías en tu Campus</h2>
                                <p className="text-xs text-gray-500">Ubicaciones y horarios oficiales en la UPP</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {cafeList.map((cafe: CafeBranch) => (
                                <div key={cafe.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row transition hover:shadow-lg">
                                    <div className="md:w-1/2 h-48 md:h-auto relative">
                                        <img 
                                            src={cafe.image} 
                                            alt={cafe.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between p-6 md:w-1/2">
                                        <div>
                                            <span className="text-[10px] font-black text-[#FF5722] tracking-wider uppercase block mb-1">Establecimiento Oficial</span>
                                            <h3 className="text-base font-black text-gray-900 mb-3">{cafe.name}</h3>
                                            
                                            <div className="text-xs text-gray-600 space-y-2">
                                                <p className="flex items-start">
                                                    <span className="font-semibold text-gray-900 mr-1.5">📍</span> {cafe.location || 'Campus UPP'}
                                                </p>
                                                <p className="flex items-center">
                                                    <span className="font-semibold text-gray-900 mr-1.5">📞</span> {cafe.phone || '771 555 1234'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-xl">
                                                🟢 {cafe.schedule || 'Abierto Hoy'}
                                            </span>
                                            <Link 
                                                href={auth.user ? "/dashboard" : "/login"}
                                                className="text-xs font-black text-[#FF5722] hover:underline"
                                            >
                                                Ver Menú &gt;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="bg-gray-900 text-gray-400 py-8 text-center text-xs border-t border-gray-800">
                    <p>&copy; {new Date().getFullYear()} Eatly Eats UPP. Todos los derechos reservados.</p>
                </footer>
            </div>
        </>
    );
}
