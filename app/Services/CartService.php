<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartService
{
    /**
     * Get or create the active cart for the authenticated user or guest.
     */
    public function getCart(): Cart
    {
        if (Auth::check()) {
            return Cart::firstOrCreate([
                'user_id' => Auth::id(),
                'status' => 'active',
            ]);
        }

        $token = request()->cookie('guest_cart_token');

        if (! $token && cookie()->hasQueued('guest_cart_token')) {
            $token = cookie()->queued('guest_cart_token')?->getValue();
        }

        if (! $token) {
            $token = (string) Str::uuid();
            cookie()->queue(cookie(
                'guest_cart_token',
                $token,
                60 * 24 * 30,
                '/',
                null,
                request()->isSecure(),
                true,
                false,
                'lax'
            ));
        }

        return Cart::firstOrCreate([
            'guest_token' => $token,
            'status' => 'active',
        ]);
    }

    /**
     * Add a product to the cart with the requested quantity.
     */
    public function addProduct(Product $product, int $quantity = 1): CartItem
    {
        return DB::transaction(function () use ($product, $quantity) {
            $cart = $this->getCart();

            $item = $cart->items()
                ->where('product_id', $product->id)
                ->first();

            $price = ($product->sale_price !== null && (float) $product->sale_price > 0 && (float) $product->sale_price < (float) $product->price)
                ? $product->sale_price
                : $product->price;

            if ($item) {
                $newQuantity = $item->quantity + $quantity;
                if ($product->stock > 0 && $newQuantity > $product->stock) {
                    $newQuantity = $product->stock;
                }

                $item->update([
                    'quantity' => $newQuantity,
                    'price' => $price,
                ]);

                return $item->refresh();
            }

            $initialQuantity = max(1, $quantity);
            if ($product->stock > 0 && $initialQuantity > $product->stock) {
                $initialQuantity = $product->stock;
            }

            return $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $initialQuantity,
                'price' => $price,
            ]);
        });
    }

    /**
     * Update the quantity of a specific cart item.
     */
    public function updateQuantity(CartItem $item, int $quantity): CartItem
    {
        $product = $item->product ?? Product::find($item->product_id);

        if ($product && $product->stock > 0 && $quantity > $product->stock) {
            $quantity = $product->stock;
        }

        $item->update([
            'quantity' => max(1, $quantity),
        ]);

        return $item->refresh();
    }

    /**
     * Remove an item from the cart.
     */
    public function removeItem(CartItem $item): bool
    {
        return (bool) $item->delete();
    }

    /**
     * Clear all items from a given cart.
     */
    public function clearCart(Cart $cart): bool
    {
        return (bool) $cart->items()->delete();
    }

    /**
     * Merge items from a guest cart into the authenticated user's cart.
     */
    public function mergeGuestCart(string $token): void
    {
        DB::transaction(function () use ($token) {
            $guestCart = Cart::where('guest_token', $token)
                ->where('status', 'active')
                ->with('items')
                ->first();

            if (! $guestCart) {
                return;
            }

            $userCart = Cart::firstOrCreate([
                'user_id' => Auth::id(),
                'status' => 'active',
            ]);

            foreach ($guestCart->items as $guestItem) {
                $userItem = $userCart->items()
                    ->where('product_id', $guestItem->product_id)
                    ->first();

                if ($userItem) {
                    $userItem->increment(
                        'quantity',
                        $guestItem->quantity
                    );
                } else {
                    $userCart->items()->create([
                        'product_id' => $guestItem->product_id,
                        'quantity' => $guestItem->quantity,
                        'price' => $guestItem->price,
                    ]);
                }
            }

            $guestCart->items()->delete();

            $guestCart->update([
                'status' => 'merged',
            ]);
        });
    }
}
