import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

interface MapPickerProps {
    latitude: number;
    longitude: number;
    address?: string;
    onChange: (lat: number, lng: number, address: string) => void;
}

// Icono personalizado con SVG para evitar problemas de assets rotos en Leaflet
const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: #FF5722; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">📍</div>`,
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
}: MapPickerProps) {
    const [position, setPosition] = useState<[number, number]>([
        latitude || 19.8145,
        longitude || -98.7389,
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
            );
            const results = await res.json();
            if (results && results.length > 0) {
                const lat = parseFloat(results[0].lat);
                const lon = parseFloat(results[0].lon);
                const newPos: [number, number] = [lat, lon];
                setPosition(newPos);
                onChange(lat, lon, results[0].display_name);
            }
        } catch (err) {
            console.error('Error buscando dirección:', err);
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
                💡 Haz clic en el mapa o arrastra el pin naranja para ubicar con
                exactitud tu local.
            </p>
        </div>
    );
}
