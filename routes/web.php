<?php

use App\Http\Controllers\CloudinaryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::controller(CloudinaryController::class)->group(function () {
        Route::get('/cloud/signature', 'getUploadSignture');
    });
});

require __DIR__.'/public.php';
require __DIR__.'/settings.php';
require __DIR__.'/website-settings.php';
require __DIR__.'/suppliers.php';
require __DIR__.'/categories.php';
require __DIR__.'/products.php';
require __DIR__.'/orders.php';
require __DIR__.'/banners.php';
require __DIR__.'/roles.php';
require __DIR__.'/brands.php';
require __DIR__.'/cart.php';
