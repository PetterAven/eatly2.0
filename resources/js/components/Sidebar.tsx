import { Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

interface SidebarProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly auth: {
        readonly user?: {
            readonly name: string;
            readonly email: string;
        };
    };
    readonly onSelectCategory?: (category: string) => void;
}

export default function Sidebar({
    isOpen,
    onClose,
    auth,
    onSelectCategory,
}: Readonly<SidebarProps>) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    if (!isOpen) return null;

    const userName = auth?.user?.name || 'Comensal UPP';
    const userInitial = userName.charAt(0).toUpperCase();
    const isAuthenticated = Boolean(auth?.user);
    const accountHref = isAuthenticated ? '/profile' : '/login';
    const settingsHref = isAuthenticated ? '/settings/profile' : '/login';

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const selectCategory = (category: string) => {
        if (onSelectCategory) {
            onSelectCategory(category);
        } else {
            router.visit('/login');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Fondo oscuro traslúcido de superposición (backdrop/overlay) que al hacer clic afuera cierre el menú */}
            <button
                type="button"
                aria-label="Cerrar menú lateral"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Barra lateral desplegable (Sidebar / Drawer) estilo Rappi */}
            <div className="absolute inset-y-0 left-0 z-10 flex w-80 transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out">
                {/* 1. HEADER: Logo de Eatly Eats + Botón de cerrar ✖️ arriba a la derecha */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5">
                    <Link
                        href={isAuthenticated ? '/dashboard' : '/'}
                        className="flex items-center gap-2"
                        onClick={onClose}
                    >
                        <span className="text-xl font-black tracking-tight text-gray-900">
                            Eatly <span className="text-[#FF5722]">Eats</span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700 shadow-sm transition hover:bg-gray-200"
                        aria-label="Cerrar menú"
                    >
                        ×
                    </button>
                </div>

                {/* CONTENIDO SCROLLABLE */}
                <div className="flex-1 space-y-6 overflow-y-auto p-5">
                    {/* PERFIL USUARIO: Avatar con inicial + "Hola, {auth.user.name}" */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={accountHref}
                            onClick={onClose}
                            className="group flex flex-1 items-center gap-3.5 rounded-2xl border border-orange-100 bg-orange-50/60 p-3 transition hover:bg-orange-100/80"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF5722] text-base font-black text-white shadow-md transition group-hover:scale-105">
                                {userInitial}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-extrabold tracking-wider text-orange-600 uppercase">
                                    Mi Cuenta
                                </p>
                                <h4 className="truncate text-sm font-black text-gray-900">
                                    Hola, {userName}
                                 </h4>
                            </div>
                        </Link>
                        <Link
                            href={settingsHref}
                            onClick={onClose}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-lg shadow-sm transition hover:bg-gray-50 hover:text-[#FF5722]"
                            title="Ajustes"
                        >
                            
                        </Link>
                    </div>

                    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
                        <div className="relative z-10 mb-3">
                            <span className="mb-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                                Promoción UPP
                            </span>
                            <h4 className="text-xs leading-snug font-black">
                                Descubre nuestras promociones del campus
                            </h4>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                selectCategory('Todos');
                            }}
                            className="relative z-10 w-full rounded-xl bg-white py-2 text-center text-[11px] font-black tracking-wider text-blue-700 uppercase shadow-sm transition hover:bg-blue-50"
                        >
                            Ver Promociones
                        </button>
                    </div>

                    {/* GRUPOS DE MENÚ Y RUTAS FUNCIONALES */}

                    {/* • SECCIONES */}
                    <div className="space-y-1">
                        <p className="mb-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                            Secciones del Campus
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                selectCategory('Comida');
                            }}
                            className="group flex w-full items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Cafeterías y restaurantes
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                selectCategory('Snacks');
                            }}
                            className="group flex w-full items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Snacks y botanas
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                selectCategory('Bares');
                            }}
                            className="group flex w-full items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Bebidas
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                selectCategory('Comida');
                            }}
                            className="group flex w-full items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Pedidos express
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </button>
                    </div>

                    {/* • PROMOCIONES Y CRÉDITOS */}
                    <div className="space-y-1">
                        <p className="mb-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                            Créditos & Monedero
                        </p>
                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-3 text-xs">
                            <span className="flex items-center gap-2 font-bold text-gray-700">
                                Créditos Eatly
                            </span>
                            <span className="font-black text-[#FF5722]">
                                $ 0.00 MXN
                            </span>
                        </div>
                    </div>

                    {/* • TU PERFIL */}
                    <div className="space-y-1">
                        <p className="mb-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                            Tu Perfil
                        </p>

                        <Link
                            href={accountHref}
                            onClick={onClose}
                            className="group flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Información de mi cuenta
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setShowPaymentModal(true)}
                            className="group flex w-full items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Métodos de pago
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </button>

                        <Link
                            href={isAuthenticated ? '/historial' : '/login'}
                            onClick={onClose}
                            className="group flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Últimas órdenes
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </Link>
                    </div>

                    {/* • OTROS */}
                    <div className="space-y-1 border-t border-gray-100 pt-2">
                        <p className="mb-2 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                            Aliados UPP
                        </p>

                        <Link
                            href="/vendor/register"
                            onClick={onClose}
                            className="group flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Registrar cafetería
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </Link>

                        <Link
                            href="/register"
                            onClick={onClose}
                            className="group flex items-center justify-between rounded-2xl p-3 text-xs font-bold text-gray-800 transition hover:bg-orange-50"
                        >
                            <span className="flex items-center gap-2">
                                Quiero ser repartidor UPP
                            </span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">
                                &gt;
                            </span>
                        </Link>

                        <form onSubmit={handleLogout} className="pt-2">
                            <button
                                type="submit"
                                className="group flex w-full items-center justify-between rounded-2xl p-3 text-left text-xs font-bold text-red-600 transition hover:bg-red-50"
                            >
                                <span className="flex items-center gap-2">
                                    Cerrar sesión
                                </span>
                                <span className="text-red-400 group-hover:text-red-600">
                                    &gt;
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal de Métodos de Pago */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                        >
                            ✕
                        </button>

                        <div className="space-y-4 pt-2 text-center">
                            <h3 className="text-base font-black text-gray-900">
                                Métodos de pago registrados
                            </h3>
                            <p className="text-xs text-gray-500">
                                Actualmente tienes configurado efectivo contra
                                entrega y pasarela de prueba Eatly Sandbox.
                            </p>

                            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-3 text-left text-xs font-bold text-gray-800">
                                <span>Efectivo en campus UPP</span>
                                <span className="text-[10px] text-emerald-600">
                                    Predeterminado
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPaymentModal(false)}
                                className="w-full rounded-xl bg-[#FF5722] py-3 text-xs font-black tracking-wider text-white uppercase"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
