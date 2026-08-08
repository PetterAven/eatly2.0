import InputError from '@/components/input-error';
import EatlySettingsLayout from '@/layouts/settings/eatly-settings-layout';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types';

export default function Password() {
    const { auth } = usePage<SharedData>().props;
    const isGoogleUser = Boolean((auth.user as Record<string, unknown>)?.google_id);

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
        reset,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <EatlySettingsLayout>
            <Head title="Cambiar contraseña - Eatly UPP" />

            <div className="space-y-6">
                <HeadingSmall
                    title="Actualizar contraseña"
                    description="Asegúrate de que tu cuenta utilice una contraseña segura y robusta"
                />

                {isGoogleUser ? (
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-xs font-bold text-orange-800">
                        Tu cuenta inició sesión con Google. No es necesario establecer una contraseña en Eatly, ya que tu acceso está protegido por Google.
                    </div>
                ) : (
                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password" className="text-xs font-bold text-gray-700 uppercase">
                                Contraseña actual
                            </Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) =>
                                    setData('current_password', e.target.value)
                                }
                                type="password"
                                className="mt-1 block w-full rounded-xl border-gray-200 text-xs"
                                autoComplete="current-password"
                                placeholder="Contraseña actual"
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold text-gray-700 uppercase">Nueva contraseña</Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                type="password"
                                className="mt-1 block w-full rounded-xl border-gray-200 text-xs"
                                autoComplete="new-password"
                                placeholder="Nueva contraseña"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold text-gray-700 uppercase">
                                Confirmar contraseña
                            </Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                type="password"
                                className="mt-1 block w-full rounded-xl border-gray-200 text-xs"
                                autoComplete="new-password"
                                placeholder="Repite la nueva contraseña"
                            />

                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 shadow-md transition"
                                data-test="update-password-button"
                            >
                                Guardar Contraseña
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-xs font-bold text-emerald-600">
                                    ✓ Contraseña actualizada
                                </p>
                            </Transition>
                        </div>
                    </form>
                )}
            </div>
        </EatlySettingsLayout>
    );
}
