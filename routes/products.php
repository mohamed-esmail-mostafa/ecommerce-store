<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(ProductController::class)->group(function () {
        Route::get('/products/page', 'productsPage')->name('products.page');
        Route::get('/create/product/page', 'create_product_page')->name('products.create');
        Route::post('/store/product', 'store_product')->name('products.store');
        Route::get('/products/update/{identifier}', 'edit_product_page')->name('products.edit');
        Route::post('/products/update/{id}', 'update_product')->name('products.update');
        Route::delete('/products/delete/{id}', 'delete_product')->name('products.delete');
        Route::post('/products/bulk-delete', 'bulk_delete_products')->name('products.bulk-delete');
    });
});
