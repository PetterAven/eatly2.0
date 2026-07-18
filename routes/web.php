<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\OrderHistoryController;
use App\Http\Controllers\RatingController;

/*
|--------------------------------------------------------------------------
| Rutas públicas (EATLY Landing Page y Autenticación)
|--------------------------------------------------------------------------
*/

// Landing page principal de la aplicación
Route::get('/', [HomeController::class, 'welcome'])->name('welcome');

// Rutas de autenticación con Google (Socialite)
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

/*
|--------------------------------------------------------------------------
| Rutas autenticadas y verificadas (Dashboard, Historial y Pagos)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Renderiza el componente Dashboard real de React / Inertia
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');

    // Historial de compras del cliente
    Route::get('/historial', [OrderHistoryController::class, 'index'])->name('orders.history');

    // Calificar un pedido entregado (comercio + repartidor)
    Route::post('/pedidos/{pedido}/calificar', [RatingController::class, 'store'])->name('pedidos.calificar');

    // Ruta transaccional para simular el pago y la distribución del dinero en el campus
    Route::post('/pedidos/simular-pago', [PedidoController::class, 'procesarPagoSimulado'])->name('pedidos.simular_pago');
});

// Incluir configuraciones adicionales de Laravel
require __DIR__ . '/settings.php';