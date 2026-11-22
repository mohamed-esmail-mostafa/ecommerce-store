<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::controller(CartController::class)->group(function () {
    Route::post('/add/cart/product', 'add');
    Route::get('/cart', 'index')->name('cart.index');;
});
