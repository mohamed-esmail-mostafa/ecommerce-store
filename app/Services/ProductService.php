<?php

namespace App\Services;

use App\Http\Requests\StoreProductRequest;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ProductService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected CloudinaryService $cloudinary_service) {}

    /**
     * Get all products with optional service-side search.
     */
    public function GetAllProducts(?string $search = null): LengthAwarePaginator
    {
        $query = Product::latest()->with(['category', 'supplier', 'brandModel', 'images']);

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('long_description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($catQuery) use ($search) {
                        $catQuery->where('name_ar', 'like', "%{$search}%")
                            ->orWhere('name_en', 'like', "%{$search}%");
                    });
            });
        }

        return $query->paginate(12)->withQueryString();
    }

    /**
     * Store a newly created product.
     */
    public function StoreProduct(StoreProductRequest $request): Product
    {
        $product = new Product;
        $product->category_id = $request->category_id;
        $product->supplier_id = $request->filled('supplier_id') ? $request->supplier_id : null;
        $product->brand_id = $request->filled('brand_id') ? $request->brand_id : null;

        if ($request->filled('brand_id')) {
            $brand = Brand::find($request->brand_id);
            $product->brand = $brand?->name;
        } elseif ($request->filled('brand')) {
            $product->brand = $request->brand;
        }

        $product->title = $request->title;

        $slug = $request->filled('slug') ? Str::slug($request->slug) : Str::slug($request->title);
        if (empty($slug)) {
            $slug = 'product-'.time();
        }
        $originalSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }
        $product->slug = $slug;

        $product->description = $request->description;
        $product->long_description = $request->long_description;
        $product->sku = $request->filled('sku') ? $request->sku : ('SKU-'.strtoupper(Str::random(8)));
        $product->price = $request->price;
        $product->sale_price = $request->filled('sale_price') ? $request->sale_price : null;
        $product->product_type = $request->input('product_type', 'simple');
        $product->product_kind = $request->input('product_kind', 'physical');
        $product->stock = (int) $request->stock;

        $product->is_active = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);
        $product->is_popular = filter_var($request->input('is_popular', false), FILTER_VALIDATE_BOOLEAN);
        $product->is_featured = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);

        $product->save();

        $this->uploadImages($product, $request);

        return $product;
    }

    /**
     * Get a single product by slug.
     */
    public function GetProduct(string $slug): Product
    {
        return Product::with(['category', 'supplier', 'brandModel', 'images'])->where('slug', $slug)->firstOrFail();
    }

    /**
     * Upload product images to Cloudinary with local storage fallback.
     */
    private function uploadImages(Product $product, $request): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $images = $request->file('images');
        if (! is_array($images)) {
            $images = [$images];
        }

        foreach ($images as $index => $file) {
            if (! $file || ! $file->isValid()) {
                continue;
            }

            try {
                $upload = $this->cloudinary_service->uploadToCloudinary($file, 'products');

                $url = null;
                $publicId = null;

                if ($upload && ! empty($upload['url'])) {
                    $url = $upload['url'];
                    $publicId = $upload['public_id'] ?? null;
                } else {
                    // Fallback to public storage disk if Cloudinary fails or is offline
                    $path = $file->store('products', 'public');
                    $url = '/storage/'.$path;
                }

                $product->images()->create([
                    'image' => $url,
                    'public_id' => $publicId,
                    'order' => $index,
                    'type' => $file->getClientMimeType(),
                    'size' => (string) $file->getSize(),
                ]);
            } catch (Throwable $e) {
                Log::error('Failed to upload product image: '.$e->getMessage(), [
                    'product_id' => $product->id,
                    'exception' => $e,
                ]);
            }
        }
    }
}
