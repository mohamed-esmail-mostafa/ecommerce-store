<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Services\BrandService;
use App\Services\CategoryService;
use App\Services\ProductService;
use App\Services\SupplierService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $product_service,
        protected SupplierService $supplier_service,
        protected CategoryService $category_service,
        protected BrandService $brand_service
    ) {}

    public function productsPage(Request $request): Response
    {
        $search = $request->query('search');

        return Inertia::render('products/index', [
            'products' => $this->product_service->GetAllProducts($search),
            'filters' => [
                'search' => $search,
            ],
            'suppliers' => $this->supplier_service->GetAll(),
            'categories' => $this->category_service->GetAll(),
            'brands' => $this->brand_service->getAllBrands(),
        ]);
    }

    public function create_product_page(): Response
    {
        return Inertia::render('products/create', [
            'suppliers' => $this->supplier_service->GetAll(),
            'categories' => $this->category_service->GetAll(),
            'brands' => $this->brand_service->getAllBrands(),
        ]);
    }

    public function store_product(StoreProductRequest $request): RedirectResponse
    {
        $this->product_service->StoreProduct($request);

        return redirect('/products/page');
    }
}
