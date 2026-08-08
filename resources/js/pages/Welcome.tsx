import Sidebar from '@/components/Sidebar';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface CafeBranch {
    id: number;
    name: string;
    location?: string;
    phone?: string;
    schedule?: string;
    image?: string | null;
    [key: string]: unknown;
}

interface WelcomeProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    branches?: CafeBranch[];
}

export default function Welcome({ auth, branches = [] }: Readonly<WelcomeProps>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        if (branches.length <= 6) return;

        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 6) >= branches.length ? 0 : prev + 6);
                setFade(true);
            }, 300);
        }, 15000); // 15 seconds rotation interval

        return () => clearInterval(interval);
    }, [branches.length]);

    const getVisibleBranches = () => {
        if (branches.length <= 6) return branches;
        const visible = [];
        for (let i = 0; i < 6; i++) {
            const index = (currentIndex + i) % branches.length;
            visible.push(branches[index]);
        }
        return visible;
    };

    const cafeList = getVisibleBranches();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

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
                        <Link href="/" className="flex items-center gap-2">
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
                                <p className="font-black text-gray-900">
                                    Campus UPP - Jagüey de Téllez
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enlaces a la derecha */}
                    <div className="flex items-center space-x-3">
                        {auth?.user ? (
                            <>
                                <Link
                                    href="/historial"
                                    className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    Mis pedidos
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    Mi cuenta
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="rounded-2xl bg-[#FF5722] px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[#F4511E]"
                                >
                                    Ir al Menú
                                </Link>
                                <button
                                    type="button"
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
                                    className="rounded-2xl px-4 py-2.5 text-xs font-black tracking-wider text-gray-700 uppercase transition hover:bg-gray-100"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-2xl bg-[#FF5722] px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md transition hover:bg-[#F4511E]"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                {/* MENÚ LATERAL ESTILO RAPPI */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    auth={auth ?? {}}
                />

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
                    {/* HERO BANNER */}
                    <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white shadow-xl lg:p-12">
                        <div className="relative z-10 mb-6 max-w-xl">
                            <span className="mb-3 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                                Delivery express en campus UPP
                            </span>
                            <h1 className="mb-3 text-3xl font-black tracking-tight lg:text-5xl">
                                Si tienes Eatly Eats, tienes Todo.
                            </h1>
                            <p className="text-xs font-medium text-orange-100 lg:text-sm">
                                Ordena tus platillos favoritos de las cafeterías
                                del campus sin hacer filas eternas.
                            </p>
                        </div>

                        {/* Buscador */}
                        <div className="relative z-10 flex max-w-2xl items-center rounded-2xl bg-white p-4 text-gray-900 shadow-xl">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="¿Qué se te antoja hoy?"
                                className="w-full border-0 bg-transparent px-3 py-2 text-xs font-bold text-gray-900 placeholder-gray-400 outline-none focus:ring-0 lg:text-sm"
                            />
                            <Link
                                href={auth?.user ? '/dashboard' : '/login'}
                                className="rounded-xl bg-[#FF5722] px-5 py-2.5 text-center text-xs font-black tracking-wider whitespace-nowrap text-white uppercase shadow-md transition hover:bg-[#F4511E]"
                            >
                                Buscar
                            </Link>
                        </div>

                        <div className="relative z-10 mt-4 flex items-center gap-2 text-[11px] font-bold text-orange-100">
                            <span>Campus UPP - Jagüey de Téllez</span>
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
                                    Ubicaciones y horarios oficiales en la UPP ({branches.length} locales registrados)
                                </p>
                            </div>
                        </div>

                        <div className={`grid gap-6 md:grid-cols-2 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                            {cafeList.map((cafe: CafeBranch) => (
                                <div
                                    key={cafe.id}
                                    className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg md:flex-row"
                                >
                                    <div className="relative flex h-48 items-center justify-center bg-orange-50 md:h-auto md:w-1/2">
                                        {cafe.image ? (
                                            <img
                                                src={cafe.image}
                                                alt={cafe.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-orange-700">
                                                Imagen pendiente
                                            </span>
                                        )}
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
                                                    </span>{' '}
                                                    {cafe.location ||
                                                        'Campus UPP'}
                                                </p>
                                                <p className="flex items-center">
                                                    <span className="mr-1.5 font-semibold text-gray-900">
                                                    </span>{' '}
                                                    {cafe.phone ||
                                                        '771 555 1001'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                            <span className="rounded-xl border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                                {cafe.schedule || 'Abierto hoy'}
                                            </span>
                                            <Link
                                                href={
                                                    auth?.user
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
                        {cafeList.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                                <h3 className="text-base font-black text-gray-900">
                                    Aún no hay cafeterías registradas
                                </h3>
                                <p className="mt-2 text-xs text-gray-500">
                                    Cuando una cafetería se registre en Eatly Eats aparecerá aquí.
                                </p>
                                <Link
                                    href="/vendor/register"
                                    className="mt-5 inline-flex rounded-xl bg-[#FF5722] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#F4511E]"
                                >
                                    Registrar cafetería
                                </Link>
                            </div>
                        )}
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
