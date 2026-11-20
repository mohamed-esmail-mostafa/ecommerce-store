<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(RoleController::class)->group(function () {
        Route::get('/roles/page', 'roles_page');
        Route::post('/roles/store', 'store_role');
        Route::get('/roles/find/{slug}', 'find_by_slug');
        Route::post('/roles/update/{slug}', 'update_role');
        Route::delete('/roles/delete/{slug}', 'delete_role');
    });
});
