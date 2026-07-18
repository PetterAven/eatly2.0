import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

export default function Register() {
    return (
        // Fondo degradado institucional coordinado con el Login
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-8">
            
            {/* Tarjeta contenedora elegante */}
            <div className="w-full sm:max-w-md bg-white border border-purple-800/20 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                
                {/* Detalle estético superior */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-700 via-amber-500 to-purple-700"></div>

                <AuthLayout
                    title="CREAR CUENTA"
                    description="Únete a Eatly UPP y administra tus pedidos de comida en el campus"
                >
                    <Head title="Registrarse - Eatly UPP" />

                    <Form
                        {...store.form()}
                        className="flex flex-col gap-5 mt-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    {/* Nombre Completo */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                                            Nombre Completo
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
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
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            placeholder="ejemplo@upp.edu.mx"
                                            className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
                                        />
                                        <InputError message={errors.email} />
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
                                            required
                                            tabIndex={3}
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
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            placeholder="Repite tu contraseña"
                                            className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    {/* Botón de Registro Tradicional Simplificado */}
                                    <Button
                                        type="submit"
                                        className="mt-2 w-full h-11 bg-amber-500 hover:bg-amber-600 text-purple-950 font-black rounded-xl shadow-md transition-all duration-200 uppercase tracking-wider text-xs active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                                        tabIndex={5}
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

                                {/* Botón de Registro Directo con Google */}
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
                                    <TextLink 
                                        href={login()} 
                                        tabIndex={6}
                                        className="text-purple-700 font-bold hover:underline"
                                    >
                                        Inicia Sesión
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </AuthLayout>
            </div>
        </div>
    );
}