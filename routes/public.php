<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::controller(PublicController::class)->group(function () {
    Route::get('/', 'home_page')->name('home');
    Route::get('/product/{slug}/details', 'product_details')->name('product.details.page');
    Route::get('/shop/page', 'shop_page')->name('shop.page');
    Route::get('/wishlist/page', 'wishlist_page')->name('wishlist.page');
    Route::get('/account/page', 'account_page')->name('account.page')->middleware('auth');
    Route::get('/search/page', 'search_page')->name('search.page');
    Route::get('/contact/page', 'contact_page')->name('contact.page');
});

Route::get('/cart/page', [CartController::class, 'index'])->name('cart.page');
Route::get('/checkout/page', [OrderController::class, 'checkoutPage'])->name('checkout.page');
