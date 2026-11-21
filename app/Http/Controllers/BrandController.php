<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Services\BrandService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(protected BrandService $brand_service) {}

    /**
     * Display the brands listing page.
     */
    public function brandsPage(): Response
    {
        return Inertia::render('brands/index', [
            'brands' => $this->brand_service->getAllBrands(),
        ]);
    }

    /**
     * Store a newly created brand.
     */
    public function storeBrand(StoreBrandRequest $request): RedirectResponse
    {
        $this->brand_service->CreateBrand($request);

        return redirect()->back();
    }

    /**
     * Update an existing brand.
     */
    public function updateBrand(UpdateBrandRequest $request, $id): RedirectResponse
    {
        $this->brand_service->UpdateBrand($request, $id);

        return redirect()->back();
    }

    /**
     * Delete a brand.
     */
    public function deleteBrand($id): RedirectResponse
    {
        $this->brand_service->DeleteBrand($id);

        return redirect()->back();
    }
}
