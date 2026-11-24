<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Services\SupplierService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function __construct(protected SupplierService $supplier_service) {}

    public function suppliers_page(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status', 'all');

        return Inertia::render('suppliers/index', [
            'suppliers' => $this->supplier_service->GetAll($search, $status),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status,
            ],
        ]);
    }

    public function store_supplier(StoreSupplierRequest $request): RedirectResponse
    {
        $this->supplier_service->Store($request);

        return redirect()->back();
    }

    public function update_supplier(UpdateSupplierRequest $request, string $slug): RedirectResponse
    {
        $this->supplier_service->Update($request, $slug);

        return redirect()->back();
    }

    public function toggle_status(string $slug): RedirectResponse
    {
        $this->supplier_service->ToggleStatus($slug);

        return redirect()->back();
    }

    public function delete_supplier(string $slug): RedirectResponse
    {
        $this->supplier_service->Delete($slug);

        return redirect()->back();
    }
}
