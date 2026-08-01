import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Login() {
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const handleGoogleLogin = () => {
        
        window.location.href = '/auth/google/redirect';
    };

    return (
        <>
            <Head title="Iniciar Sesión - Eatly UPP" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 font-sans">
                {}
                <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm sm:p-10">
                    {}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-100 bg-purple-50">
                            <img
                                src="/images/logo-potro.png"
                                alt="🐴"
                                className="h-12 w-12 object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <span className="placeholder-emoji text-3xl">
                                🐴
                            </span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">
                            Eatly <span className="text-purple-600">UPP</span>
                        </h1>
                        <p className="mt-1 text-xs font-medium text-gray-400">
                            El sabor del campus a un clic de distancia
                        </p>
                    </div>

                    {}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wider text-gray-700 uppercase">
                                Correo Institucional
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition focus:border-black focus:bg-white focus:outline-none"
                                placeholder="tu.correo@upp.edu.mx"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Contraseña</label>
                                 <Link href="/forgot-password" className="text-xs font-semibold text-purple-600 hover:underline">¿La olvidaste?</Link>
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition focus:border-black focus:bg-white focus:outline-none"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black focus:ring-0"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 cursor-pointer text-xs font-medium text-gray-500 select-none"
                            >
                                Mantener sesión iniciada
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-gray-900"
                        >
                            {processing ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="relative my-2 flex items-center py-5">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-4 flex-shrink text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                            O continuar con
                        </span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex w-full items-center justify-center space-x-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.57 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.22 8.78 5.04 12 5.04z"
                            />
                            <path
                                fill="#4285F4"
                                d="M23.5 12.25c0-.82-.07-1.6-.2-2.25H12v4.5h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.14-1.98 3.72-4.9 3.72-8.68z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.1 14.7c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 7.3C.54 9.22 0 11.35 0 13.6s.54 4.38 1.5 6.3l3.6-2.9z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.68-2.85c-1.02.68-2.33 1.1-4.28 1.1-3.22 0-6-2.18-6.97-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
                            />
                        </svg>
                        <span>Identificarse con Google</span>
                    </button>

                    <p className="mt-8 text-center text-xs text-gray-500">
                        ¿Eres nuevo en la plataforma?{' '}
                        <Link
                            href="/register"
                            className="font-bold text-purple-600 hover:underline"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
