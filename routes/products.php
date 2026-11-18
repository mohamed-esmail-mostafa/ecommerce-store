<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(ProductController::class)->group(function () {
        Route::get('/products/page', 'productsPage');
        Route::post('/store/product', 'storeProduct');
        Route::get('/create/product/page', 'create_product_page');
        Route::post('/store/product', 'store_product');
    });
});
