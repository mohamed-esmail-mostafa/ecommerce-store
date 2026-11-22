<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(OrderController::class)->group(function () {
        Route::get('/orders/page', 'ordersPage');
    });
});
