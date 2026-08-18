import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="w-full max-w-md space-y-6">
                {/* Encabezado con logo y títulos adaptativos */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <Link href="/" className="mb-2 transition-transform duration-200 hover:scale-105">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                            E
                        </div>
                    </Link>
                    {title && <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>}
                    {description && <p className="text-sm text-muted-foreground max-w-xs sm:max-w-none">{description}</p>}
                </div>

                {/* Contenedor tipo tarjeta táctil con sombras suaves */}
                <div className="modern-card p-6 sm:p-8 bg-card shadow-lg border border-border/70 backdrop-blur-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}