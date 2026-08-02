import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

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

            <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
                {/* 3. NAVBAR SUPERIOR */}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5 shadow-sm">
                    <div className="flex items-center space-x-4">
                        {/* Botón ☰ a la izquierda para abrir el sidebar */}
                        <button
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
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-gray-900">
                                Eatly{' '}
                                <span className="text-[#FF5722]">Eats</span> 🐴
                            </span>
                        </Link>

                        {/* Selector de ubicación */}
                        <div className="hidden cursor-pointer items-center gap-2 rounded-2xl bg-gray-100/85 px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 md:flex">
                            <span className="text-base">📍</span>
                            <div>
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase">
                                    Entrega en
                                </p>
                                <p className="font-black text-gray-900">
                                    Campus UPP - Jagüey de Téllez
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Barra de búsqueda central en navbar */}
                    <div className="relative mx-8 hidden max-w-md flex-1 items-center lg:flex">
                        <span className="absolute left-3.5 text-gray-400">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Comida, cafeterías, platillos..."
                            className="w-full rounded-2xl border-0 bg-gray-100 py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-800 transition focus:bg-white focus:ring-2 focus:ring-[#FF5722]"
                        />
                    </div>

                    {/* Enlaces a la derecha */}
                    <div className="flex items-center space-x-3">
                        {auth.user ? (
                            <>
                                <Link
                                    href="/historial"
                                    className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    📋 Mis Pedidos
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    ⚙️ Mi Cuenta
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="rounded-2xl bg-[#FF5722] px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[#F4511E]"
                                >
                                    Ir al Menú
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-2xl px-3 py-2 text-xs font-bold text-red-600 transition duration-200 hover:bg-red-50"
                                >
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-700 transition duration-200 hover:text-[#FF5722]"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-2xl bg-[#FF5722] px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[#F4511E]"
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
                        <div className="absolute inset-y-0 left-0 flex w-full max-w-xs transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out">
                            {/* Cabecera del Sidebar */}
                            <div className="flex items-center justify-between border-b border-gray-100 p-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black tracking-tight text-gray-900">
                                        Eatly{' '}
                                        <span className="text-[#FF5722]">
                                            Eats
                                        </span>{' '}
                                        🐴
                                    </span>
                                </div>
                                {/* Botón de cerrar (✖) arriba a la derecha del sidebar */}
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600 transition hover:bg-gray-200"
                                    aria-label="Cerrar menú"
                                >
                                    ✖
                                </button>
                            </div>

                            {/* Contenido del Sidebar */}
                            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                                {/* Enlaces de sesión/perfil: "Mi Perfil", "Mis Pedidos", "Cerrar Sesión" */}
                                <div className="space-y-1">
                                    <p className="mb-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                                        Mi Cuenta UPP
                                    </p>
                                    {auth.user ? (
                                        <>
                                            <Link
                                                href="/profile"
                                                onClick={() =>
                                                    setIsSidebarOpen(false)
                                                }
                                                className="flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                                            >
                                                <span>Mi Perfil</span>
                                                <span className="text-gray-400">
                                                    &gt;
                                                </span>
                                            </Link>
                                            <Link
                                                href="/historial"
                                                onClick={() =>
                                                    setIsSidebarOpen(false)
                                                }
                                                className="flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                                            >
                                                <span>Mis Pedidos</span>
                                                <span className="text-gray-400">
                                                    &gt;
                                                </span>
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    setIsSidebarOpen(false);
                                                    handleLogout(e);
                                                }}
                                                className="flex w-full items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-red-600 transition hover:bg-red-50"
                                            >
                                                <span>Cerrar Sesión</span>
                                                <span className="text-red-400">
                                                    &gt;
                                                </span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() =>
                                                    setIsSidebarOpen(false)
                                                }
                                                className="flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                                            >
                                                <span>Iniciar Sesión</span>
                                                <span className="text-gray-400">
                                                    &gt;
                                                </span>
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() =>
                                                    setIsSidebarOpen(false)
                                                }
                                                className="flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                                            >
                                                <span>Registrarse</span>
                                                <span className="text-gray-400">
                                                    &gt;
                                                </span>
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Una tarjeta destacada: "🎁 Descubre las promociones de la UPP" */}
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white shadow-md">
                                    <div className="absolute right-2 bottom-2 text-3xl opacity-25">
                                        🎁
                                    </div>
                                    <h4 className="mb-1 text-sm font-black">
                                        🎁 Descubre las promociones de la UPP
                                    </h4>
                                    <p className="text-[11px] text-orange-100">
                                        Descuentos exclusivos en cafeterías del
                                        campus para estudiantes y profesores.
                                    </p>
                                </div>

                                {/* Lista de secciones con flechas (>): "Cafeterías en Campus", "Snacks & Botanas", "Bebidas", "Pedidos Express" */}
                                <div className="space-y-1">
                                    <p className="mb-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                                        Secciones del Campus
                                    </p>
                                    {[
                                        {
                                            label: 'Cafeterías en Campus',
                                            href: '#cafes',
                                        },
                                        {
                                            label: 'Snacks & Botanas',
                                            href: '#cafes',
                                        },
                                        { label: 'Bebidas', href: '#cafes' },
                                        {
                                            label: 'Pedidos Express',
                                            href: auth.user
                                                ? '/dashboard'
                                                : '/login',
                                        },
                                    ].map((sec, idx) => (
                                        <a
                                            key={idx}
                                            href={sec.href}
                                            onClick={() =>
                                                setIsSidebarOpen(false)
                                            }
                                            className="flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                                        >
                                            <span>{sec.label}</span>
                                            <span className="text-gray-400">
                                                &gt;
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
                    {/* 2. HERO BANNER PRINCIPAL */}
                    <div className="relative mb-12 flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white shadow-xl">
                        <div className="pointer-events-none absolute right-0 bottom-0 translate-x-8 translate-y-8 transform opacity-15">
                            <span className="text-9xl">🍔</span>
                        </div>
                        <div className="relative z-10 mb-6 max-w-xl">
                            <span className="mb-3 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                                🚀 Delivery Express en Campus UPP
                            </span>
                            {/* Título blanco: "Si tienes Eatly Eats, tienes Todo." */}
                            <h1 className="mb-3 text-3xl font-black tracking-tight lg:text-5xl">
                                Si tienes Eatly Eats, tienes Todo.
                            </h1>
                            <p className="text-xs font-medium text-orange-100 lg:text-sm">
                                Ordena tus platillos favoritos de las cafeterías
                                del campus sin hacer filas eternas.
                            </p>
                        </div>

                        {/* Buscador central de fondo blanco con sombra (rounded-2xl p-4 shadow-xl) y el placeholder "¿Qué se te antoja hoy?" */}
                        <div className="relative z-10 flex max-w-2xl items-center rounded-2xl bg-white p-4 text-gray-900 shadow-xl">
                            <span className="pl-2 text-lg">🔍</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="¿Qué se te antoja hoy?"
                                className="w-full border-0 bg-transparent px-3 py-2 text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:ring-0 lg:text-sm"
                            />
                            <Link
                                href={auth.user ? '/dashboard' : '/login'}
                                className="rounded-xl bg-[#FF5722] px-5 py-2.5 text-center text-xs font-black tracking-wider whitespace-nowrap text-white uppercase shadow-md transition hover:bg-[#F4511E]"
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
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">
                                    Cafeterías en tu Campus
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Ubicaciones y horarios oficiales en la UPP
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {cafeList.map((cafe: CafeBranch) => (
                                <div
                                    key={cafe.id}
                                    className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg md:flex-row"
                                >
                                    <div className="relative h-48 md:h-auto md:w-1/2">
                                        <img
                                            src={cafe.image}
                                            alt={cafe.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between p-6 md:w-1/2">
                                        <div>
                                            <span className="mb-1 block text-[10px] font-black tracking-wider text-[#FF5722] uppercase">
                                                Establecimiento Oficial
                                            </span>
                                            <h3 className="mb-3 text-base font-black text-gray-900">
                                                {cafe.name}
                                            </h3>

                                            <div className="space-y-2 text-xs text-gray-600">
                                                <p className="flex items-start">
                                                    <span className="mr-1.5 font-semibold text-gray-900">
                                                        📍
                                                    </span>{' '}
                                                    {cafe.location ||
                                                        'Campus UPP'}
                                                </p>
                                                <p className="flex items-center">
                                                    <span className="mr-1.5 font-semibold text-gray-900">
                                                        📞
                                                    </span>{' '}
                                                    {cafe.phone ||
                                                        '771 555 1234'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                            <span className="rounded-xl border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                                🟢{' '}
                                                {cafe.schedule || 'Abierto Hoy'}
                                            </span>
                                            <Link
                                                href={
                                                    auth.user
                                                        ? '/dashboard'
                                                        : '/login'
                                                }
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
                <footer className="border-t border-gray-800 bg-gray-900 py-8 text-center text-xs text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} Eatly Eats UPP. Todos
                        los derechos reservados.
                    </p>
                </footer>
            </div>
        </>
    );
}
