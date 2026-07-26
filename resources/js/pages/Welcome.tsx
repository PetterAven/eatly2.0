import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

interface CafeBranch {
    id: number;
    name: string;
    location: string;
    phone: string;
    image: string;
    schedule: string;
}

export default function Welcome({ auth }: { auth: any }) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const cafes: CafeBranch[] = [
        {
            id: 1,
            name: 'Cafetería Central UPP',
            location: 'Edificio de Servicios Estudiantiles, Planta Baja',
            phone: '771 555 1234 ext. 101',
            schedule: 'Lunes a Viernes - 7:00 AM a 6:00 PM',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 2,
            name: 'Snack Bar El Potro',
            location: 'Anexo al Edificio de Laboratorios Pesados',
            phone: '771 555 1234 ext. 102',
            schedule: 'Lunes a Viernes - 8:00 AM a 4:00 PM',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        },
    ];

    return (
        <>
            <Head title="Bienvenido a Eatly UPP" />

            <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
                {}
                <nav className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center rounded-2xl bg-purple-600 p-2 text-white shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-7 w-7"
                            >
                                <path
                                    d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-1.5V9a3 3 0 00-3-3h-3a3 3 0 00-3 3v.5H7.5A3 3 0 004.5 12.5V18a3 3 0 003 3h12zM6 12.5a1.5 1.5 0 011.5-1.5h1.5V14H6v-1.5zm6-5A1.5 1.5 0 0113.5 6h3a1.5 1.5 0 011.5 1.5V9h-6V7.5z"
                                    opacity=".4"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M2.25 12c0-1.24.81-2.29 1.94-2.66A6 6 0 0115 4.5h.75a.75.75 0 01.66.41l1.5 3a.75.75 0 01-.07.82l-1.5 2a.75.75 0 01-.6.27H12.5a3.75 3.75 0 00-3.48 2.37l-.54 1.36a.75.75 0 01-.7.48H4.5a2.25 2.25 0 01-2.25-2.25v-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-xl font-black tracking-tight text-purple-950">
                                EATLY UPP
                            </span>
                            <span className="-mt-1 block text-xs font-bold tracking-widest text-purple-600 uppercase">
                                LA APP DE LOS POTROS
                            </span>
                        </div>
                    </div>

                    {}
                    <div className="flex items-center space-x-6">
                        {auth?.user ? (
                            <div className="flex items-center space-x-3 rounded-xl border border-purple-100 bg-purple-50 px-4 py-2">
                                <span className="text-sm font-semibold text-purple-900">
                                    🐴 {auth.user.name.split(' ')[0]}
                                </span>
                                <div className="h-4 w-px bg-purple-200"></div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-bold text-red-600 hover:text-red-700"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-gray-600 transition hover:text-purple-700"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-purple-700"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {}
                <header className="mx-auto max-w-6xl px-6 py-20 text-center">
                    <h1 className="mb-6 text-5xl leading-tight font-black tracking-tight text-gray-950 md:text-6xl">
                        Ordena en tus cafeterías <br />
                        <span className="text-purple-600">
                            sin hacer filas eternas
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
                        Explora los menús del día, personaliza tu pedido y
                        recoge tu comida en ventanilla de forma rápida.
                    </p>
                </header>

                {}
                <section className="border-t border-gray-100 bg-white py-16 shadow-inner">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                Puntos de Entrega Activos
                            </h2>
                            <p className="mt-2 text-lg text-gray-500">
                                Ubicaciones y horarios oficiales dentro del
                                campus universitario.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                            {cafes.map((cafe) => (
                                <div
                                    key={cafe.id}
                                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-gray-50 shadow-sm transition hover:shadow-md md:flex-row"
                                >
                                    <div className="relative h-48 md:h-auto md:w-1/2">
                                        <img
                                            src={cafe.image}
                                            alt={cafe.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between p-6 md:w-1/2">
                                        <div>
                                            <span className="mb-1 block text-xs font-bold tracking-wider text-purple-600 uppercase">
                                                Establecimiento
                                            </span>
                                            <h3 className="mb-4 text-xl font-bold text-gray-900">
                                                {cafe.name}
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p>📍 {cafe.location}</p>
                                                <p>📞 {cafe.phone}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 border-t border-gray-200/60 pt-4">
                                            <span className="inline-flex items-center rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                                                🟢 {cafe.schedule}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
