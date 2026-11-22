<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Services\CategoryService;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $category_service) {}

    public function categoriesPgae()
    {
        return Inertia::render('categories/index', [
            'categories' => $this->category_service->GetAll(),
        ]);
    }

    public function storeCategory(StoreCategoryRequest $request)
    {
        $this->category_service->Store($request);

        return redirect()->back();
    }

    public function updateCategory(UpdateCategoryRequest $request, $slug)
    {
        $this->category_service->Update($request, $slug);

        return redirect()->back();
    }

    public function delete_category(string $slug)
    {
        $this->category_service->DeleteCategory($slug);

        return redirect()->back();
    }
}
