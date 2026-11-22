<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartRequest;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller {

    public function __construct(protected CartService $cart_service){}
    // public function add_to_cart(StoreCartRequest $request){
    //     $this->cart_service->AddToCart($request);
    // }












     public function add(
        Request $request,
        CartService $cartService
    ) {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail(
            $validated['product_id']
        );

        $cartService->addProduct(
            $product,
            $validated['quantity'] ?? 1
        );

        return back()->with(
            'success',
            'Product added to cart successfully!'
        );
    }

    public function index(CartService $cartService)
    {
        $cart = $cartService->getCart()
            ->load('items.product');

        return inertia('cart/index', [
            'cart' => $cart,
        ]);
    }
}
