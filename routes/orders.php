<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::controller(OrderController::class)->group(function () {
    Route::get('/checkout', 'checkoutPage')->name('checkout.index');
    Route::post('/checkout', 'store')->name('checkout.store');
    Route::get('/order/confirmation/{order_no}', 'confirmation')->name('order.confirmation');
});

Route::middleware(['auth'])->group(function () {
    Route::controller(OrderController::class)->group(function () {
        Route::get('/orders/page', 'ordersPage')->name('orders.page');
    });
});
