<?php

use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(SupplierController::class)->group(function () {
        Route::get('/suppliers/page', 'suppliers_page')->name('suppliers.index');
        Route::post('/suppliers/store', 'store_supplier')->name('suppliers.store');
        Route::post('/suppliers/update/{slug}', 'update_supplier')->name('suppliers.update');
        Route::post('/suppliers/toggle-status/{slug}', 'toggle_status')->name('suppliers.toggle-status');
        Route::delete('/supplier/delete/{slug}', 'delete_supplier')->name('suppliers.delete');
    });
});
