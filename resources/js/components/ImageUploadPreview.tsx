import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadPreviewProps {
    value?: string | File | null;
    onChange: (file: File | string | null) => void;
    label?: string;
}

export default function ImageUploadPreview({ value, onChange, label = "Foto principal" }: ImageUploadPreviewProps) {
    const [preview, setPreview] = useState<string | null>(
        typeof value === 'string' ? value : null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">{label}</label>
            
            {preview ? (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-3 right-3 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition transform active:scale-95"
                        title="Eliminar imagen"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-300 hover:border-[#FF5722] rounded-2xl cursor-pointer bg-slate-50 hover:bg-orange-50/30 transition group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF5722] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                            <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 mb-1">Sube o arrastra la foto en alta calidad</p>
                        <p className="text-[11px] text-slate-400">PNG, JPG o WEBP (máx. 5MB)</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            )}
        </div>
    );
}
