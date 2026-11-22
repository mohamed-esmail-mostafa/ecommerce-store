<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Services\SupplierService;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct(protected SupplierService $supplier_service) {}

    public function suppliers_page()
    {
        return Inertia::render('suppliers/index', [
            'suppliers' => $this->supplier_service->GetAll(),
        ]);
    }

    public function store_supplier(StoreSupplierRequest $request)
    {
        $this->supplier_service->Store($request);

        return redirect()->back();
    }

    public function update_supplier(UpdateSupplierRequest $request, string $slug)
    {
        $this->supplier_service->Update($request, $slug);

        return redirect()->back();
    }

    public function delete_supplier(string $slug)
    {
        $this->supplier_service->Delete($slug);

        return redirect()->back();
    }
}
