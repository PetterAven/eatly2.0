import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import EatlySettingsLayout from '@/layouts/settings/eatly-settings-layout';

export default function Appearance() {
    return (
        <EatlySettingsLayout>
            <Head title="Apariencia - Eatly UPP" />

            <div className="space-y-6">
                <HeadingSmall
                    title="Configuración de apariencia"
                    description="Personaliza la apariencia visual de tu cuenta en la aplicación"
                />
                <AppearanceTabs />
            </div>
        </EatlySettingsLayout>
    );
}
