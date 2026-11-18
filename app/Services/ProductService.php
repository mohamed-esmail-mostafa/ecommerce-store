<?php

namespace App\Services;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Support\Str;
use Exception;

class ProductService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected CloudinaryService $cloudinary_service)
    {
        //
    }


    public function GetAllProducts()
    {
        return Product::latest()->with(["category" , "images"])->paginate(10);
    }

    public function StoreProduct(StoreProductRequest $request)
    {
        $product = new Product();
        $product->category_id = $request->category_id;
        $product->supplier_id = $request->supplier_id;
        $product->title = $request->title;
        $product->slug = Str::slug($request->title);
        $product->description = $request->description;
        $product->price = $request->price;
        $product->sale_price = $request->sale_price;
        $product->brand = $request->brand;
        $product->stock = $request->stock;
        $product->save();
        $this->uploadImages($product, $request);

        return $product;
    }


    public function GetProduct(string $slug)
    {
        return Product::with(["category" , "images"])->where('slug', $slug)->firstOrFail();
    }


    private function uploadImages(Product $product, $request)
    {
        try {
            if (!$request->hasFile('images')) {
                return;
            }
            foreach ($request->file('images') as $index => $file) {
                $path = $this->cloudinary_service->uploadToCloudinary($file, 'products');
                $product->images()->create([
                    'image' => $path['url'],
                    'public_id' => $path['public_id'],
                    // 'order' => $index
                ]);
            }
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
