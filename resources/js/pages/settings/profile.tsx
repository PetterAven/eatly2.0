import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EatlySettingsLayout from '@/layouts/settings/eatly-settings-layout';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const isGoogleUser = Boolean((auth.user as Record<string, unknown>)?.google_id);

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: auth.user.name,
            email: auth.user.email,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <EatlySettingsLayout>
            <Head title="Ajustes del perfil - Eatly UPP" />

            <div className="space-y-6">
                <HeadingSmall
                    title="Información del perfil"
                    description="Actualiza tu nombre y dirección de correo electrónico"
                />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase">Nombre</Label>

                        <Input
                            id="name"
                            className="mt-1 block w-full rounded-xl border-gray-200 text-xs"
                            value={data.name}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            required
                            autoComplete="name"
                            placeholder="Nombre completo"
                        />

                        <InputError
                            className="mt-2 text-xs"
                            message={errors.name}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase">Correo electrónico</Label>

                        <Input
                            id="email"
                            type="email"
                            className={`mt-1 block w-full rounded-xl border-gray-200 text-xs ${isGoogleUser ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                            value={data.email}
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            required
                            disabled={isGoogleUser}
                            autoComplete="username"
                            placeholder="Correo electrónico"
                        />
                        {isGoogleUser && (
                            <p className="text-[11px] font-medium text-orange-600">
                                🔒 Vinculado a cuenta de Google (correo de sólo lectura).
                            </p>
                        )}

                        <InputError
                            className="mt-2 text-xs"
                            message={errors.email}
                        />
                    </div>

                    {mustVerifyEmail &&
                        auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-xs text-muted-foreground">
                                    Tu dirección de correo no está verificada.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
                                    >
                                        Haz clic aquí para reenviar el correo de verificación.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-xs font-bold text-green-600">
                                        Se ha enviado un nuevo enlace de verificación a tu correo.
                                    </div>
                                )}
                            </div>
                        )}

                    <div className="flex items-center gap-4">
                        <Button
                            disabled={processing}
                            className="rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 shadow-md transition"
                            data-test="update-profile-button"
                        >
                            Guardar Cambios
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-xs font-bold text-emerald-600">
                                ✓ Guardado con éxito
                            </p>
                        </Transition>
                    </div>
                </form>

                <div className="border-t border-gray-100 pt-6">
                    <DeleteUser />
                </div>
            </div>
        </EatlySettingsLayout>
    );
}
