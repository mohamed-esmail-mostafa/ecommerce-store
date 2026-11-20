<?php

use App\Http\Controllers\BannerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(BannerController::class)->group(function () {
        Route::get('/banners/page', 'bannersPage');
        Route::post('/banners/store', 'storeBanner');
        Route::post('/banners/update/{banner}', 'updateBanner');
        Route::delete('/banners/delete/{banner}', 'deleteBanner');
        Route::patch('/banners/toggle/{banner}', 'toggleStatus');
    });
});
