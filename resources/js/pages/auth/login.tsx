import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login() {
    // Inicializamos el formulario de Inertia
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true, // Por defecto activamos el recordar para agilizar el inicio
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login'); 
    };

    const handleGoogleLogin = () => {
        // Redirección exacta a tu ruta del backend
        window.location.href = '/auth/google/redirect'; 
    };

    return (
        <>
            <Head title="Iniciar Sesión - Eatly UPP" />
            
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 font-sans">
                
                {/* TARJETA PRINCIPAL ESTILO UBER / DIDI */}
                <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-200/80 p-8 sm:p-10">
                    
                    {/* CONTENEDOR DEL LOGO */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-3 border border-purple-100">
                            <img 
                                src="/images/logo-potro.png" 
                                alt="🐴🍌" 
                                className="h-12 w-12 object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <span className="text-3xl placeholder-emoji">🐴</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">
                            Eatly <span className="text-purple-600">UPP</span>
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 font-medium">El sabor del campus a un clic de distancia</p>
                    </div>

                    {/* FORMULARIO TRADICIONAL */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Correo Institucional</label>
                            <input 
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition text-gray-900"
                                placeholder="tu.correo@upp.edu.mx"
                                required
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Contraseña</label>
                                <a href="#" className="text-xs font-semibold text-purple-600 hover:underline">¿La olvidaste?</a>
                            </div>
                            <input 
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition text-gray-900"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
                        </div>

                        <div className="flex items-center">
                            <input 
                                id="remember" 
                                type="checkbox" 
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-0 cursor-pointer"
                            />
                            <label htmlFor="remember" className="ml-2 text-xs font-medium text-gray-500 cursor-pointer select-none">
                                Mantener sesión iniciada
                            </label>
                        </div>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-black hover:bg-gray-900 text-white font-bold rounded-xl text-sm transition shadow-sm mt-2"
                        >
                            {processing ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="relative flex py-5 items-center my-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 font-bold text-[11px] tracking-widest uppercase">O continuar con</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* BOTÓN DE GOOGLE */}
                    <button 
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition border border-gray-200 flex items-center justify-center space-x-3 active:scale-[0.99]"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.57 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.22 8.78 5.04 12 5.04z"/>
                            <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.25H12v4.5h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.14-1.98 3.72-4.9 3.72-8.68z"/>
                            <path fill="#FBBC05" d="M5.1 14.7c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 7.3C.54 9.22 0 11.35 0 13.6s.54 4.38 1.5 6.3l3.6-2.9z"/>
                            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.68-2.85c-1.02.68-2.33 1.1-4.28 1.1-3.22 0-6-2.18-6.97-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
                        </svg>
                        <span>Identificarse con Google</span>
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-8">
                        ¿Eres nuevo en la plataforma?{' '}
                        <Link href="/register" className="font-bold text-purple-600 hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>

                </div>
            </div>
        </>
    );
}