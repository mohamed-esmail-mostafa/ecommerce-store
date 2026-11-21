<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'long_description' => ['nullable', 'string'],
            'sku' => ['nullable', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'product_type' => ['nullable', 'in:simple,variant'],
            'product_kind' => ['nullable', 'in:physical,digital'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['nullable'],
            'is_popular' => ['nullable'],
            'is_featured' => ['nullable'],
            'images' => ['nullable'],
        ];
    }
}
