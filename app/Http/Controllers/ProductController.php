<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
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

        return redirect('/products/page')->with('success', 'Product created successfully.');
    }

    /**
     * Display the edit product page.
     */
    public function edit_product_page(string $identifier): Response
    {
        return Inertia::render('products/update', [
            'product' => $this->product_service->FindProductByIdentifier($identifier),
            'suppliers' => $this->supplier_service->GetAll(),
            'categories' => $this->category_service->GetAll(),
            'brands' => $this->brand_service->getAllBrands(),
        ]);
    }

    /**
     * Update an existing product.
     */
    public function update_product(UpdateProductRequest $request, int $id): RedirectResponse
    {
        $this->product_service->UpdateProduct($request, $id);

        return redirect('/products/page')->with('success', 'Product updated successfully.');
    }

    /**
     * Delete a single product.
     */
    public function delete_product(int $id): RedirectResponse
    {
        $this->product_service->DeleteProduct($id);

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }

    /**
     * Bulk delete selected products.
     */
    public function bulk_delete_products(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:products,id'],
        ]);

        $this->product_service->BulkDeleteProducts($validated['ids']);

        return redirect()->back()->with('success', 'Selected products deleted successfully.');
    }
}
