import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu, Settings, X } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';
import { SharedData } from '@/types';

export default function EatlySettingsLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;
    const [menuOpen, setMenuOpen] = useState(false);

    const userName = auth?.user?.name || 'Comensal';
    const userInitial = userName.charAt(0).toUpperCase();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
            {/* Header unificado */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5 shadow-sm">
                <div className="flex items-center space-x-3">
                    {/* Botón hamburguesa desplegable para navegar entre ajustes */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-gray-200"
                            aria-label="Menú de ajustes"
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        {menuOpen && (
                            <div className="absolute top-12 left-0 z-50 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                                    Navegación de Ajustes
                                </p>
                                <Link
                                    href="/settings/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="block rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    👤 Perfil
                                </Link>
                                <Link
                                    href="/settings/password"
                                    onClick={() => setMenuOpen(false)}
                                    className="block rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    🔒 Contraseña
                                </Link>
                                <Link
                                    href="/settings/two-factor"
                                    onClick={() => setMenuOpen(false)}
                                    className="block rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    🛡️ Verificación en dos pasos
                                </Link>
                                <Link
                                    href="/settings/appearance"
                                    onClick={() => setMenuOpen(false)}
                                    className="block rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-orange-50 hover:text-[#FF5722]"
                                >
                                    🎨 Apariencia
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                            Eatly <span className="text-[#FF5722]">Eats</span> 🐴
                        </span>
                    </Link>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-gray-700 transition duration-200 hover:bg-orange-50 hover:text-[#FF5722]"
                    >
                        🍽️ Menú / Catálogo
                    </Link>

                    <Link
                        href="/profile"
                        className="group flex items-center gap-2"
                        title="Mi Cuenta"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-100 bg-white font-bold text-orange-600 shadow-md transition group-hover:scale-105">
                            {userInitial}
                        </div>
                    </Link>

                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-1 rounded-2xl bg-orange-50 px-3.5 py-2.5 text-xs font-bold text-[#FF5722] transition duration-200 hover:bg-orange-100"
                        title="Ajustes"
                    >
                        <Settings className="h-4 w-4" /> Ajustes
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 rounded-2xl px-3 py-2 text-xs font-bold text-red-600 transition duration-200 hover:bg-red-50"
                    >
                        <LogOut className="h-3.5 w-3.5" /> Salir
                    </button>
                </div>
            </header>

            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 pb-24">
                {/* Banner de Sección */}
                <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-xl">
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                            ⚙️ Configuración de Cuenta
                        </span>
                        <h1 className="text-2xl font-black tracking-tight lg:text-3xl">
                            Ajustes y Perfil 🐴
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Administra tu información personal, contraseña y preferencias de seguridad.
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-sm">
                    {children}
                </div>
            </main>
        </div>
    );
}
