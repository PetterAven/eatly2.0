import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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

export default function Dashboard({ auth }: { auth: any }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const products: Product[] = [
        { id: 1, name: 'Chilaquiles Tecolote con Pollo', price: 65, description: 'Totopos crujientes, salsa verde viva, crema, queso de aro y pollo deshebrado.', category: 'Comida', restaurant_name: 'Cafetería Central UPP', image: 'https://images.unsplash.com/photo-1640719028782-8230f1bdc42a?auto=format&fit=crop&w=400&q=80', local_id: 1 },
        { id: 2, name: 'Hamburguesa Monumental Potro', price: 85, description: '150g de res, queso cheddar, tocino ahumado y papas a la francesa.', category: 'Comida', restaurant_name: 'The Potro Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', local_id: 2 },
        { id: 3, name: 'Tacos de Cecina con Papas (3 pzas)', price: 55, description: 'Cecina de Yecapixtla en tortilla de maíz doble con papas fritas arriba.', category: 'Comida', restaurant_name: 'Antojitos Los Pasillos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80', local_id: 3 },
        { id: 4, name: 'Dorilocos Preparados con Todo', price: 45, description: 'Doritos, jícama, pepino, cueritos, cacahuates, chamoy y salsa secreta.', category: 'Snacks', restaurant_name: 'El Sultán Snack Bar', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80', local_id: 4 },
        { id: 5, name: 'Papas Locas con Queso y Tocino', price: 40, description: 'Papas corte francés bañadas en queso cheddar líquido y tocino picado.', category: 'Snacks', restaurant_name: 'The Potro Burger', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80', local_id: 2 },
        { id: 6, name: 'Frappé Oreo Supremo', price: 45, description: 'Base cremosa de leche, galleta Oreo triturada, crema batida y chocolate.', category: 'Bares', restaurant_name: 'Bebidas & Co. Campus', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80', local_id: 5 },
        { id: 7, name: 'Gomiboing Escarchado Fresa', price: 35, description: 'Jugo Boing frío con hielos, escarchado con miguelito, chamoy y gomitas.', category: 'Bares', restaurant_name: 'El Sultán Snack Bar', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', local_id: 4 }
    ];

    const filteredProducts = selectedCategory === 'Todos' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    const uniqueRestaurants = Array.from(new Set(filteredProducts.map(p => p.restaurant_name)));

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, amount: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = item.quantity + amount;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean) as CartItem[]);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const activeLocalId = cart.length > 0 ? (cart[0].product.local_id || 1) : 1;

    return (
        <>
            <Head title="Eatly UPP - Menú del Campus" />
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
                
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                    <span className="text-xl font-black tracking-tight">Eatly <span className="text-purple-600">Eats</span> 🐴</span>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">⚡ Entregas en el Campus</span>
                        <button onClick={() => router.post('/logout')} className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Salir</button>
                    </div>
                </header>

                <div className="flex-1 flex flex-col lg:flex-row">
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
                            {[
                                { id: 'Todos', label: '📱 Todo' },
                                { id: 'Comida', label: '🍔 Comida' },
                                { id: 'Snacks', label: '🍿 Snacks / Botanas' },
                                { id: 'Bares', label: '🥤 Bares & Bebidas' }
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition whitespace-nowrap ${
                                        selectedCategory === cat.id ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {uniqueRestaurants.map(restaurant => (
                            <div key={restaurant} className="mb-10">
                                <h2 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                                    🏢 {restaurant} <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Abierto</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredProducts.filter(p => p.restaurant_name === restaurant).map(product => (
                                        <div 
                                            key={product.id} 
                                            onClick={() => addToCart(product)}
                                            className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center gap-4 hover:border-purple-500 hover:shadow-md transition cursor-pointer group"
                                        >
                                            <div className="flex-1 flex flex-col justify-between h-24">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition">{product.name}</h3>
                                                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">{product.description}</p>
                                                </div>
                                                <span className="font-black text-sm text-gray-900">${product.price.toFixed(2)}</span>
                                            </div>
                                            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100 flex-shrink-0 shadow-inner" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </main>

                    <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-6 flex flex-col justify-between sticky lg:top-[73px] h-[calc(100vh-73px)]">
                        <div className="overflow-y-auto flex-1">
                            <h2 className="text-base font-black uppercase tracking-wider text-gray-500 mb-4">Tu Pedido</h2>
                            {cart.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-12">El carrito está vacío. Agrega tus antojos de la izquierda.</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.product.id} className="flex justify-between items-center text-xs pb-3 border-b border-gray-100">
                                            <div className="flex-1 pr-2">
                                                <p className="font-bold text-gray-900">{item.product.name}</p>
                                                <p className="text-purple-600 font-bold mt-0.5">${(item.product.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 space-x-2">
                                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -1); }} className="font-bold px-1 text-gray-500 hover:text-black">-</button>
                                                <span className="font-black text-black">{item.quantity}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, 1); }} className="font-bold px-1 text-gray-500 hover:text-black">+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-200 pt-4 bg-white">
                                <div className="flex justify-between font-black text-sm mb-4">
                                    <span>Total:</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <button 
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="w-full py-3 bg-black hover:bg-purple-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow"
                                >
                                    Proceder al Pago
                                </button>
                            </div>
                        )}
                    </aside>
                </div>

                {isCheckoutOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
                            <button 
                                onClick={() => setIsCheckoutOpen(false)} 
                                className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold z-10"
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