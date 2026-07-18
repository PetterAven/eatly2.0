// Components
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-8">
            <div className="w-full sm:max-w-md bg-white border border-purple-800/20 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                
                {/* Detalle estético superior de la marca */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-700 via-amber-500 to-purple-700"></div>

                <AuthLayout
                    title="¿Olvidaste tu contraseña?"
                    description="Introduce tu correo electrónico institucional para recibir un enlace seguro de restablecimiento."
                >
                    <Head title="Recuperar Contraseña - Eatly UPP" />

                    {status && (
                        <div className="mb-4 text-center text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                            {status}
                        </div>
                    )}

                    <div className="space-y-6 mt-4">
                        <Form {...email.form()}>
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                                            Correo Electrónico
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="tu.correo@upp.edu.mx"
                                            className="rounded-xl border-gray-200 bg-slate-50 focus-visible:ring-purple-600/20 focus-visible:border-purple-600"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="mt-2 flex items-center justify-start">
                                        <Button
                                            className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-purple-950 font-black rounded-xl shadow-md transition-all duration-200 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                        >
                                            {processing && (
                                                <LoaderCircle className="h-4 w-4 animate-spin text-purple-950" />
                                            )}
                                            Enviar enlace al correo
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <div className="text-center text-xs font-medium text-gray-500 pt-4 border-t border-slate-100">
                            <span>O bien, regresar al </span>
                            <TextLink href={login()} className="text-purple-700 font-bold hover:underline">
                                inicio de sesión
                            </TextLink>
                        </div>
                    </div>
                </AuthLayout>
            </div>
        </div>
    );
}