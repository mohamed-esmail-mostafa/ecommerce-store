<?php

namespace App\Services;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Collection;

class BrandService
{
    /**
     * Get all brands with products count.
     *
     * @return Collection<int, Brand>
     */
    public function getAllBrands(): Collection
    {
        return Brand::withCount('products')->latest()->get();
    }

    /**
     * Create a new brand.
     */
    public function CreateBrand(StoreBrandRequest $request): Brand
    {
        $brand = new Brand;
        $brand->name = $request->name;
        $brand->save();

        return $brand;
    }

    /**
     * Update an existing brand.
     */
    public function UpdateBrand(UpdateBrandRequest $request, $id): Brand
    {
        $brand = $this->getBrand($id);
        $brand->name = $request->name;
        $brand->save();

        return $brand;
    }

    /**
     * Delete a brand.
     */
    public function DeleteBrand($id): bool
    {
        $brand = $this->getBrand($id);

        return (bool) $brand->delete();
    }

    /**
     * Find brand by ID or fail.
     */
    public function getBrand($id): Brand
    {
        return Brand::withCount('products')->findOrFail($id);
    }
}
