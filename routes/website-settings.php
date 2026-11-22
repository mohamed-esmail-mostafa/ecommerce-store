<?php

use App\Http\Controllers\WebsiteSettingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::controller(WebsiteSettingController::class)->group(function () {
        Route::get('/website/settings/page', 'website_settings_page');
        Route::post('/admin/website-settings', 'update');
    });
});
