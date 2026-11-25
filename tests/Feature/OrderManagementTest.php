<?php

use App\Models\Order;
use App\Models\User;

test('guests are redirected to login when visiting orders management page', function () {
    $response = $this->get('/orders/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can view orders management page with stats and pagination', function () {
    $admin = User::factory()->create();
    Order::factory()->count(3)->create([
        'status' => 'pending',
        'payement_status' => 'pending',
        'total' => 100.00,
    ]);

    $this->actingAs($admin);

    $response = $this->get('/orders/page');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('orders/index')
        ->has('orders.data', 3)
        ->has('stats')
        ->where('stats.total_orders', 3)
        ->where('stats.pending_orders', 3)
        ->where('stats.total_revenue', fn ($val) => (float) $val === 300.0)
    );
});

test('orders page supports search and status filtering', function () {
    $admin = User::factory()->create();
    Order::factory()->create([
        'order_no' => 'ORD-MATCH-001',
        'status' => 'delivered',
        'payement_status' => 'paid',
    ]);
    Order::factory()->create([
        'order_no' => 'ORD-OTHER-002',
        'status' => 'pending',
        'payement_status' => 'pending',
    ]);

    $this->actingAs($admin);

    $response = $this->get('/orders/page?search=ORD-MATCH&status=delivered');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('orders/index')
        ->has('orders.data', 1)
        ->where('orders.data.0.order_no', 'ORD-MATCH-001')
    );
});

test('authenticated users can update order status and payment status', function () {
    $admin = User::factory()->create();
    $order = Order::factory()->create([
        'status' => 'pending',
        'payement_status' => 'pending',
    ]);

    $this->actingAs($admin);

    $response = $this->post("/orders/update-status/{$order->id}", [
        'status' => 'delivered',
        'payement_status' => 'paid',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'delivered',
        'payement_status' => 'paid',
    ]);
});

test('updating order status rejects invalid status values', function () {
    $admin = User::factory()->create();
    $order = Order::factory()->create();

    $this->actingAs($admin);

    $response = $this->post("/orders/update-status/{$order->id}", [
        'status' => 'invalid_status',
    ]);

    $response->assertSessionHasErrors(['status']);
});

test('authenticated users can delete an order', function () {
    $admin = User::factory()->create();
    $order = Order::factory()->create();

    $this->actingAs($admin);

    $response = $this->delete("/orders/delete/{$order->id}");
    $response->assertRedirect();

    $this->assertDatabaseMissing('orders', [
        'id' => $order->id,
    ]);
});
