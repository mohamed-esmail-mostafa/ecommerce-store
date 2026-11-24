<?php

namespace App\Services;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class SupplierService
{
    /**
     * Get all suppliers with optional search and status filtering.
     *
     * @return Collection<int, Supplier>
     */
    public function GetAll(?string $search = null, ?string $status = null): Collection
    {
        return Supplier::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('whatsup', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->when($status !== null && $status !== 'all', function ($query) use ($status) {
                $query->where('is_active', $status === 'active');
            })
            ->latest('id')
            ->get();
    }

    /**
     * Store a new supplier.
     */
    public function Store(StoreSupplierRequest $request): Supplier
    {
        $supplier = new Supplier;
        $supplier->name = $request->input('name');
        $supplier->phone = $request->input('phone');
        $supplier->address = $request->input('address');
        $supplier->whatsup = $request->input('whatsup');
        $supplier->is_active = $request->boolean('is_active', true);

        $slug = Str::slug($request->input('name'));
        if (empty($slug)) {
            $slug = 'supplier-'.time();
        }

        $originalSlug = $slug;
        $counter = 1;
        while (Supplier::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $supplier->slug = $slug;
        $supplier->save();

        return $supplier;
    }

    /**
     * Update an existing supplier.
     */
    public function Update(UpdateSupplierRequest $request, string $slug): Supplier
    {
        $supplier = $this->GetSupplier($slug);

        $supplier->name = $request->input('name');
        $supplier->phone = $request->input('phone');
        $supplier->address = $request->input('address');
        $supplier->whatsup = $request->input('whatsup');
        if ($request->has('is_active')) {
            $supplier->is_active = $request->boolean('is_active');
        }

        if ($request->filled('name')) {
            $newSlug = Str::slug($request->input('name'));
            if ($newSlug !== $supplier->slug) {
                $originalSlug = $newSlug;
                $counter = 1;
                while (Supplier::where('slug', $newSlug)->where('id', '!=', $supplier->id)->exists()) {
                    $newSlug = "{$originalSlug}-{$counter}";
                    $counter++;
                }
                $supplier->slug = $newSlug;
            }
        }

        $supplier->save();

        return $supplier;
    }

    /**
     * Toggle active status.
     */
    public function ToggleStatus(string $slug): Supplier
    {
        $supplier = $this->GetSupplier($slug);
        $supplier->is_active = ! $supplier->is_active;
        $supplier->save();

        return $supplier;
    }

    /**
     * Find supplier by slug.
     */
    public function GetSupplier(string $slug): Supplier
    {
        return Supplier::where('slug', $slug)->firstOrFail();
    }

    /**
     * Delete a supplier.
     */
    public function Delete(string $slug): bool
    {
        $supplier = $this->GetSupplier($slug);

        return (bool) $supplier->delete();
    }
}
