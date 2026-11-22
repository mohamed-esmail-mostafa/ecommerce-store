<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;

beforeEach(function () {
    $this->category = Category::create([
        'name_ar' => 'تصنيف تجريبي',
        'name_en' => 'Test Category',
        'slug' => 'test-category',
    ]);

    $this->product = Product::create([
        'title' => 'Sample Product',
        'slug' => 'sample-product',
        'category_id' => $this->category->id,
        'price' => '100.00',
        'sale_price' => '80.00',
        'stock' => 10,
        'product_type' => 'simple',
        'product_kind' => 'physical',
        'is_active' => true,
    ]);
});

test('guest can view cart page', function () {
    $response = $this->get(route('cart.index'));
    $response->assertOk();
});

test('guest can view cart via cart.page route', function () {
    $response = $this->get(route('cart.page'));
    $response->assertOk();
});

test('user can add a product to cart', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('cart.add'), [
        'product_id' => $this->product->id,
        'quantity' => 2,
    ]);

    $response->assertSessionHas('success');

    $cart = app(CartService::class)->getCart();
    expect($cart->items)->toHaveCount(1);
    expect($cart->items->first()->quantity)->toBe(2);
    expect((float) $cart->items->first()->price)->toBe(80.0);
});

test('user can update item quantity in cart', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $cartService = app(CartService::class);
    $item = $cartService->addProduct($this->product, 1);

    $response = $this->patch(route('cart.items.update', $item), [
        'quantity' => 5,
    ]);

    $response->assertSessionHas('success');
    expect($item->fresh()->quantity)->toBe(5);
});

test('user can remove an item from cart', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $cartService = app(CartService::class);
    $item = $cartService->addProduct($this->product, 2);

    $response = $this->delete(route('cart.items.destroy', $item));

    $response->assertSessionHas('success');
    $cart = $cartService->getCart();
    expect($cart->items()->count())->toBe(0);
});

test('user can clear the cart', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $cartService = app(CartService::class);
    $cartService->addProduct($this->product, 2);

    $response = $this->delete(route('cart.clear'));

    $response->assertSessionHas('success');
    $cart = $cartService->getCart();
    expect($cart->items()->count())->toBe(0);
});
