import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950 px-4 py-8">
            {}
            <div className="relative w-full overflow-hidden rounded-3xl border border-purple-800/20 bg-white p-6 shadow-2xl sm:max-w-md sm:p-8">
                {}
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-purple-700 via-amber-500 to-purple-700"></div>

                <AuthLayout
                    title="CREAR CUENTA"
                    description="Únete a Eatly UPP y administra tus pedidos de comida en el campus"
                >
                    <Head title="Registrarse - Eatly UPP" />

                    <form
                        onSubmit={handleSubmit}
                        className="mt-4 flex flex-col gap-5"
                    >
                        <div className="grid gap-5">
                            {}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                >
                                    Nombre Completo
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Ingresa tu nombre"
                                    className="rounded-xl border-gray-200 bg-slate-50 text-gray-900 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                >
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="ejemplo@upp.edu.mx"
                                    className="rounded-xl border-gray-200 bg-slate-50 text-gray-900 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                >
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="Mínimo 8 caracteres"
                                    className="rounded-xl border-gray-200 bg-slate-50 text-gray-900 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                >
                                    Confirmar Contraseña
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Repite tu contraseña"
                                    className="rounded-xl border-gray-200 bg-slate-50 text-gray-900 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {}
                            <Button
                                type="submit"
                                className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 text-xs font-black tracking-wider text-purple-950 uppercase shadow-md transition-all duration-200 hover:bg-amber-600 active:scale-[0.99] disabled:opacity-50"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing && (
                                    <Spinner className="h-4 w-4 text-purple-950" />
                                )}
                                Registrarse
                            </Button>
                        </div>

                        {}
                        <div className="relative flex items-center py-1">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="mx-4 flex-shrink text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                O también
                            </span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {}
                        <a
                            href="/auth/google/redirect"
                            className="group inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold tracking-wider text-slate-700 uppercase shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99]"
                        >
                            <svg
                                className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110"
                                viewBox="0 0 24 24"
                            >
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
                            Registrarse con Google
                        </a>

                        {}
                        <div className="border-t border-slate-100 pt-4 text-center text-xs font-medium text-gray-500">
                            ¿Ya tienes una cuenta?{' '}
                            <TextLink
                                href="/login"
                                tabIndex={6}
                                className="font-bold text-purple-700 hover:underline"
                            >
                                Inicia Sesión
                            </TextLink>
                        </div>
                    </form>
                </AuthLayout>
            </div>
        </div>
    );
}
