<?php

namespace App\Http\Controllers;

use App\Services\CloudinaryService;
use Illuminate\Http\Request;

class CloudinaryController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary_service){}
    public function getUploadSignture(){
     return  $this->cloudinary_service->uploadSignture();
    }
}
