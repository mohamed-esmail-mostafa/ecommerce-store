<?php


use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(SupplierController::class)->group(function () {
       Route::get('/suppliers/page','suppliers_page');
       Route::post('/suppliers/store','store_supplier');
       Route::post('/suppliers/update/{slug}','update_supplier');
       Route::delete('/supplier/delete/{slug}','delete_supplier');
      
    });
});