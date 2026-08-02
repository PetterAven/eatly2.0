import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950 px-4 py-8">
            <div className="relative w-full overflow-hidden rounded-3xl border border-purple-800/20 bg-white p-6 shadow-2xl sm:max-w-md sm:p-8">
                {/* Detalle estético superior de la marca */}
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-purple-700 via-amber-500 to-purple-700"></div>

                <AuthLayout
                    title="Actualizar Contraseña"
                    description="Por favor, introduce tu nueva clave de seguridad abajo"
                >
                    <Head title="Restablecer Contraseña - Eatly UPP" />

                    <Form
                        {...update.form()}
                        transform={(data) => ({ ...data, token, email })}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="mt-4"
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-6">
                                {/* Campo Correo Electrónico (Solo Lectura) */}
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
                                        autoComplete="email"
                                        value={email}
                                        className="cursor-not-allowed rounded-xl border-gray-200 bg-slate-100 text-gray-500"
                                        readOnly
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Campo Nueva Contraseña */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-bold tracking-wider text-purple-950 uppercase"
                                    >
                                        Nueva Contraseña
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        autoFocus
                                        placeholder="Mínimo 8 caracteres"
                                        className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Campo Confirmar Contraseña */}
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
                                        autoComplete="new-password"
                                        placeholder="Repite tu contraseña"
                                        className="rounded-xl border-gray-200 bg-slate-50 focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Botón de envío */}
                                <Button
                                    type="submit"
                                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 text-xs font-black tracking-wider text-purple-950 uppercase shadow-md transition-all duration-200 hover:bg-amber-600"
                                    disabled={processing}
                                    data-test="reset-password-button"
                                >
                                    {processing && (
                                        <Spinner className="h-4 w-4 text-purple-950" />
                                    )}
                                    Restablecer Contraseña
                                </Button>
                            </div>
                        )}
                    </Form>
                </AuthLayout>
            </div>
        </div>
    );
}
