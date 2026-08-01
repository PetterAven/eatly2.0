import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Clock, Store, Bike, Utensils, Package } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage<SharedData>();
    const user = page.props.auth?.user;
    const role = user?.role || 'client';

    const mainNavItems: NavItem[] = role === 'merchant'
        ? [
            { title: 'Panel de Tienda', href: '/vendor/dashboard', icon: LayoutGrid },
            { title: 'Menú / Platillos', href: '/vendor/dashboard', icon: Utensils },
            { title: 'Pedidos Recibidos', href: '/vendor/dashboard', icon: Package },
            { title: 'Perfil del Restaurante', href: '/vendor/profile', icon: Store },
          ]
        : role === 'driver'
        ? [
            { title: 'Panel de Repartidor', href: '/delivery/dashboard', icon: Bike },
            { title: 'Mis Entregas', href: '/delivery/dashboard', icon: Package },
          ]
        : [
            { title: 'Catálogo / Menú', href: dashboard(), icon: LayoutGrid },
            { title: 'Mis Pedidos', href: '/historial', icon: Clock },
          ];

    const homeUrl = role === 'merchant' ? '/vendor/dashboard' : role === 'driver' ? '/delivery/dashboard' : dashboard();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
