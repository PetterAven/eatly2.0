<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\OrderHistoryController;
use App\Http\Controllers\RatingController;

Route::get('/', [HomeController::class, 'welcome'])->name('welcome');


Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');


Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');

    Route::get('/historial', [OrderHistoryController::class, 'index'])->name('orders.history');

    Route::post('/pedidos/{pedido}/calificar', [RatingController::class, 'store'])->name('pedidos.calificar');

    Route::post('/pedidos/simular-pago', [PedidoController::class, 'procesarPagoSimulado'])->name('pedidos.simular_pago');
});

if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}