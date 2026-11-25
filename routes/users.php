<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::get('/users/page', 'users_page')->name('users.index');
        Route::post('/users/store', 'store_user')->name('users.store');
        Route::post('/users/update/{id}', 'update_user')->name('users.update');
        Route::post('/users/change-role/{id}', 'change_role')->name('users.change-role');
        Route::delete('/users/delete/{id}', 'delete_user')->name('users.delete');
        Route::get('/my/account', 'my_account')->name('my.account');
        Route::post('/my/account/profile', 'update_account_profile')->name('my.account.profile');
        Route::post('/my/account/password', 'update_account_password')->name('my.account.password');
    });
});
