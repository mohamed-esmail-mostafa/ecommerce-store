<?php

use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(ReviewController::class)->group(function () {
        Route::get('/reviews/page', 'reviews_page')->name('reviews.index');
        Route::post('/reviews/toggle-approval/{id}', 'toggle_approval')->name('reviews.toggle-approval');
        Route::post('/reviews/update/{id}', 'update_review')->name('reviews.update');
        Route::delete('/reviews/delete/{id}', 'delete_review')->name('reviews.delete');
    });
});
