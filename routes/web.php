<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\PedidoController;

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
| Rutas autenticadas y verificadas (Dashboard e Integración de Pagos)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Renderiza el componente Dashboard real de React / Inertia
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');

    // Ruta transaccional para simular el pago y la distribución del dinero en el campus
    Route::post('/pedidos/simular-pago', [PedidoController::class, 'procesarPagoSimulado'])->name('pedidos.simular_pago');
});

// Incluir configuraciones adicionales de Laravel
require __DIR__ . '/settings.php';