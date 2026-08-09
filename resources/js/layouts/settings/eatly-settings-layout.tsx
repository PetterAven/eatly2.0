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
    const [menuOpen, setMenuOpen] = useState(false);
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
                {/* Settings Navigation Bar with Small Hamburger Menu */}
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Small Hamburger Menu for Settings Navigation */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF5722] transition hover:bg-orange-100"
                                aria-label="Menú de navegación de ajustes"
                            >
                                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>

                            {menuOpen && (
                                <div className="absolute top-12 left-0 z-50 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                    <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                                        Secciones de Ajustes
                                    </p>
                                    {settingsNavItems.map((item) => {
                                        const IconComponent = item.icon;
                                        const isActive = String(item.href) === currentPath;
                                        return (
                                            <Link
                                                key={String(item.href)}
                                                href={item.href}
                                                onClick={() => setMenuOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition',
                                                    isActive
                                                        ? 'bg-orange-50 text-[#FF5722]'
                                                        : 'text-gray-700 hover:bg-orange-50 hover:text-[#FF5722]',
                                                )}
                                            >
                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-sm font-black text-gray-900">{currentItem.title}</h2>
                            <p className="text-[11px] text-gray-500">Administra y actualiza la configuración de tu cuenta</p>
                        </div>
                    </div>

                    {/* Desktop horizontal pills */}
                    <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                        {settingsNavItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = String(item.href) === currentPath;
                            return (
                                <Link
                                    key={String(item.href)}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition',
                                        isActive
                                            ? 'bg-white text-[#FF5722] shadow-sm'
                                            : 'text-gray-600 hover:text-[#FF5722] hover:bg-white/50',
                                    )}
                                >
                                    {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
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
