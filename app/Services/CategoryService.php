<?php

namespace App\Services;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected CloudinaryService $cloudinary_service)
    {
        //
    }

    public function GetAll()
    {
        return Category::with('parent')->latest()->get();
    }

    public function Store(StoreCategoryRequest $request)
    {
        $category = new Category;
        $category->name_ar = $request->name_ar;
        $category->name_en = $request->name_en;
        $category->description_en = $request->description_en;
        $category->description_ar = $request->description_ar;
        $category->parent_id = $request->filled('parent_id') && $request->parent_id !== 'none' ? (int) $request->parent_id : null;

        $slug = Str::slug($request->name_ar);
        if (empty($slug)) {
            $slug = 'cat-'.time();
        }

        $category->slug = $slug;

        if ($request->hasFile('image')) {
            $upload = $this->cloudinary_service->uploadToCloudinary($request->file('image'), 'categories');
            if ($upload) {
                $category->image = $upload['url'] ?? null;
                $category->public_id = $upload['public_id'] ?? null;
            }
        } elseif (is_string($request->image)) {
            $category->image = $request->image;
        }
        $category->save();

        return $category;
    }

    public function Update(UpdateCategoryRequest $request, string $slug)
    {

        $category = $this->GetCategory($slug);
        $category->name_ar = $request->name_ar;
        $category->name_en = $request->name_en;
        $category->description_en = $request->description_en;
        $category->description_ar = $request->description_ar;
        $category->parent_id = $request->filled('parent_id') && $request->parent_id !== 'none' ? (int) $request->parent_id : null;

        $slug = Str::slug($request->name_ar);
        if (empty($slug)) {
            $slug = 'cat-'.time();
        }

        $category->slug = $slug;

        if ($request->hasFile('image')) {
            $this->cloudinary_service->deleteFromCloudinary($category->public_id);
            $upload = $this->cloudinary_service->uploadToCloudinary($request->file('image'), 'categories');
            if ($upload) {
                $category->image = $upload['url'] ?? null;
                $category->public_id = $upload['public_id'] ?? null;
            }
        } elseif (is_string($request->image)) {
            $category->image = $request->image;
        }
        $category->save();

        return $category;
    }

    public function GetCategory(string $slug)
    {
        return Category::where('slug', $slug)->firstOrFail();
    }

    public function DeleteCategory(string $slug)
    {
        Category::where('slug', $slug)->firstOrFail()->delete();

        return true;
    }
}
