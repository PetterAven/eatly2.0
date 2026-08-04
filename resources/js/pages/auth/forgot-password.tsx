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
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950 px-4 py-8">
            <div className="relative w-full overflow-hidden rounded-3xl border border-purple-800/20 bg-white p-6 shadow-2xl sm:max-w-md sm:p-8">
                {/* Detalle estético superior de la marca */}
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-purple-700 via-amber-500 to-purple-700"></div>

                <AuthLayout
                    title="¿Olvidaste tu contraseña?"
                    description="Introduce tu correo electrónico institucional para recibir un enlace seguro de restablecimiento."
                >
                    <Head title="Recuperar Contraseña - Eatly UPP" />

                    {status && (
                        <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-600">
                            {status}
                        </div>
                    )}

                    <div className="mt-4 space-y-6">
                        <Form action={email.url()} method={email.definition.methods[0]}>
                            {({ processing, errors }) => (
                                <>
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
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="tu.correo@upp.edu.mx"
                                            className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="mt-2 flex items-center justify-start">
                                        <Button
                                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 text-xs font-black tracking-wider text-purple-950 uppercase shadow-md transition-all duration-200 hover:bg-amber-600"
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

                        <div className="border-t border-slate-100 pt-4 text-center text-xs font-medium text-gray-500">
                            <span>O bien, regresar al </span>
                            <TextLink
                                href={login()}
                                className="font-bold text-purple-700 hover:underline"
                            >
                                inicio de sesión
                            </TextLink>
                        </div>
                    </div>
                </AuthLayout>
            </div>
        </div>
    );
}
