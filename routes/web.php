<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderHistoryController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas públicas (EATLY Landing Page y Autenticación)
|--------------------------------------------------------------------------
*/

// Landing page principal de la aplicación
Route::get('/', [HomeController::class, 'welcome'])->name('welcome');
Route::get('/home', [HomeController::class, 'welcome'])->name('home');

Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

// Registro público de Cafeterías / Restaurantes Partners
Route::get('/vendor/register', [VendorController::class, 'showRegister'])->name('vendor.register');
Route::post('/vendor/register', [VendorController::class, 'storeRegister'])->name('vendor.register.store');

/*
|--------------------------------------------------------------------------
| Rutas autenticadas y verificadas (Dashboard, Historial y Pagos)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Redirección por rol o vista de cliente
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Perfil de usuario
    Route::get('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'edit'])->name('profile');

    // Calificar un pedido entregado (comercio + repartidor)
    Route::post('/pedidos/{pedido}/calificar', [RatingController::class, 'store'])->name('pedidos.calificar');
    Route::patch('/pedidos/{pedido}/confirmar-entrega', [PedidoController::class, 'confirmarEntrega'])->name('pedidos.confirmar-entrega');
    Route::patch('/pedidos/{pedido}/cancelar', [PedidoController::class, 'cancelar'])->name('pedidos.cancelar');

    Route::post('/pedidos/simular-pago', [PedidoController::class, 'procesarPagoSimulado'])->name('pedidos.simular_pago');

    // Panel para Tienda / Local (Merchant)
    Route::get('/vendor', fn () => redirect()->route('vendor.dashboard'));
    Route::prefix('vendor')->name('vendor.')->middleware(['auth', 'verified', 'role:merchant'])->group(function () {
        Route::get('/dashboard', [VendorController::class, 'index'])->name('dashboard');
        Route::get('/profile', [VendorController::class, 'profile'])->name('profile');
        Route::put('/profile', [VendorController::class, 'updateProfile'])->name('profile.update');
        Route::post('/products', [VendorController::class, 'storeProduct'])->name('products.store');
        Route::put('/products/{product}', [VendorController::class, 'updateProduct'])->name('products.update');
        Route::delete('/products/{product}', [VendorController::class, 'destroyProduct'])->name('products.destroy');
        Route::match(['put', 'patch'], '/orders/{order}/status', [VendorController::class, 'updateOrderStatus'])->name('orders.status');
    });

    // Panel para Repartidor (Driver)
    Route::get('/delivery', fn () => redirect()->route('delivery.dashboard'));
    Route::prefix('delivery')->name('delivery.')->middleware(['auth', 'verified', 'role:driver'])->group(function () {
        Route::get('/dashboard', [DeliveryController::class, 'index'])->name('dashboard');
        Route::post('/orders/{order}/take', [DeliveryController::class, 'takeOrder'])->name('orders.take');
        Route::patch('/orders/{order}/status', [DeliveryController::class, 'updateOrderStatus'])->name('orders.status');
    });
});

// Ruta de Historial migrada a session-or-token para prueba A/B
Route::middleware(['session-or-token', 'verified'])->group(function () {
    Route::get('/historial', [OrderHistoryController::class, 'index'])->name('orders.history');
});

Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/');
})->name('logout');

if (file_exists(__DIR__.'/settings.php')) {
    require __DIR__.'/settings.php';
}
