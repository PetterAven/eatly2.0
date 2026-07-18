import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface CafeBranch {
    id: number;
    name: string;
    location: string;
    phone: string;
    image: string;
    schedule: string;
}

export default function Welcome({ auth }: { auth: any }) {
    // Manejador seguro para cerrar sesión mediante POST (estándar de Laravel/Inertia)
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    // Cafeterías reales dentro del campus con imágenes atractivas de comida y café
    const cafes: CafeBranch[] = [
        {
            id: 1,
            name: "Cafetería Central UPP",
            location: "Edificio de Servicios Estudiantiles, Planta Baja",
            phone: "771 555 1234 ext. 101",
            schedule: "Lunes a Viernes - 7:00 AM a 6:00 PM",
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            name: "Snack Bar El Potro",
            location: "Anexo al Edificio de Laboratorios Pesados",
            phone: "771 555 1234 ext. 102",
            schedule: "Lunes a Viernes - 8:00 AM a 4:00 PM",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"
        }
    ];

    return (
        <>
            <Head title="Bienvenido a Eatly UPP" />
            
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
                {/* NAVBAR SUPERIOR */}
                <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    
                    {/* LOGO CON IDENTIDAD (POTRO REAL EN SVG) */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-700 text-white p-2 rounded-xl flex items-center justify-center shadow-md">
                            {/* SVG de la silueta de la cabeza de un caballo/potro */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-1.5V9a3 3 0 00-3-3h-3a3 3 0 00-3 3v.5H7.5A3 3 0 004.5 12.5V18a3 3 0 003 3h12zM6 12.5a1.5 1.5 0 011.5-1.5h1.5V14H6v-1.5zm6-5A1.5 1.5 0 0113.5 6h3a1.5 1.5 0 011.5 1.5V9h-6V7.5z" opacity=".4" />
                                <path fillRule="evenodd" d="M2.25 12c0-1.24.81-2.29 1.94-2.66A6 6 0 0115 4.5h.75a.75.75 0 01.66.41l1.5 3a.75.75 0 01-.07.82l-1.5 2a.75.75 0 01-.6.27H12.5a3.75 3.75 0 00-3.48 2.37l-.54 1.36a.75.75 0 01-.7.48H4.5a2.25 2.25 0 01-2.25-2.25v-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-purple-950 block">EATLY UPP</span>
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block -mt-1">La app de los Potros</span>
                        </div>
                    </div>

                    {/* BOTONES DE AUTENTICACIÓN / DATOS DE USUARIO */}
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <div className="flex items-center space-x-3 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                                <span className="text-sm font-semibold text-purple-900">
                                    🐴 {auth.user.name.split(' ')[0]}
                                </span>
                                <div className="h-4 w-px bg-purple-200"></div>
                                {/* BOTÓN DE CERRAR SESIÓN (MÁXIMA SEGURIDAD VIA POST) */}
                                <button 
                                    onClick={handleLogout}
                                    className="text-sm font-bold text-red-600 hover:text-red-700 transition focus:outline-none"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:text-purple-600 transition"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition shadow-sm"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* HERO SECTION */}
                <header className="max-w-6xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-950 mb-6 leading-tight">
                        Ordena en tus cafeterías <br />
                        <span className="text-purple-600">sin hacer filas eternas</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Explora los menús del día, personaliza tu pedido y recoge tu comida en ventanilla de forma rápida. Para estudiantes, docentes, personal y visitantes.
                    </p>
                </header>

                {/* SECCIÓN DE CAFETERÍAS DEL CAMPUS */}
                <section className="bg-white py-20 border-t border-gray-100 shadow-inner">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="mb-12">
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Puntos de Entrega Activos</h2>
                            <p className="text-gray-500 mt-2 text-lg">Ubicaciones y horarios oficiales dentro del campus universitario.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {cafes.map((cafe) => (
                                <div key={cafe.id} className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-200/60 flex flex-col md:flex-row transition hover:shadow-md">
                                    <div className="md:w-1/2 h-48 md:h-auto relative">
                                        <img 
                                            src={cafe.image} 
                                            alt={cafe.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6 md:w-1/2 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-purple-600 tracking-wider uppercase block mb-1">Establecimiento</span>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">{cafe.name}</h3>
                                            
                                            <div className="text-sm text-gray-600 space-y-3">
                                                <p className="flex items-start">
                                                    <span className="font-semibold text-gray-900 mr-1.5">📍</span> {cafe.location}
                                                </p>
                                                <p className="flex items-center">
                                                    <span className="font-semibold text-gray-900 mr-1.5">📞</span> {cafe.phone}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-200/60">
                                            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200/60 px-2.5 py-1 rounded-lg inline-flex items-center">
                                                🟢 {cafe.schedule}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-gray-950 text-gray-500 py-10 text-center text-sm border-t border-gray-900">
                    <p>&copy; {new Date().getFullYear()} Eatly UPP. Sistema seguro de prepago y gestión de pedidos.</p>
                </footer>
            </div>
        </>
    );
}