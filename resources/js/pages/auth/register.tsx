import InputError from '@/components/input-error';
import GoogleIcon from '@/components/google-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface PageProps {
    flash?: {
        error?: string;
        success?: string;
    };
    [key: string]: unknown;
}

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'client',
        password: '',
        password_confirmation: '',
    });

    const { props } = usePage<PageProps>();
    const flashError = props.flash?.error;

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [acceptPromos, setAcceptPromos] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowTermsModal(true);
    };

    const handleConfirmRegistration = () => {
        setShowTermsModal(false);
        post('/register');
    };

    const canContinue = acceptTerms && acceptPrivacy;

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
                    <span className="animate-bounce text-2xl">🔥</span>
                    <span className="rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1 text-xs font-black tracking-widest text-amber-600 uppercase shadow-inner">
                        Asador & Antojos UPP
                    </span>
                    <span className="animate-bounce text-2xl delay-150">
                        🍔
                    </span>
                </div>

                <AuthLayout
                    title="CREAR CUENTA"
                    description="Únete a Eatly UPP y vive la experiencia gastronómica del campus"
                >
                    <Head title="Registrarse - Eatly UPP" />

                    {flashError && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {flashError}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="mt-4 flex flex-col gap-5"
                    >
                        <div className="grid gap-5">
                            {/* Nombre Completo */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                >
                                    Nombre Completo
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
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
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Correo Electrónico */}
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
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Tipo de Usuario / Rol */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="role"
                                    className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                >
                                    Tipo de Cuenta
                                </Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    required
                                    tabIndex={3}
                                    className="h-10 rounded-xl border-gray-200 bg-slate-50 px-3 text-sm text-slate-700 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                >
                                    <option value="client">
                                        🍽️ Cliente (Estudiante / Comensal)
                                    </option>
                                    <option value="driver">
                                        🛵 Repartidor (Campus)
                                    </option>
                                    <option value="merchant">
                                        🏪 Tienda / Local (Cafetería / Comercio)
                                    </option>
                                </select>
                                <InputError message={errors.role} />
                            </div>

                            {/* Contraseña */}
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
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Mínimo 8 caracteres"
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirmar Contraseña */}
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
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    placeholder="Repite tu contraseña"
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* Botón de Registro */}
                            <Button
                                type="submit"
                                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 text-xs font-black tracking-wider text-purple-950 uppercase shadow-md transition-all duration-200 hover:bg-amber-600 active:scale-[0.99] disabled:opacity-50"
                                tabIndex={6}
                                disabled={processing}
                            >
                                {processing ? (
                                    <Spinner className="h-4 w-4 text-purple-950" />
                                ) : null}
                                Registrarse
                            </Button>
                        </div>

                        {/* Divisor visual */}
                        <div className="relative flex items-center py-1">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="mx-4 flex-shrink text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                O también
                            </span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* Botón Google */}
                        <a
                            href="/auth/google/redirect"
                            className="group inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold tracking-wider text-slate-700 uppercase shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99]"
                        >
                            <GoogleIcon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                            Registrarse con Google
                        </a>

                        {/* Retorno al Login */}
                        <div className="border-t border-slate-100 pt-4 text-center text-xs font-medium text-gray-500">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                href="/login"
                                tabIndex={7}
                                className="font-bold text-purple-700 hover:underline"
                            >
                                Inicia Sesión
                            </Link>
                        </div>
                    </form>
                </AuthLayout>
            </div>

            {/* MODAL DE TÉRMINOS Y CONDICIONES ESTILO RAPPI */}
            {showTermsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="animate-fade-in relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
                        {/* Botón de cerrar */}
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600 transition hover:bg-gray-200"
                        >
                            ✕
                        </button>

                        <div className="mb-6 pr-8">
                            <span className="mb-2 block text-2xl">📜</span>
                            <h3 className="text-xl font-black tracking-tight text-gray-900">
                                Términos y condiciones
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Por favor lee y acepta nuestros términos para
                                completar tu registro en Eatly Eats UPP.
                            </p>
                        </div>

                        {/* Contenido de términos */}
                        <div className="mb-6 h-36 space-y-2 overflow-y-auto rounded-2xl border border-gray-200/60 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
                            <p className="font-bold text-gray-800">
                                1. Aceptación de los Términos
                            </p>
                            <p>
                                Al registrarte en Eatly Eats UPP, aceptas
                                cumplir con las normativas internas del campus
                                universitario y las políticas de entrega en
                                instalaciones.
                            </p>
                            <p className="mt-2 font-bold text-gray-800">
                                2. Privacidad de Datos
                            </p>
                            <p>
                                Tus datos personales y académicos son utilizados
                                exclusivamente para la gestión, procesamiento y
                                entrega de tus pedidos dentro de la Universidad
                                Politécnica de Pachuca.
                            </p>
                            <p className="mt-2 font-bold text-gray-800">
                                3. Pedidos y Pagos
                            </p>
                            <p>
                                Los pedidos realizados a través de la plataforma
                                implican un compromiso de pago y recepción en el
                                punto indicado en el campus.
                            </p>
                        </div>

                        {/* 3 Casillas de verificación (checkboxes) */}
                        <div className="mb-8 space-y-4">
                            <label className="flex cursor-pointer items-start gap-3 select-none">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) =>
                                        setAcceptTerms(e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF5722]"
                                />
                                <span className="text-xs font-bold text-gray-800">
                                    Acepto los Términos y condiciones{' '}
                                    <span className="font-black text-[#FF5722]">
                                        * (Obligatorio)
                                    </span>
                                </span>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 select-none">
                                <input
                                    type="checkbox"
                                    checked={acceptPrivacy}
                                    onChange={(e) =>
                                        setAcceptPrivacy(e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF5722]"
                                />
                                <span className="text-xs font-bold text-gray-800">
                                    Acepto la Política de privacidad{' '}
                                    <span className="font-black text-[#FF5722]">
                                        * (Obligatorio)
                                    </span>
                                </span>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3 select-none">
                                <input
                                    type="checkbox"
                                    checked={acceptPromos}
                                    onChange={(e) =>
                                        setAcceptPromos(e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF5722]"
                                />
                                <span className="text-xs font-medium text-gray-600">
                                    Quiero recibir promociones y novedades de
                                    Eatly Eats{' '}
                                    <span className="font-normal text-gray-400">
                                        (Opcional)
                                    </span>
                                </span>
                            </label>
                        </div>

                        {/* Botón Continuar */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="flex-1 rounded-xl bg-gray-100 py-3 text-xs font-bold tracking-wider text-gray-700 uppercase transition hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={!canContinue || processing}
                                onClick={handleConfirmRegistration}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black tracking-wider text-white uppercase shadow-lg transition ${
                                    canContinue
                                        ? 'bg-[#FF5722] shadow-orange-500/25 hover:bg-[#F4511E] active:scale-95'
                                        : 'cursor-not-allowed bg-gray-300 opacity-50'
                                }`}
                            >
                                {processing ? (
                                    <Spinner className="h-4 w-4 text-white" />
                                ) : null}
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
