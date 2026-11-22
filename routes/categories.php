<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'categoriesPgae');
        Route::post('/store/categories', 'storeCategory');
        Route::put('/update/category/{slug}', 'updateCategory');
        Route::delete('/delete/category/{slug}', 'delete_category');
    });
});
