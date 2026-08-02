import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import EatlySettingsLayout from '@/layouts/settings/eatly-settings-layout';
import { disable, enable } from '@/routes/two-factor';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <EatlySettingsLayout>
            <Head title="Verificación en dos pasos - Eatly UPP" />
            <div className="space-y-6">
                <HeadingSmall
                    title="Verificación en dos pasos (2FA)"
                    description="Administra la seguridad adicional de tu cuenta mediante autenticación de dos factores"
                />
                {twoFactorEnabled ? (
                    <div className="flex flex-col items-start justify-start space-y-4 text-xs font-medium">
                        <Badge variant="default" className="bg-emerald-600 text-white font-bold px-3 py-1 text-xs">
                            Habilitado
                        </Badge>
                        <p className="text-gray-600 leading-relaxed">
                            Con la verificación en dos pasos activada, se te solicitará un código PIN seguro y aleatorio durante el inicio de sesión, generado desde tu aplicación de autenticación en el teléfono.
                        </p>

                        <TwoFactorRecoveryCodes
                            recoveryCodesList={recoveryCodesList}
                            fetchRecoveryCodes={fetchRecoveryCodes}
                            errors={errors}
                        />

                        <div className="relative inline pt-2">
                            <Form {...disable.form()}>
                                {({ processing }) => (
                                    <Button
                                        variant="destructive"
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl text-xs font-black uppercase tracking-wider px-5 py-2.5"
                                    >
                                        <ShieldBan className="mr-2 h-4 w-4" /> Desactivar 2FA
                                    </Button>
                                )}
                            </Form>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-start justify-start space-y-4 text-xs font-medium">
                        <Badge variant="destructive" className="bg-gray-200 text-gray-700 font-bold px-3 py-1 text-xs">
                            Deshabilitado
                        </Badge>
                        <p className="text-gray-600 leading-relaxed">
                            Al activar la verificación en dos pasos, se te pedirá un PIN seguro al iniciar sesión. Este PIN se obtiene desde una aplicación compatible con TOTP en tu dispositivo móvil.
                        </p>

                        <div className="pt-2">
                            {hasSetupData ? (
                                <Button
                                    onClick={() => setShowSetupModal(true)}
                                    className="rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 shadow-md"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Continuar Configuración
                                </Button>
                            ) : (
                                <Form
                                    {...enable.form()}
                                    onSuccess={() =>
                                        setShowSetupModal(true)
                                    }
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 shadow-md"
                                        >
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Activar 2FA
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </div>
                    </div>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </div>
        </EatlySettingsLayout>
    );
}
