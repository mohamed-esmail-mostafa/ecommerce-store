<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\BannerService;
use App\Services\BrandService;
use App\Services\CategoryService;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function __construct(
        protected CategoryService $category_service,
        protected ProductService $product_service,
        protected BannerService $banner_service,
        protected BrandService $brand_service,
    ) {}

    public function home_page()
    {
        return Inertia::render('home/index', [
            'sliders' => $this->banner_service->getAllSiders(),
            'categories' => $this->category_service->GetAll(),
            'products' => $this->product_service->GetAllProducts(),
        ]);
    }

    public function product_details(string $slug)
    {
        return Inertia::render('products/details', [
            'product' => $this->product_service->GetProduct($slug),
        ]);
    }

    public function cart_page()
    {
        return Inertia::render('cart/index');
    }

    public function shop_page(Request $request, $categoryId = null)
    {
        $filters = $request->only([
            'search',
            'category_id',
            'brand_id',
            'min_price',
            'max_price',
            'in_stock',
            'on_sale',
            'product_kind',
            'sort',
            'per_page',
        ]);

        if ($categoryId !== null) {
            $filters['category_id'] = $categoryId;
        }

        $products = $this->product_service->GetShopProducts($filters);
        $categories = $this->category_service->GetAll();
        $brands = $this->brand_service->getAllBrands();

        $minPrice = Product::where('is_active', true)->min('price') ?? 0;
        $maxPrice = Product::where('is_active', true)->max('price') ?? 1000;

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $filters,
            'priceRange' => [
                'min' => (float) $minPrice,
                'max' => (float) $maxPrice,
            ],
            'selectedCategoryId' => $categoryId ? (int) $categoryId : null,
        ]);
    }

    public function wishlist_page()
    {
        return Inertia::render('wishlist/index');
    }

    public function checkout_page()
    {
        return Inertia::render('checkout/index');
    }

    public function account_page()
    {
        return Inertia::render('account/index');
    }

    public function search_page()
    {
        return Inertia::render('search/index');
    }

    public function contact_page()
    {
        return Inertia::render('contact/index');
    }
}
