import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

export default function VendorRegister() {
    const { data, setData, post, processing, errors } = useForm({
        restaurant_name: '',
        food_type: 'Comida Caliente',
        location: 'Edificio de Servicios Estudiantiles',
        phone: '',
        email: '',
        password: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor/register');
    };

    return (
        <>
            <Head title="Registra tu Cafetería - Eatly Eats Partners" />
            
            <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gray-50 font-sans text-gray-900">
                
                {/* LADO IZQUIERDO: HERO BANNER ESTILO RAPPI PARTNERS */}
                <div className="lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 p-8 sm:p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-white">Eatly <span className="text-amber-200">Eats</span> Partners</span>
                        </Link>
                        <Link href="/login" className="text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-2xl transition">
                            Iniciar Sesión
                        </Link>
                    </div>

                    <div className="relative z-10 my-12 max-w-lg">
                        <span className="bg-white/25 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6 inline-block shadow-sm">
                            0% comisiones por los primeros 30 días
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
                            Registrar tu cafetería en Eatly Eats.
                        </h1>
                        <p className="text-xs sm:text-sm text-orange-100 font-medium leading-relaxed">
                            Llega a todos los estudiantes y maestros del campus de la UPP sin filas y incrementa tus ventas diarias de forma exponencial.
                        </p>
                    </div>

                    <div className="relative z-10 text-[11px] font-bold text-orange-100 flex items-center gap-2">
                        <span>Universidad Politécnica de Pachuca - Campus Pachuca Hidalgo</span>
                    </div>
                </div>

                {/* LADO DERECHO: FORMULARIO DE REGISTRO BLANCO */}
                <div className="lg:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
                    <div className="max-w-md w-full mx-auto">
                        
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registra tu restaurante</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                ¿Ya comenzaste tu registro?{' '}
                                <Link href="/login" className="text-[#FF5722] font-black hover:underline">
                                    continúa aquí
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            
                            {/* Campo 1: Nombre del restaurante / concesionario */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Nombre del Restaurante / Concesionario
                                </label>
                                <input
                                    type="text"
                                    value={data.restaurant_name}
                                    onChange={e => setData('restaurant_name', e.target.value)}
                                    required
                                    placeholder="Ej. Moto Restaurante o Cafetería Central"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FF5722] transition"
                                />
                                <InputError message={errors.restaurant_name} />
                            </div>

                            {/* Campo 2: Tipo de comida */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Tipo de Comida / Especialidad
                                </label>
                                <select
                                    value={data.food_type}
                                    onChange={e => setData('food_type', e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FF5722] transition"
                                >
                                    <option value="Comida Caliente">Comida caliente y platos fuertes</option>
                                    <option value="Snacks & Antojos">Snacks y antojitos</option>
                                    <option value="Bebidas & Postres">Bebidas y postres</option>
                                </select>
                                <InputError message={errors.food_type} />
                            </div>

                            {/* Campo 3: Ubicación / Edificio en Campus UPP */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Ubicación / Edificio en Campus UPP
                                </label>
                                <select
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FF5722] transition"
                                >
                                    <option value="Edificio de Servicios Estudiantiles">Edificio de Servicios Estudiantiles, Planta Baja</option>
                                    <option value="Edificio G (Ingenierías)">Edificio G (Ingenierías)</option>
                                    <option value="Edificio UD (Laboratorios)">Edificio UD (Laboratorios Pesados)</option>
                                    <option value="Anexo Cafetería Principal">Anexo Cafetería Principal</option>
                                </select>
                                <InputError message={errors.location} />
                            </div>

                            {/* Campo 4: Teléfono Móvil / WhatsApp */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Teléfono Móvil / WhatsApp
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-xs font-bold text-gray-400">+52</span>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        required
                                        placeholder="771 123 4567"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FF5722] transition"
                                    />
                                </div>
                                <InputError message={errors.phone} />
                            </div>

                            {/* Campo 5: E-mail del responsable */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    E-mail del Responsable
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    placeholder="restaurante@upp.edu.mx"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FF5722] transition"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Campo 6: Crea una contraseña */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Crea una Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-12 text-xs font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FF5722] transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3 text-xs font-bold text-gray-400 hover:text-gray-700"
                                    >
                                        {showPassword ? 'Ocultar' : 'Ver'}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Checkbox de autorización de uso de datos personales y WhatsApp */}
                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.terms}
                                        onChange={e => setData('terms', e.target.checked)}
                                        required
                                        className="mt-0.5 w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                                    />
                                    <span className="text-[11px] font-medium text-gray-600 leading-relaxed">
                                        Autorizo el uso de mis datos personales y el envío de notificaciones operativas vía WhatsApp para la gestión de pedidos en Eatly Eats UPP.
                                    </span>
                                </label>
                                <InputError message={errors.terms} />
                            </div>

                            {/* Botón principal "Registrar Restaurante" */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 mt-4 bg-[#FF5722] hover:bg-[#F4511E] text-white font-black rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? <Spinner className="text-white h-4 w-4" /> : null}
                                Registrar Restaurante
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </>
    );
}
