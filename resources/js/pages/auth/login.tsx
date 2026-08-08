import InputError from '@/components/input-error';
import GoogleIcon from '@/components/google-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { storeTabToken } from '@/lib/tab-auth';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import React from 'react';

interface PageProps {
    flash?: {
        error?: string;
        success?: string;
    };
    [key: string]: unknown;
}

interface LoginResponse {
    token: string;
    redirect: string;
}

export default function Login() {
    const { data, setData, setError, clearErrors, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { props } = usePage<PageProps>();
    const flashError = props.flash?.error;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setIsSubmitting(true);

        try {
            const response = await axios.post<LoginResponse>('/login', data, {
                headers: { Accept: 'application/json' },
            });

            storeTabToken(response.data.token);
            router.visit(response.data.redirect || '/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const validationErrors = error.response.data.errors as Record<
                    string,
                    string[]
                >;

                Object.entries(validationErrors).forEach(([field, messages]) => {
                    if (field === 'email' || field === 'password') {
                        setError(field, messages[0]);
                    }
                });
            } else {
                setError('email', 'No fue posible iniciar sesión. Intenta de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = '/auth/google/redirect';
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 px-4 py-8">
            {/* Animación de Parrilla / Fuego de Fondo */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#f97316_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20"></div>
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 animate-pulse rounded-full bg-amber-500/30 blur-3xl"></div>
            <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 animate-pulse rounded-full bg-orange-600/30 blur-3xl delay-1000"></div>

            <div className="relative z-10 w-full overflow-hidden rounded-3xl border border-amber-500/30 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:max-w-md sm:p-8">
                <div className="absolute top-0 left-0 h-2 w-full animate-pulse bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500"></div>

                {/* Detalle visual de llamas y parrilla */}
                <div className="mb-2 flex items-center justify-center gap-2">
                    <span className="rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1 text-xs font-black tracking-widest text-amber-600 uppercase shadow-inner">
                        Asador & Antojos UPP
                    </span>
                </div>

                <AuthLayout
                    title="INICIAR SESIÓN"
                    description="El sabor del campus a un clic de distancia"
                >
                    <Head title="Iniciar Sesión - Eatly UPP" />

                    {flashError && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {flashError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                >
                                    Correo Institucional
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                    placeholder="tu.correo@upp.edu.mx"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                    >
                                        Contraseña
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-semibold text-purple-700 hover:underline"
                                    >
                                        ¿La olvidaste?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 cursor-pointer text-xs font-medium text-gray-500 select-none"
                                >
                                    Mantener sesión iniciada
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 text-xs font-black tracking-wider text-purple-950 uppercase shadow-md transition-all duration-200 hover:bg-amber-600 active:scale-[0.99] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Spinner className="h-4 w-4 text-purple-950" />
                                ) : null}
                                Iniciar Sesión
                            </Button>
                        </div>

                        <div className="relative flex items-center py-1">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="mx-4 flex-shrink text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                O continuar con
                            </span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="group inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold tracking-wider text-slate-700 uppercase shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99]"
                        >
                            <GoogleIcon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                            <span>Identificarse con Google</span>
                        </button>

                        <div className="border-t border-slate-100 pt-4 text-center text-xs font-medium text-gray-500">
                            ¿Eres nuevo en la plataforma?{' '}
                            <Link
                                href="/register"
                                className="font-bold text-purple-700 hover:underline"
                            >
                                Regístrate aquí
                            </Link>
                        </div>
                    </form>
                </AuthLayout>
            </div>
        </div>
    );
}
