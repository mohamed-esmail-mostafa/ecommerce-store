<?php

namespace App\Services;

use App\Http\Requests\StoreCartRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartService
{
   public function AddToCart(StoreCartRequest $request)
   {
      dd($request);
      $cart = new Cart();
   }



   public function getCart(): Cart
   {
      if (Auth::check()) {
         return Cart::firstOrCreate([
            'user_id' => Auth::id(),
            'status' => 'active',
         ]);
      }

      $token = request()->cookie('guest_cart_token');

      if (!$token) {
         abort(401, 'Guest cart token not found.');
      }

      return Cart::firstOrCreate([
         'guest_token' => $token,
         'status' => 'active',
      ]);
   }

   public function addProduct(
      Product $product,
      int $quantity = 1
   ): CartItem {

      return DB::transaction(function () use ($product, $quantity) {

         $cart = $this->getCart();

         $item = $cart->items()
            ->where('product_id', $product->id)
            ->first();

         if ($item) {
            $item->increment('quantity', $quantity);

            return $item->refresh();
         }

         return $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => $quantity,
            'price' => $product->price,
         ]);
      });
   }








   public function mergeGuestCart(string $token): void
{
    DB::transaction(function () use ($token) {

        $guestCart = Cart::where('guest_token', $token)
            ->where('status', 'active')
            ->with('items')
            ->first();

        if (!$guestCart) {
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
