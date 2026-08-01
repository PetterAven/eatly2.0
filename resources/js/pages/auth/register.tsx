import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'client',
        password: '',
        password_confirmation: '',
    });

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
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
            {/* Animación de Parrilla / Fuego de Fondo */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f97316_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl animate-pulse pointer-events-none delay-1000"></div>

            <div className="w-full sm:max-w-md bg-white/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden z-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 animate-pulse"></div>

                {/* Detalle visual de llamas y parrilla */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl animate-bounce">🔥</span>
                    <span className="text-xs font-black tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 shadow-inner">
                        Asador & Antojos UPP
                    </span>
                    <span className="text-2xl animate-bounce delay-150">🍔</span>
                </div>

                <AuthLayout
                    title="CREAR CUENTA"
                    description="Únete a Eatly UPP y vive la experiencia gastronómica del campus"
                >
                    <Head title="Registrarse - Eatly UPP" />

                    <form onSubmit={submit} className="flex flex-col gap-5 mt-4">
                        <div className="grid gap-5">
                            {/* Nombre Completo */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                                    Nombre Completo
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Ingresa tu nombre"
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Correo Electrónico */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="ejemplo@upp.edu.mx"
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Tipo de Usuario / Rol */}
                            <div className="grid gap-2">
                                <Label htmlFor="role" className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                                    Tipo de Cuenta
                                </Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    required
                                    tabIndex={3}
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600 h-10 px-3 text-sm text-slate-700"
                                >
                                    <option value="client">🍽️ Cliente (Estudiante / Comensal)</option>
                                    <option value="driver">🛵 Repartidor (Campus)</option>
                                    <option value="merchant">🏪 Tienda / Local (Cafetería / Comercio)</option>
                                </select>
                                <InputError message={errors.role} />
                            </div>

                            {/* Contraseña */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Mínimo 8 caracteres"
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                                    Confirmar Contraseña
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    placeholder="Repite tu contraseña"
                                    className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Botón de Registro */}
                            <Button
                                type="submit"
                                className="mt-2 w-full h-11 bg-amber-500 hover:bg-amber-600 text-purple-950 font-black rounded-xl shadow-md transition-all duration-200 uppercase tracking-wider text-xs active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                                tabIndex={6}
                                disabled={processing}
                            >
                                {processing ? <Spinner className="text-purple-950 h-4 w-4" /> : null}
                                Registrarse
                            </Button>
                        </div>

                        {/* Divisor visual */}
                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">O también</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* Botón Google */}
                        <a
                            href="/auth/google/redirect"
                            className="w-full h-11 inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm text-xs uppercase tracking-wider active:scale-[0.99] transition-all group"
                        >
                            <svg className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.465 0-6.285-2.82-6.285-6.285 0-3.465 2.82-6.285 6.285-6.285 1.425 0 2.735.485 3.79 1.3l3.03-3.03C18.91 1.93 15.76 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.14 10.867-11.24 0-.56-.052-1.12-.152-1.655H12.24z"/>
                            </svg>
                            Registrarse con Google
                        </a>

                        {/* Retorno al Login */}
                        <div className="text-center text-xs font-medium text-gray-500 pt-4 border-t border-slate-100">
                            ¿Ya tienes una cuenta?{' '}
                            <Link 
                                href="/login" 
                                tabIndex={7}
                                className="text-purple-700 font-bold hover:underline"
                            >
                                Inicia Sesión
                            </Link>
                        </div>
                    </form>
                </AuthLayout>
            </div>

            {/* MODAL DE TÉRMINOS Y CONDICIONES ESTILO RAPPI */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-gray-100 flex flex-col max-h-[90vh] overflow-y-auto animate-fade-in">
                        
                        {/* Botón de cerrar */}
                        <button 
                            onClick={() => setShowTermsModal(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition"
                        >
                            ✕
                        </button>

                        <div className="mb-6 pr-8">
                            <span className="text-2xl block mb-2">📜</span>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Términos y condiciones</h3>
                            <p className="text-xs text-gray-500 mt-1">Por favor lee y acepta nuestros términos para completar tu registro en Eatly Eats UPP.</p>
                        </div>

                        {/* Contenido de términos */}
                        <div className="bg-gray-50 border border-gray-200/60 rounded-2xl p-4 text-xs text-gray-600 h-36 overflow-y-auto mb-6 space-y-2 leading-relaxed">
                            <p className="font-bold text-gray-800">1. Aceptación de los Términos</p>
                            <p>Al registrarte en Eatly Eats UPP, aceptas cumplir con las normativas internas del campus universitario y las políticas de entrega en instalaciones.</p>
                            <p className="font-bold text-gray-800 mt-2">2. Privacidad de Datos</p>
                            <p>Tus datos personales y académicos son utilizados exclusivamente para la gestión, procesamiento y entrega de tus pedidos dentro de la Universidad Politécnica de Pachuca.</p>
                            <p className="font-bold text-gray-800 mt-2">3. Pedidos y Pagos</p>
                            <p>Los pedidos realizados a través de la plataforma implican un compromiso de pago y recepción en el punto indicado en el campus.</p>
                        </div>

                        {/* 3 Casillas de verificación (checkboxes) */}
                        <div className="space-y-4 mb-8">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                                />
                                <span className="text-xs font-bold text-gray-800">
                                    Acepto los Términos y condiciones <span className="text-[#FF5722] font-black">* (Obligatorio)</span>
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={acceptPrivacy}
                                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                                />
                                <span className="text-xs font-bold text-gray-800">
                                    Acepto la Política de privacidad <span className="text-[#FF5722] font-black">* (Obligatorio)</span>
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={acceptPromos}
                                    onChange={(e) => setAcceptPromos(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722] border-gray-300"
                                />
                                <span className="text-xs font-medium text-gray-600">
                                    Quiero recibir promociones y novedades de Eatly Eats <span className="text-gray-400 font-normal">(Opcional)</span>
                                </span>
                            </label>
                        </div>

                        {/* Botón Continuar */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={!canContinue || processing}
                                onClick={handleConfirmRegistration}
                                className={`flex-1 py-3 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 ${
                                    canContinue 
                                        ? 'bg-[#FF5722] hover:bg-[#F4511E] shadow-orange-500/25 active:scale-95' 
                                        : 'bg-gray-300 cursor-not-allowed opacity-50'
                                }`}
                            >
                                {processing ? <Spinner className="text-white h-4 w-4" /> : null}
                                Continuar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
