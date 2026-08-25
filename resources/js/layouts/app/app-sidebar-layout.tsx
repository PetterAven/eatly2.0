import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar" className="min-h-screen bg-background antialiased">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden flex flex-col flex-1 min-w-0 transition-all duration-200">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto touch-scroller">
                    {children}
                </main>
            </AppContent>
        </AppShell>
    );
}