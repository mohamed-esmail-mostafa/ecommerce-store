<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Models\Banner;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function bannersPgae(){
        return Inertia::render("banners/index");
    }
}
