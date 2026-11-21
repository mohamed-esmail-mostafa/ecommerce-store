<?php

use App\Http\Controllers\BrandController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(BrandController::class)->group(function () {
        Route::get('/brands/page', 'brandsPage');
        Route::post('/brands/store', 'storeBrand');
        Route::post('/brands/update/{id}', 'updateBrand');
        Route::delete('/brands/delete/{id}', 'deleteBrand');
    });
});
