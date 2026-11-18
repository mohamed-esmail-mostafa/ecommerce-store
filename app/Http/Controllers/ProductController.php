<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\CategoryService;
use App\Services\ProductService;
use App\Services\SupplierService;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $product_service,
        protected SupplierService $supplier_service,
        protected CategoryService $category_service
        ) {}


    public function productsPage() {
        return Inertia::render('products/index',[
            'products'=>$this->product_service->GetAllProducts(),
            'suppliers'=>$this->supplier_service->GetAll(),
            'categories'=>$this->category_service->GetAll()
        ]);
    }
    public function create_product_page() {
        return Inertia::render('products/create',[
            'suppliers'=>$this->supplier_service->GetAll(),
            'categories'=>$this->category_service->GetAll()
        ]);
    }



    public function store_product(StoreProductRequest $request){
        
        $this->product_service->StoreProduct($request);
        return redirect()->back();
    }


    
}
