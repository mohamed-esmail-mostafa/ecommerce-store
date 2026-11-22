<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(protected CartService $cart_service) {}

    /**
     * Display the cart page.
     */
    public function index(): Response
    {
        $cart = $this->cart_service->getCart()
            ->load(['items.product.images', 'items.product.category']);

        return Inertia::render('cart/index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function add(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        $this->cart_service->addProduct(
            $product,
            $validated['quantity'] ?? 1
        );

        return back()->with(
            'success',
            'Product added to cart successfully!'
        );
    }

    /**
     * Update the quantity of a specific cart item.
     */
    public function update(Request $request, CartItem $item): RedirectResponse
    {
        $cart = $this->cart_service->getCart();

        if ($item->cart_id !== $cart->id) {
            abort(403, 'Unauthorized cart item access.');
        }

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $this->cart_service->updateQuantity($item, $validated['quantity']);

        return back()->with('success', 'Cart updated successfully!');
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(CartItem $item): RedirectResponse
    {
        $cart = $this->cart_service->getCart();

        if ($item->cart_id !== $cart->id) {
            abort(403, 'Unauthorized cart item access.');
        }

        $this->cart_service->removeItem($item);

        return back()->with('success', 'Product removed from cart!');
    }

    /**
     * Clear all items in the cart.
     */
    public function clear(): RedirectResponse
    {
        $cart = $this->cart_service->getCart();

        $this->cart_service->clearCart($cart);

        return back()->with('success', 'Cart cleared successfully!');
    }
}
