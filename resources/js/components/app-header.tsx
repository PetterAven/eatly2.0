import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn, isSameUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bike, Clock, LayoutGrid, Menu, Settings, Store } from 'lucide-react';

interface AppHeaderProps {
    readonly breadcrumbs?: BreadcrumbItem[];
}

function getMainNavItems(userRole: string): NavItem[] {
    if (userRole === 'merchant') {
        return [
            { title: 'Panel de tienda', href: '/vendor/dashboard', icon: Store },
            { title: 'Mi perfil', href: '/profile', icon: Settings },
        ];
    }

    if (userRole === 'driver') {
        return [
            {
                title: 'Panel de repartidor',
                href: '/delivery/dashboard',
                icon: Bike,
            },
            { title: 'Mi perfil', href: '/profile', icon: Settings },
        ];
    }

    return [
        { title: 'Inicio', href: dashboard(), icon: LayoutGrid },
        { title: 'Mis pedidos', href: '/historial', icon: Clock },
        { title: 'Mi perfil', href: '/profile', icon: Settings },
    ];
}

function getHomeUrl(userRole: string): string {
    if (userRole === 'merchant') return '/vendor/dashboard';
    if (userRole === 'driver') return '/delivery/dashboard';

    return dashboard.url();
}

export function AppHeader({ breadcrumbs = [] }: Readonly<AppHeaderProps>) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth.user;
    const role = (user.role as string) || 'client';
    const mainNavItems = getMainNavItems(role);
    const homeUrl = getHomeUrl(role);
    const getInitials = useInitials();

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-gray-100 bg-white px-4 py-3 shadow-sm sm:px-6">
                <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-[#FF5722]"
                                    aria-label="Abrir menú"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex w-72 flex-col border-gray-100 bg-white p-5"
                            >
                                <SheetHeader className="border-b border-gray-100 pb-4 text-left">
                                    <SheetTitle className="text-xl font-black tracking-tight text-gray-900">
                                        Eatly{' '}
                                        <span className="text-[#FF5722]">
                                            Eats
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="mt-5 space-y-2">
                                    {mainNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition',
                                                isSameUrl(page.url, item.href)
                                                    ? 'bg-orange-50 text-[#FF5722]'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#FF5722]',
                                            )}
                                        >
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="h-4 w-4"
                                                />
                                            )}
                                            {item.title}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={homeUrl}
                        prefetch
                        className="shrink-0 text-2xl font-black tracking-tight text-gray-900"
                    >
                        Eatly <span className="text-[#FF5722]">Eats</span>
                    </Link>

                    <nav className="ml-3 hidden items-center gap-2 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold transition duration-200',
                                    isSameUrl(page.url, item.href)
                                        ? 'bg-orange-50 text-[#FF5722]'
                                        : 'text-gray-700 hover:bg-orange-50 hover:text-[#FF5722]',
                                )}
                            >
                                {item.icon && (
                                    <Icon
                                        iconNode={item.icon}
                                        className="h-4 w-4"
                                    />
                                )}
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="ml-auto h-10 w-10 rounded-full p-1 hover:bg-orange-50"
                                aria-label="Abrir menú de usuario"
                            >
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-full bg-[#FF5722] text-xs font-black text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {breadcrumbs.length > 1 && (
                <div className="border-b border-gray-100 bg-white">
                    <div className="mx-auto flex h-12 w-full max-w-7xl items-center px-4 text-sm text-gray-500 sm:px-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
