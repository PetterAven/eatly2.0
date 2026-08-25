import { Upload, X } from 'lucide-react';
import React, { useState } from 'react';

interface ImageUploadPreviewProps {
    value?: string | File | null;
    onChange: (file: File | string | null) => void;
    label?: string;
}

export default function ImageUploadPreview({
    value,
    onChange,
    label = 'Foto principal',
}: ImageUploadPreviewProps) {
    const [preview, setPreview] = useState<string | null>(
        typeof value === 'string' ? value : null,
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
            <label className="block text-xs font-bold text-slate-700 uppercase">
                {label}
            </label>

            {preview ? (
                <div className="group relative h-48 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-3 right-3 transform rounded-full bg-red-600 p-1.5 text-white shadow-lg transition hover:bg-red-700 active:scale-95"
                        title="Eliminar imagen"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <label className="group flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-[#FF5722] hover:bg-orange-50/30">
                    <div className="flex flex-col items-center justify-center px-4 pt-5 pb-6 text-center">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] transition group-hover:scale-110">
                            <Upload className="h-5 w-5" />
                        </div>
                        <p className="mb-1 text-xs font-bold text-slate-700">
                            Sube o arrastra la foto en alta calidad
                        </p>
                        <p className="text-[11px] text-slate-400">
                            PNG, JPG o WEBP (máx. 5MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}
