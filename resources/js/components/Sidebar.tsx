import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    auth: {
        user?: {
            name: string;
            email: string;
        };
    };
    onSelectCategory?: (category: string) => void;
}

export default function Sidebar({ isOpen, onClose, auth, onSelectCategory }: SidebarProps) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    if (!isOpen) return null;

    const userName = auth?.user?.name || 'Comensal UPP';
    const userInitial = userName.charAt(0).toUpperCase();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Fondo oscuro traslúcido de superposición (backdrop/overlay) que al hacer clic afuera cierre el menú */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Barra lateral desplegable (Sidebar / Drawer) estilo Rappi */}
            <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-10">
                
                {/* 1. HEADER: Logo de Eatly Eats + Botón de cerrar ✖️ arriba a la derecha */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                        <span className="text-xl font-black tracking-tight text-gray-900">Eatly <span className="text-[#FF5722]">Eats</span> 🐴</span>
                    </Link>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold transition shadow-sm"
                        aria-label="Cerrar menú"
                    >
                        ✖️
                    </button>
                </div>

                {/* CONTENIDO SCROLLABLE */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">

                    {/* PERFIL USUARIO: Avatar con inicial + "Hola, {auth.user.name}" */}
                    <Link 
                        href="/profile" 
                        onClick={onClose}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-orange-50/60 hover:bg-orange-100/80 border border-orange-100 transition group"
                    >
                        <div className="bg-[#FF5722] text-white rounded-full w-11 h-11 flex items-center justify-center font-black text-base shadow-md group-hover:scale-105 transition">
                            {userInitial}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">Mi Cuenta</p>
                            <h4 className="font-black text-sm text-gray-900 truncate">Hola, {userName}</h4>
                        </div>
                    </Link>

                    {/* CARD DESTACADA: Botón azul "⚽ Descubre nuestras promociones del Campus" */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-2 bottom-2 text-4xl opacity-20">⚽</div>
                        <div className="relative z-10 mb-3">
                            <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-2 inline-block">
                                Promoción UPP
                            </span>
                            <h4 className="font-black text-xs leading-snug">⚽ Descubre nuestras promociones del Campus</h4>
                        </div>
                        <button 
                            onClick={() => {
                                if (onSelectCategory) onSelectCategory('Todos');
                                onClose();
                            }}
                            className="relative z-10 w-full py-2 bg-white text-blue-700 hover:bg-blue-50 font-black rounded-xl text-[11px] uppercase tracking-wider transition shadow-sm text-center"
                        >
                            Ver Promociones
                        </button>
                    </div>

                    {/* GRUPOS DE MENÚ Y RUTAS FUNCIONALES */}

                    {/* • SECCIONES */}
                    <div className="space-y-1">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Secciones del Campus</p>
                        
                        <button 
                            onClick={() => { if (onSelectCategory) onSelectCategory('Comida'); onClose(); }}
                            className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">🍽️ Cafeterías / Restaurantes</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </button>

                        <button 
                            onClick={() => { if (onSelectCategory) onSelectCategory('Snacks'); onClose(); }}
                            className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">🍿 Snacks & Botanas</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </button>

                        <button 
                            onClick={() => { if (onSelectCategory) onSelectCategory('Bares'); onClose(); }}
                            className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">🥤 Bebidas</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </button>

                        <button 
                            onClick={() => { if (onSelectCategory) onSelectCategory('Comida'); onClose(); }}
                            className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">⚡ Pedidos Express</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </button>
                    </div>

                    {/* • PROMOCIONES Y CRÉDITOS */}
                    <div className="space-y-1">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Créditos & Monedero</p>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                            <span className="font-bold text-gray-700 flex items-center gap-2">💰 Créditos Eatly</span>
                            <span className="font-black text-[#FF5722]">$ 0.00 MXN</span>
                        </div>
                    </div>

                    {/* • TU PERFIL */}
                    <div className="space-y-1">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Tu Perfil</p>

                        <Link 
                            href="/profile" 
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">⚙️ Información de mi cuenta</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </Link>

                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">💳 Métodos de pago</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </button>

                        <Link 
                            href="/historial" 
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">📦 Últimas órdenes</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </Link>
                    </div>

                    {/* • OTROS */}
                    <div className="space-y-1 pt-2 border-t border-gray-100">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Aliados UPP</p>

                        <Link 
                            href="/vendor/register" 
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">🏪 Registra tu cafetería</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </Link>

                        <Link 
                            href="/register" 
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 text-xs font-bold text-gray-800 transition group"
                        >
                            <span className="flex items-center gap-2">🛵 Quiero ser Repartidor UPP</span>
                            <span className="text-gray-400 group-hover:text-[#FF5722]">&gt;</span>
                        </Link>

                        <form onSubmit={handleLogout} className="pt-2">
                            <button 
                                type="submit"
                                className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 text-xs font-bold text-red-600 transition group"
                            >
                                <span className="flex items-center gap-2">🚪 Cerrar sesión</span>
                                <span className="text-red-400 group-hover:text-red-600">&gt;</span>
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Modal de Métodos de Pago */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-gray-100">
                        <button 
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>
                        
                        <div className="text-center space-y-4 pt-2">
                            <span className="text-4xl block">💳</span>
                            <h3 className="font-black text-base text-gray-900">Métodos de Pago Registrados</h3>
                            <p className="text-xs text-gray-500">Actualmente tienes configurado efectivo contra entrega y pasarela de prueba Eatly Sandbox.</p>
                            
                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-left text-xs font-bold text-gray-800 flex items-center justify-between">
                                <span>💵 Efectivo en Campus UPP</span>
                                <span className="text-emerald-600 text-[10px]">Predeterminado</span>
                            </div>

                            <button 
                                onClick={() => setShowPaymentModal(false)}
                                className="w-full py-3 bg-[#FF5722] text-white font-black rounded-xl text-xs uppercase tracking-wider"
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
