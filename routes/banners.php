<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(BannerController::class)->group(function () {
        Route::get('/banners/page', 'bannersPgae');
    });
});
