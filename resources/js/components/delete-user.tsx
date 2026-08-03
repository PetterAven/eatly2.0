import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { SharedData } from '@/types';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const { auth } = usePage<SharedData>().props;
    const isGoogleUser = Boolean((auth.user as Record<string, unknown>)?.google_id);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm<{ password: string; error?: string }>({
        password: '',
        error: '',
    });

    const deleteUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmText !== 'ELIMINAR') return;

        destroy('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
                setConfirmText('');
            },
            onError: () => {
                passwordInput.current?.focus();
            },
        });
    };

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Zona de Peligro - Eliminar cuenta"
                description="Acción destructiva permanente"
            />
            <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50/70 p-5 shadow-sm dark:border-red-900/40 dark:bg-red-950/20">
                <div className="relative space-y-1 text-red-700 dark:text-red-300">
                    <p className="font-bold text-sm">⚠️ Zona de Peligro</p>
                    <p className="text-xs leading-relaxed">
                        Una vez eliminada tu cuenta, tus datos personales serán removidos permanentemente y no podrás deshacer esta acción. Ten en cuenta que no podrás eliminar tu cuenta si tienes pedidos activos.
                    </p>
                </div>

                {errors.error && (
                    <div className="rounded-xl border border-red-300 bg-red-100 p-3 text-xs font-bold text-red-700">
                        🚫 {errors.error}
                    </div>
                )}

                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        setConfirmText('');
                        reset();
                        clearErrors();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider"
                            data-test="delete-user-button"
                        >
                            🗑️ Eliminar mi cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md rounded-3xl p-6">
                        <DialogTitle className="text-lg font-black text-red-600">
                            ¿Estás seguro de eliminar tu cuenta?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-600 space-y-2 pt-1">
                            <span>Esta acción es permanente. Para confirmar, escribe la palabra <strong className="text-red-600">ELIMINAR</strong> en el campo de abajo.</span>
                        </DialogDescription>

                        <form onSubmit={deleteUser} className="space-y-4 pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="confirm_text" className="text-xs font-bold text-gray-700">
                                    Escribe ELIMINAR para confirmar:
                                </Label>
                                <Input
                                    id="confirm_text"
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="ELIMINAR"
                                    className="rounded-xl border-red-200 uppercase font-mono text-xs"
                                    required
                                />
                            </div>

                            {!isGoogleUser && (
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-xs font-bold text-gray-700">
                                        Contraseña actual:
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder="Ingresa tu contraseña"
                                        className="rounded-xl text-xs"
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>
                            )}

                            {errors.error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
                                    {errors.error}
                                </div>
                            )}

                            <DialogFooter className="gap-2 pt-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="rounded-xl text-xs font-bold"
                                        onClick={() => {
                                            reset();
                                            clearErrors();
                                            setConfirmText('');
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    disabled={processing || confirmText !== 'ELIMINAR'}
                                    type="submit"
                                    className="rounded-xl text-xs font-black uppercase tracking-wider"
                                    data-test="confirm-delete-user-button"
                                >
                                    {processing ? 'Eliminando...' : 'Confirmar Eliminación'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
