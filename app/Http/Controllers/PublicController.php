<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function __construct(protected CategoryService $category_service , protected ProductService $product_service)
    {
        
    }
    public function home_page(){
        return Inertia::render("home/index",[
            "categories" => $this->category_service->GetAll(),
            "products"=>$this->product_service->GetAllProducts()
        ]);
    }


    public function product_details(string $slug){
        return Inertia::render("products/details",[
            "product"=> $this->product_service->GetProduct($slug)
        ]);
    }


    public function cart_page(){
        return Inertia::render("cart/index");
    }


    public function shop_page(){
        return Inertia::render("shop/index");
    }


    public function wishlist_page(){
        return Inertia::render("wishlist/index");
    }


    public function checkout_page(){
        return Inertia::render("checkout/index");
    }

    public function account_page(){
        return Inertia::render("account/index");
    }
    public function search_page(){
        return Inertia::render("search/index");
    }
    public function contact_page(){
        return Inertia::render("contact/index");
    }
}
