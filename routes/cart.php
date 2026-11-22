<?php

use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::controller(CartController::class)->group(function () {
    Route::post('/add/cart/product', 'add')->name('cart.add');
    Route::get('/cart', 'index')->name('cart.index');
    Route::patch('/cart/items/{item}', 'update')->name('cart.items.update');
    Route::delete('/cart/items/{item}', 'destroy')->name('cart.items.destroy');
    Route::delete('/cart/clear', 'clear')->name('cart.clear');
});
