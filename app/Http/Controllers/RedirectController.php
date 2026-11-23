<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class RedirectController extends Controller
{
    public function redirect_user()
    {

        dd(Auth::user());
    }
}
