import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import CheckoutForm from './Checkout/CheckoutForm';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: 'Comida' | 'Snacks' | 'Bares';
    restaurant_name: string;
    image: string;
    local_id?: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface DashboardProps {
    auth?: any;
}

export default function Dashboard({ auth }: DashboardProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

    const products: Product[] = [
        {
            id: 1,
            name: 'Chilaquiles Tecolote con Pollo',
            price: 65,
            description:
                'Totopos crujientes, salsa verde viva, crema, queso de aro y pollo deshebrado.',
            category: 'Comida',
            restaurant_name: 'Cafetería Central UPP',
            image: 'https://images.unsplash.com/photo-1640719028782-8230f1bdc42a?auto=format&fit=crop&w=400&q=80',
            local_id: 1,
        },
        {
            id: 2,
            name: 'Hamburguesa Monumental Potro',
            price: 85,
            description:
                '150g de res, queso cheddar, tocino ahumado y papas a la francesa.',
            category: 'Comida',
            restaurant_name: 'The Potro Burger',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
            local_id: 2,
        },
        {
            id: 3,
            name: 'Tacos de Cecina con Papas (3 pzas)',
            price: 55,
            description:
                'Cecina de Yecapixtla en tortilla de maíz doble con papas fritas arriba.',
            category: 'Comida',
            restaurant_name: 'Antojitos Los Pasillos',
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
            local_id: 3,
        },
        {
            id: 4,
            name: 'Dorilocos Preparados con Todo',
            price: 45,
            description:
                'Doritos, jícama, pepino, cueritos, cacahuates, chamoy y salsa secreta.',
            category: 'Snacks',
            restaurant_name: 'El Sultán Snack Bar',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80',
            local_id: 4,
        },
        {
            id: 5,
            name: 'Papas Locas con Queso y Tocino',
            price: 40,
            description:
                'Papas corte francés bañadas en queso cheddar líquido y tocino picado.',
            category: 'Snacks',
            restaurant_name: 'The Potro Burger',
            image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80',
            local_id: 2,
        },
        {
            id: 6,
            name: 'Frappé Oreo Supremo',
            price: 45,
            description:
                'Base cremosa de leche, galleta Oreo triturada, crema batida y chocolate.',
            category: 'Bares',
            restaurant_name: 'Bebidas & Co. Campus',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
            local_id: 5,
        },
        {
            id: 7,
            name: 'Gomiboing Escarchado Fresa',
            price: 35,
            description:
                'Jugo Boing frío con hielos, escarchado con miguelito, chamoy y gomitas.',
            category: 'Bares',
            restaurant_name: 'El Sultán Snack Bar',
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
            local_id: 4,
        },
    ];

    const filteredProducts =
        selectedCategory === 'Todos'
            ? products
            : products.filter((p) => p.category === selectedCategory);

    const uniqueRestaurants = Array.from(
        new Set(filteredProducts.map((p) => p.restaurant_name)),
    );

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find(
                (item) => item.product.id === product.id,
            );
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, amount: number) => {
        setCart(
            (prev) =>
                prev
                    .map((item) => {
                        if (item.product.id === productId) {
                            const newQty = item.quantity + amount;
                            return newQty > 0
                                ? { ...item, quantity: newQty }
                                : null;
                        }
                        return item;
                    })
                    .filter(Boolean) as CartItem[],
        );
    };

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const activeLocalId = cart.length > 0 ? cart[0]?.product?.local_id || 1 : 1;

    return (
        <>
            <Head title="Eatly UPP - Menú del Campus" />
            <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
                {}
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                    <span className="text-xl font-black tracking-tight">
                        Eatly <span className="text-purple-600">Eats</span> 🐴
                    </span>
                    <div className="flex items-center space-x-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                            ⚡ Entregas en el Campus
                        </span>
                        <Link
                            href="/historial"
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-purple-600 transition hover:bg-purple-50"
                        >
                            📋 Mis Pedidos
                        </Link>
                        <button
                            onClick={() => router.post('/logout')}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                            Salir
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 flex-col lg:flex-row">
                    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                        {}
                        <div className="mb-8 flex space-x-3 overflow-x-auto pb-2">
                            {[
                                { id: 'Todos', label: '📱 Todo' },
                                { id: 'Comida', label: '🍔 Comida' },
                                { id: 'Snacks', label: '🍿 Snacks / Botanas' },
                                { id: 'Bares', label: '🥤 Bares & Bebidas' },
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`rounded-full px-5 py-2.5 text-xs font-black tracking-wide whitespace-nowrap transition ${
                                        selectedCategory === cat.id
                                            ? 'bg-black text-white'
                                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {}
                        {uniqueRestaurants.map((restaurant) => (
                            <div key={restaurant} className="mb-10">
                                <h2 className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2 text-lg font-black text-gray-900">
                                    🏢 {restaurant}{' '}
                                    <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                        Abierto
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {filteredProducts
                                        .filter(
                                            (p) =>
                                                p.restaurant_name ===
                                                restaurant,
                                        )
                                        .map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                                className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-purple-500 hover:shadow-md"
                                            >
                                                <div className="flex h-24 flex-1 flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-gray-900 transition group-hover:text-purple-600">
                                                            {product.name}
                                                        </h3>
                                                        <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                                                            {
                                                                product.description
                                                            }
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900">
                                                        $
                                                        {product.price.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-24 w-24 flex-shrink-0 rounded-lg bg-gray-100 object-cover shadow-inner"
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </main>

                    {}
                    <aside className="sticky flex h-[calc(100vh-73px)] w-full flex-col justify-between border-t border-gray-200 bg-white p-6 lg:top-[73px] lg:w-80 lg:border-t-0 lg:border-l">
                        <div className="flex-1 overflow-y-auto">
                            <h2 className="mb-4 text-base font-black tracking-wider text-gray-500 uppercase">
                                Tu Pedido
                            </h2>
                            {cart.length === 0 ? (
                                <p className="py-12 text-center text-xs text-gray-400">
                                    El carrito está vacío. Agrega tus antojos de
                                    la izquierda.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs"
                                        >
                                            <div className="flex-1 pr-2">
                                                <p className="font-bold text-gray-900">
                                                    {item.product.name}
                                                </p>
                                                <p className="mt-0.5 font-bold text-purple-600">
                                                    $
                                                    {(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-full bg-gray-100 px-2 py-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(
                                                            item.product.id,
                                                            -1,
                                                        );
                                                    }}
                                                    className="px-1 font-bold text-gray-500 hover:text-black"
                                                >
                                                    -
                                                </button>
                                                <span className="font-black text-black">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(
                                                            item.product.id,
                                                            1,
                                                        );
                                                    }}
                                                    className="px-1 font-bold text-gray-500 hover:text-black"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-200 bg-white pt-4">
                                <div className="mb-4 flex justify-between text-sm font-black">
                                    <span>Total:</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="w-full rounded-xl bg-black py-3 text-xs font-bold tracking-wider text-white uppercase shadow transition hover:bg-purple-700"
                                >
                                    Proceder al Pago
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                {}
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                            <button
                                onClick={() => setIsCheckoutOpen(false)}
                                className="absolute top-4 right-4 z-10 font-bold text-gray-400 hover:text-black"
                            >
                                ✕
                            </button>

                            <CheckoutForm
                                subtotalComida={cartTotal}
                                localId={activeLocalId}
                                itemsCarrito={cart}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
