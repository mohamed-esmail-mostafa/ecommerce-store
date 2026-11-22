<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;

beforeEach(function () {
    $this->category = Category::create([
        'name_ar' => 'عطور',
        'name_en' => 'Perfumes',
        'slug' => 'perfumes',
    ]);

    $this->product = Product::create([
        'title' => 'Luxury Perfume',
        'slug' => 'luxury-perfume',
        'category_id' => $this->category->id,
        'price' => '200.00',
        'sale_price' => '150.00',
        'stock' => 15,
        'product_type' => 'simple',
        'product_kind' => 'physical',
        'is_active' => true,
    ]);
});

test('guest can access checkout page', function () {
    $response = $this->get(route('checkout.page'));
    $response->assertOk();
});

test('authenticated user can access checkout page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('checkout.page'));
    $response->assertOk();
});

test('authenticated user can place an order', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $cartService = app(CartService::class);
    $cartService->addProduct($this->product, 2);

    $response = $this->post(route('checkout.store'), [
        'name' => $user->name,
        'email' => $user->email,
        'phone' => '+966501234567',
        'governorate' => 'Riyadh',
        'city' => 'Riyadh',
        'address' => 'King Fahd Road, Apt 12',
        'payement_method' => 'cash_on_delivery',
        'notes' => 'Please call upon arrival.',
    ]);

    $order = Order::where('email', $user->email)->first();
    expect($order)->not->toBeNull();
    expect($order->user_id)->toBe($user->id);
    expect($order->items)->toHaveCount(1);
    expect($order->items->first()->quantity)->toBe(2);
    expect((float) $order->total)->toBe(300.0);

    $response->assertRedirect(route('order.confirmation', ['order_no' => $order->order_no]));
});

test('guest can place an order without logging in', function () {
    $cartService = app(CartService::class);
    $cart = $cartService->getCart();
    $cartService->addProduct($this->product, 1);

    $response = $this->withCookie('guest_cart_token', $cart->guest_token)
        ->post(route('checkout.store'), [
            'name' => 'Guest Shopper',
            'email' => 'guest@example.com',
            'phone' => '+966599887766',
            'governorate' => 'Jeddah',
            'city' => 'Jeddah',
            'address' => 'Corniche Road',
            'payement_method' => 'cash_on_delivery',
        ]);

    $order = Order::where('email', 'guest@example.com')->first();
    expect($order)->not->toBeNull();
    expect($order->user_id)->toBeNull();
    expect($order->items)->toHaveCount(1);
    expect((float) $order->total)->toBe(150.0);

    $response->assertRedirect(route('order.confirmation', ['order_no' => $order->order_no]));
});

test('order confirmation page displays the order details', function () {
    $order = Order::create([
        'order_no' => 'ORD-TEST123456',
        'name' => 'Sara Ahmad',
        'email' => 'sara@example.com',
        'phone' => '+966512345678',
        'subtotal' => 150.00,
        'shipping_cost' => 0.00,
        'total' => 150.00,
        'payement_method' => 'cash_on_delivery',
        'status' => 'pending',
    ]);

    $response = $this->get(route('order.confirmation', ['order_no' => $order->order_no]));
    $response->assertOk();
});

test('cannot place an order with an empty cart', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('checkout.store'), [
        'name' => $user->name,
        'email' => $user->email,
        'phone' => '+966501234567',
        'governorate' => 'Riyadh',
        'city' => 'Riyadh',
        'address' => 'King Fahd Road',
        'payement_method' => 'cash_on_delivery',
    ]);

    $response->assertSessionHasErrors('cart');
});
