import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

interface MapPickerProps {
    readonly latitude: number;
    readonly longitude: number;
    readonly onChange: (lat: number, lng: number, address: string) => void;
}

// Icono personalizado con SVG para evitar problemas de assets rotos en Leaflet
const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: #FF5722; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">•</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

function LocationMarker({
    position,
    setPosition,
    onChange,
}: {
    position: [number, number];
    setPosition: (pos: [number, number]) => void;
    onChange: (lat: number, lng: number, address: string) => void;
}) {
    useMapEvents({
        click(e) {
            const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
            setPosition(newPos);
            fetchAddress(newPos[0], newPos[1], onChange);
        },
    });

    return position === null ? null : (
        <Marker
            position={position}
            icon={customIcon}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const coord = marker.getLatLng();
                    const newPos: [number, number] = [coord.lat, coord.lng];
                    setPosition(newPos);
                    fetchAddress(newPos[0], newPos[1], onChange);
                },
            }}
        />
    );
}

async function fetchAddress(
    lat: number,
    lng: number,
    onChange: (lat: number, lng: number, address: string) => void,
) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        const data = await response.json();
        const addressText = data.display_name || `${lat}, ${lng}`;
        onChange(lat, lng, addressText);
    } catch {
        onChange(lat, lng, `${lat}, ${lng}`);
    }
}

export default function RestaurantMapPicker({
    latitude,
    longitude,
    onChange,
}: Readonly<MapPickerProps>) {
    const [position, setPosition] = useState<[number, number]>([
        latitude || 19.8145,
        longitude || -98.7389,
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert(
                'Tu navegador no permite obtener la ubicación. Usa el mapa o el buscador.',
            );
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nextPosition: [number, number] = [
                    position.coords.latitude,
                    position.coords.longitude,
                ];
                setPosition(nextPosition);
                fetchAddress(nextPosition[0], nextPosition[1], onChange);
                setLocating(false);
            },
            () => {
                alert(
                    'No se pudo obtener tu ubicación. Revisa los permisos e inténtalo de nuevo.',
                );
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        const query = searchQuery.trim().toLowerCase();

        // Campus UPP predefined locations/fallback
        const campusLocations: Record<
            string,
            { lat: number; lng: number; name: string }
        > = {
            upp: {
                lat: 19.8145,
                lng: -98.7389,
                name: 'Universidad Politécnica de Pachuca (Campus Principal)',
            },
            edificio: {
                lat: 19.8148,
                lng: -98.7392,
                name: 'Campus UPP - Edificio Académico',
            },
            cafeteria: {
                lat: 19.8142,
                lng: -98.7385,
                name: 'Campus UPP - Zona de Cafeterías y Concesionarios',
            },
            biblioteca: {
                lat: 19.815,
                lng: -98.7395,
                name: 'Campus UPP - Biblioteca Central',
            },
            canchas: {
                lat: 19.8138,
                lng: -98.738,
                name: 'Campus UPP - Canchas Deportivas',
            },
            rectoria: {
                lat: 19.8152,
                lng: -98.7382,
                name: 'Campus UPP - Edificio de Rectoría y Administrativo',
            },
            servicios: {
                lat: 19.8143,
                lng: -98.7388,
                name: 'Campus UPP - Edificio de Servicios Estudiantiles',
            },
            pachuca: {
                lat: 20.1237,
                lng: -98.7364,
                name: 'Pachuca de Soto, Hidalgo',
            },
        };

        // Check if query matches any campus keyword
        for (const [key, loc] of Object.entries(campusLocations)) {
            if (query.includes(key)) {
                const newPos: [number, number] = [loc.lat, loc.lng];
                setPosition(newPos);
                onChange(loc.lat, loc.lng, loc.name);
                setSearching(false);
                return;
            }
        }

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
                {
                    headers: {
                        'User-Agent': 'EatlyEatsUPP/1.0 (eatly@upp.edu.mx)',
                    },
                },
            );
            const results = await res.json();
            if (results && results.length > 0) {
                const lat = Number.parseFloat(results[0].lat);
                const lon = Number.parseFloat(results[0].lon);
                const newPos: [number, number] = [lat, lon];
                setPosition(newPos);
                onChange(lat, lon, results[0].display_name);
            } else {
                // Fallback to UPP campus center if not found externally
                const defaultLat = 19.8145;
                const defaultLng = -98.7389;
                const defaultAddr = `Campus UPP - Ubicación: ${searchQuery}`;
                setPosition([defaultLat, defaultLng]);
                onChange(defaultLat, defaultLng, defaultAddr);
                alert(
                    `No se encontró "${searchQuery}" en mapas externos, pero se ha asignado al Campus UPP. Puedes ajustar el pin o la dirección manualmente.`,
                );
            }
        } catch (err) {
            console.error('Error buscando dirección:', err);
            const defaultLat = 19.8145;
            const defaultLng = -98.7389;
            const defaultAddr = `Campus UPP - Ubicación: ${searchQuery}`;
            setPosition([defaultLat, defaultLng]);
            onChange(defaultLat, defaultLng, defaultAddr);
            alert(
                'No se pudo conectar con el servicio de mapas externos. Se ha asignado la ubicación principal en el Campus UPP.',
            );
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Buscador Nominatim */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar dirección o lugar (ej. UPP, Pachuca)..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
                <button
                    type="submit"
                    disabled={searching}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white uppercase transition hover:bg-slate-800"
                >
                    {searching ? 'Buscando...' : 'Buscar'}
                </button>
            </form>
            <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locating}
                className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-[#FF5722] transition hover:bg-orange-100 disabled:opacity-50"
            >
                {locating
                    ? 'Obteniendo ubicación...'
                    : 'Usar mi ubicación actual'}
            </button>

            <div className="relative z-0 h-[300px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        position={position}
                        setPosition={setPosition}
                        onChange={onChange}
                    />
                </MapContainer>
            </div>
            <p className="text-[11px] text-slate-400">
                Haz clic en el mapa o arrastra el pin naranja para ubicar con
                exactitud tu local.
            </p>
        </div>
    );
}
