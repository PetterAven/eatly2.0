import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import StarRating from './StarRating';

interface RatingModalProps {
    orderId: number;
    branchName: string;
    hasDriver: boolean;
    onClose: () => void;
}

export default function RatingModal({
    orderId,
    branchName,
    hasDriver,
    onClose,
}: RatingModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        branch_stars: 0,
        branch_comment: '',
        driver_stars: 0,
        driver_comment: '',
    });

    const [step, setStep] = useState<'branch' | 'driver'>('branch');

    const canContinue = data.branch_stars > 0;
    const canSubmit = hasDriver ? data.driver_stars > 0 : canContinue;

    const handleSubmit = () => {
        // Apunta a la ruta en español con comillas invertidas correctas
        post(`/pedidos/${orderId}/calificar`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                {}
                {step === 'branch' && (
                    <>
                        <h2 className="text-lg font-bold text-gray-900">
                            ¿Cómo estuvo tu comida de {branchName}?
                        </h2>
                        <p className="mb-4 text-sm text-gray-500">
                            Califica las porciones, sabor y empaquetado.
                        </p>

                        <div className="mb-4 flex justify-center">
                            <StarRating
                                value={data.branch_stars}
                                onChange={(s) => setData('branch_stars', s)}
                            />
                        </div>

                        <textarea
                            value={data.branch_comment}
                            onChange={(e) =>
                                setData('branch_comment', e.target.value)
                            }
                            placeholder="Deja un comentario para el local (opcional)..."
                            className="mb-2 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                            rows={3}
                            maxLength={500}
                        />
                        {errors.branch_stars && (
                            <p className="mb-2 text-sm text-red-500">
                                {errors.branch_stars}
                            </p>
                        )}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                            >
                                Omitir
                            </button>
                            {hasDriver ? (
                                <button
                                    onClick={() => setStep('driver')}
                                    disabled={!canContinue}
                                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-40"
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit || processing}
                                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-40"
                                >
                                    {processing ? 'Enviando...' : 'Enviar'}
                                </button>
                            )}
                        </div>
                    </>
                )}

                {}
                {step === 'driver' && (
                    <>
                        <h2 className="text-lg font-bold text-gray-900">
                            ¿Cómo te atendió tu repartidor?
                        </h2>
                        <p className="mb-4 text-sm text-gray-500">
                            Califica la velocidad y amabilidad de tu entrega.
                        </p>

                        <div className="mb-4 flex justify-center">
                            <StarRating
                                value={data.driver_stars}
                                onChange={(s) => setData('driver_stars', s)}
                            />
                        </div>

                        <textarea
                            value={data.driver_comment}
                            onChange={(e) =>
                                setData('driver_comment', e.target.value)
                            }
                            placeholder="Escribe un mensaje para tu repartidor..."
                            className="mb-2 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                            rows={3}
                            maxLength={500}
                        />
                        {errors.driver_stars && (
                            <p className="mb-2 text-sm text-red-500">
                                {errors.driver_stars}
                            </p>
                        )}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setStep('branch')}
                                className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit || processing}
                                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-40"
                            >
                                {processing ? 'Enviando...' : 'Enviar'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
