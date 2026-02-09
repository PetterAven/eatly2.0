import { Link, usePage } from '@inertiajs/react';

// Tipos de TS (si usas TS)
import { type SharedData } from '@/types';

type BranchCard = {
    id: number;
    name: string;
    restaurant_name?: string;
    city?: string;
    state?: string;
    image_url?: string;
    eta_min: number;
    eta_max: number;
    rating: number | string;
};

interface WelcomeProps extends SharedData {
    branches: BranchCard[];
    canLogin: boolean;
    canRegister: boolean;
}

export default function Welcome() {
    const page = usePage<WelcomeProps>();

    const canLogin = page.props.canLogin;
    const canRegister = page.props.canRegister;

    // Default para evitar undefined
    const branches: BranchCard[] = page.props.branches ?? [];

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            {/* NAVBAR */}
            <header className="w-full border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-yellow-400 text-sm font-bold text-white">
                            E
                        </div>
                        <span className="font-semibold tracking-tight text-slate-800">
                            EATLY
                        </span>
                    </div>

                    {/* Auth Links */}
                    <nav className="flex items-center gap-4 text-sm">
                        {canLogin && (
                            <Link
                                href="/login"
                                className="text-slate-700 hover:text-yellow-500"
                            >
                                Iniciar sesión
                            </Link>
                        )}

                        {canRegister && (
                            <Link
                                href="/register"
                                className="rounded-full bg-yellow-400 px-3 py-1.5 text-sm text-white hover:bg-yellow-500"
                            >
                                Registrarse
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* HERO */}
            <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-10 md:flex-row md:py-12">
                    <div className="flex-1">
                        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
                            Pide en tus restaurantes favoritos sin esperar
                        </h1>
                        <p className="mb-4 text-sm text-yellow-100 md:text-base">
                            Explora sucursales cercanas, programa tu pedido y
                            ahorra tiempo.
                        </p>
                    </div>

                    <div className="hidden flex-1 md:block">
                        <div className="flex h-40 w-full items-center justify-center rounded-3xl border border-yellow-300/50 bg-yellow-400/30 text-sm text-yellow-50">
                            Vista previa de EATLY
                        </div>
                    </div>
                </div>
            </section>

            {/* LISTA DE SUCURSALES */}
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8">
                    <h2 className="mb-4 text-lg font-semibold text-slate-800">
                        Sucursales cerca de ti
                    </h2>

                    {branches.length === 0 && (
                        <p className="text-sm text-slate-500">
                            No hay sucursales disponibles por ahora.
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                className="cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                {/* Imagen */}
                                {branch.image_url ? (
                                    <img
                                        src={branch.image_url}
                                        alt={branch.name}
                                        className="h-40 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-40 w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                                        Sin imagen
                                    </div>
                                )}

                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        {branch.restaurant_name ||
                                            'Restaurante'}{' '}
                                        – {branch.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {branch.city && branch.state
                                            ? `${branch.city}, ${branch.state}`
                                            : branch.city ||
                                              'Ciudad desconocida'}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between text-xs">
                                        {/* Tiempo de entrega en amarillo */}
                                        <span className="font-medium text-yellow-500">
                                            {branch.eta_min}–{branch.eta_max}{' '}
                                            min
                                        </span>

                                        {/* Rating ya estaba en amarillo */}
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            ★
                                            <span className="text-slate-700">
                                                {Number(branch.rating).toFixed(
                                                    1,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
