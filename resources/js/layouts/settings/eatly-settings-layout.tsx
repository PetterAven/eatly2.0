import { AppHeader } from '@/components/app-header';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { show as showTwoFactor } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { Link } from '@inertiajs/react';
import { KeyRound, Menu, Monitor, Shield, User, X } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';

const settingsNavItems = [
    {
        title: 'Perfil',
        href: editProfile(),
        icon: User,
    },
    {
        title: 'Contraseña',
        href: editPassword(),
        icon: KeyRound,
    },
    {
        title: 'Verificación en dos pasos',
        href: showTwoFactor(),
        icon: Shield,
    },
    {
        title: 'Apariencia',
        href: editAppearance(),
        icon: Monitor,
    },
];

export default function EatlySettingsLayout({ children }: Readonly<PropsWithChildren>) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const currentItem = settingsNavItems.find((item) => String(item.href) === currentPath) || settingsNavItems[0];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
            <AppHeader
                breadcrumbs={[
                    { title: 'Configuración', href: String(editProfile()) },
                    { title: currentItem.title, href: String(currentItem.href) },
                ]}
            />

            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 pb-24">
                {/* Banner de Sección con identidad de marca */}
                <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-xl">
                    <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-full bg-white/25 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                            Configuración
                        </span>
                        <h1 className="text-2xl font-black tracking-tight lg:text-3xl">
                            {currentItem.title}
                        </h1>
                        <p className="mt-1 text-xs text-orange-100">
                            Administra y actualiza la configuración de tu cuenta
                        </p>
                    </div>
                </div>

                {/* Settings Navigation Bar */}
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-2 shadow-sm">
                    <div className="flex items-center gap-1">
                        {settingsNavItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = String(item.href) === currentPath;
                            return (
                                <Link
                                    key={String(item.href)}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition uppercase tracking-wider',
                                        isActive
                                            ? 'bg-orange-50 text-[#FF5722]'
                                            : 'text-gray-600 hover:text-[#FF5722] hover:bg-gray-50',
                                    )}
                                >
                                    {IconComponent && <IconComponent className="h-4 w-4" />}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-sm">
                    {children}
                </div>
            </main>
        </div>
    );
}
