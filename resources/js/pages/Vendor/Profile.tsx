import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Store, MapPin, Save, Utensils, Clock, CheckCircle2, XCircle } from 'lucide-react';
import RestaurantMapPicker from '@/components/RestaurantMapPicker';
import ImageUploadPreview from '@/components/ImageUploadPreview';

interface DaySchedule {
    open: string;
    close: string;
    closed: boolean;
}

interface Restaurant {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    image: string | null;
    schedule: Record<string, DaySchedule> | null;
}

interface Props {
    restaurant: Restaurant;
}

const DAYS = [
    { key: '1', label: 'Lunes' },
    { key: '2', label: 'Martes' },
    { key: '3', label: 'Miércoles' },
    { key: '4', label: 'Jueves' },
    { key: '5', label: 'Viernes' },
    { key: '6', label: 'Sábado' },
    { key: '0', label: 'Domingo' },
];

const defaultSchedule: Record<string, DaySchedule> = {
    '1': { open: '08:00', close: '18:00', closed: false },
    '2': { open: '08:00', close: '18:00', closed: false },
    '3': { open: '08:00', close: '18:00', closed: false },
    '4': { open: '08:00', close: '18:00', closed: false },
    '5': { open: '08:00', close: '18:00', closed: false },
    '6': { open: '09:00', close: '15:00', closed: false },
    '0': { open: '00:00', close: '00:00', closed: true },
};

export default function VendorProfile({ restaurant }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        latitude: restaurant.latitude || 19.8145,
        longitude: restaurant.longitude || -98.7389,
        image: restaurant.image || null as File | string | null,
        schedule: restaurant.schedule || defaultSchedule,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor/profile', {
            preserveScroll: true,
        });
    };

    const handleDayChange = (dayKey: string, field: keyof DaySchedule, value: string | boolean) => {
        const currentSchedule = { ...data.schedule };
        currentSchedule[dayKey] = {
            ...currentSchedule[dayKey],
            [field]: value,
        };
        setData('schedule', currentSchedule);
    };

    const copyToAllDays = (sourceDayKey: string) => {
        const source = data.schedule[sourceDayKey];
        const newSchedule: Record<string, DaySchedule> = {};
        DAYS.forEach(d => {
            newSchedule[d.key] = { ...source };
        });
        setData('schedule', newSchedule);
    };

    // Calcular estado en tiempo real (Abierto / Cerrado)
    const now = new Date();
    const currentDay = now.getDay().toString();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const todaySchedule = data.schedule?.[currentDay];
    let isOpenNow = false;
    if (todaySchedule && !todaySchedule.closed) {
        isOpenNow = currentTimeStr >= todaySchedule.open && currentTimeStr <= todaySchedule.close;
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Perfil del Restaurante', href: '/vendor/profile' }]}>
            <Head title="Perfil y Ubicación - Eatly UPP" />

            <div className="py-6 px-4 max-w-4xl mx-auto space-y-8">
                {/* Header Superior */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[#FF5722] font-bold text-xs uppercase tracking-wider mb-1">
                            <Store className="h-4 w-4" /> Gestión Profesional de Concesionario
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">Perfil y Ubicación del Local</h1>
                        <p className="text-sm text-slate-500">Configura tu portada, horarios de atención en tiempo real y la ubicación exacta para tus comensales.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${
                            isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                            {isOpenNow ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                            {isOpenNow ? 'Abierto Ahora' : 'Cerrado Ahora'}
                        </span>
                        <a
                            href="/vendor/dashboard"
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
                        >
                            <Utensils className="h-4 w-4" /> Ver Menú
                        </a>
                    </div>
                </div>

                {/* Formulario Principal */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECCIÓN 1: Foto y Portada */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            📸 Imagen Destacada del Local
                        </h2>
                        <ImageUploadPreview
                            value={data.image}
                            onChange={(file) => setData('image', file)}
                            label="Fotografía de fachada o logotipo del local"
                        />
                        {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                    </div>

                    {/* SECCIÓN 2: Información Básica */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            ℹ️ Información Comercial
                        </h2>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del Restaurante / Concesionario</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:border-[#FF5722] focus:ring-0"
                                placeholder="Ej. Cafetería Central UPP"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción corta o especialidades</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:border-[#FF5722] focus:ring-0"
                                placeholder="Ej. Chilaquiles, tortas, hamburguesas y desayunos calientes todo el día..."
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* SECCIÓN 3: Horario de Atención */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3 gap-2">
                            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#FF5722]" /> Horario de Atención por Día
                            </h2>
                            <button
                                type="button"
                                onClick={() => copyToAllDays('1')}
                                className="text-xs font-bold text-[#FF5722] hover:bg-orange-50 px-3 py-1.5 rounded-xl transition border border-orange-200/60"
                            >
                                Copiar horario del lunes a todos los días
                            </button>
                        </div>

                        <div className="space-y-3">
                            {DAYS.map(day => {
                                const sch = data.schedule[day.key] || { open: '08:00', close: '17:00', closed: false };
                                return (
                                    <div key={day.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 gap-3">
                                        <div className="flex items-center gap-3 w-36">
                                            <input
                                                type="checkbox"
                                                id={`closed-${day.key}`}
                                                checked={!sch.closed}
                                                onChange={e => handleDayChange(day.key, 'closed', !e.target.checked)}
                                                className="w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722]"
                                            />
                                            <label htmlFor={`closed-${day.key}`} className="font-bold text-xs text-slate-900 cursor-pointer">
                                                {day.label}
                                            </label>
                                        </div>

                                        {sch.closed ? (
                                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">Cerrado todo el día</span>
                                        ) : (
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-slate-400">Apertura</span>
                                                    <input
                                                        type="time"
                                                        value={sch.open}
                                                        onChange={e => handleDayChange(day.key, 'open', e.target.value)}
                                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                                                    />
                                                </div>
                                                <span className="text-slate-400 font-bold">-</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-slate-400">Cierre</span>
                                                    <input
                                                        type="time"
                                                        value={sch.close}
                                                        onChange={e => handleDayChange(day.key, 'close', e.target.value)}
                                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECCIÓN 4: Mapa y Ubicación */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#FF5722]" /> Ubicación Exacta en el Campus
                        </h2>

                        <RestaurantMapPicker
                            latitude={Number(data.latitude)}
                            longitude={Number(data.longitude)}
                            onChange={(lat, lng, addr) => {
                                setData(data => ({
                                    ...data,
                                    latitude: lat,
                                    longitude: lng,
                                    address: addr
                                }));
                            }}
                        />

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección referencial</label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                                placeholder="Ej. Edificio de Servicios Estudiantiles, Planta Baja"
                            />
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                        </div>
                    </div>

                    {/* Botón de Acción Sticky */}
                    <div className="sticky bottom-4 z-40 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-slate-200 flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full md:w-auto px-8 py-4 bg-[#FF5722] hover:bg-[#F4511E] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Save className="h-5 w-5" /> Guardar Perfil y Horario
                        </button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
