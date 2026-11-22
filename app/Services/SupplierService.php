<?php

namespace App\Services;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Support\Str;

class SupplierService
{
    public function GetAll()
    {
        return Supplier::all();
    }

    public function Store(StoreSupplierRequest $request)
    {
        // dd($request);
        $supplier = new Supplier;
        $supplier->name = $request->name;
        $supplier->slug = Str::slug($request->name);
        $supplier->phone = $request->phone;
        $supplier->address = $request->address;
        $supplier->whatsup = $request->whatsup;
        $supplier->save();

        return $supplier;
    }

    public function Update(UpdateSupplierRequest $request, string $slug)
    {
        $supplier = $this->GetSupplier($slug);

        $supplier->name = $request->name;
        $supplier->slug = Str::slug($request->name);
        $supplier->phone = $request->phone;
        $supplier->address = $request->address;
        $supplier->whatsup = $request->whatsup;
        $supplier->save();

        return $supplier;
    }

    public function GetSupplier(string $slug)
    {
        return Supplier::where('slug', $slug)->firstOrFail();
    }

    public function Delete(string $slug)
    {
        $supplier = $this->GetSupplier($slug);

        $supplier->delete();

        return true;
    }
}
