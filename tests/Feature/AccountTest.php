<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guests are redirected to login when visiting my account page', function () {
    $response = $this->get('/my/account');
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit my account page and see profile and order data', function () {
    $user = User::factory()->create([
        'name' => 'Alice Customer',
        'email' => 'alice@example.com',
        'phone' => '01012345678',
        'address' => 'Cairo, Egypt',
    ]);

    // Create an order for the user
    Order::create([
        'user_id' => $user->id,
        'order_no' => 'ORD-ALICE-1001',
        'name' => 'Alice Customer',
        'phone' => '01012345678',
        'email' => 'alice@example.com',
        'subtotal' => 150.00,
        'shipping_cost' => 0.00,
        'discount' => 10.00,
        'total' => 140.00,
        'payement_method' => 'cash_on_delivery',
        'payement_status' => 'pending',
        'status' => 'pending',
    ]);

    $this->actingAs($user);

    $response = $this->get('/my/account');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('account/index')
        ->has('user')
        ->has('orders')
        ->has('orderStats')
        ->where('orderStats.total_orders', 1)
        ->where('orderStats.pending_orders', 1)
        ->where('orderStats.total_spent', fn ($val) => (float) $val === 140.0)
    );
});

test('authenticated users can update their profile information', function () {
    $user = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
        'phone' => '01011111111',
        'address' => 'Old Address',
    ]);

    $this->actingAs($user);

    $response = $this->post('/my/account/profile', [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '01099999999',
        'address' => 'New Deluxe Street, Alex',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '01099999999',
        'address' => 'New Deluxe Street, Alex',
    ]);
});

test('updating profile fails if email belongs to another user', function () {
    $user1 = User::factory()->create(['email' => 'user1@example.com']);
    $user2 = User::factory()->create(['email' => 'user2@example.com']);

    $this->actingAs($user1);

    $response = $this->post('/my/account/profile', [
        'name' => 'User One',
        'email' => 'user2@example.com',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('authenticated users can update their password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password-1234'),
    ]);

    $this->actingAs($user);

    $response = $this->post('/my/account/password', [
        'current_password' => 'old-password-1234',
        'password' => 'new-secret-password-1234',
        'password_confirmation' => 'new-secret-password-1234',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $user->refresh();
    expect(Hash::check('new-secret-password-1234', $user->password))->toBeTrue();
});

test('updating password fails when current password is wrong', function () {
    $user = User::factory()->create([
        'password' => Hash::make('correct-password-1234'),
    ]);

    $this->actingAs($user);

    $response = $this->post('/my/account/password', [
        'current_password' => 'wrong-password-9999',
        'password' => 'new-secret-password-1234',
        'password_confirmation' => 'new-secret-password-1234',
    ]);

    $response->assertSessionHasErrors(['current_password']);
});

test('updating password fails when confirmation does not match', function () {
    $user = User::factory()->create([
        'password' => Hash::make('correct-password-1234'),
    ]);

    $this->actingAs($user);

    $response = $this->post('/my/account/password', [
        'current_password' => 'correct-password-1234',
        'password' => 'new-secret-password-1234',
        'password_confirmation' => 'different-password-1234',
    ]);

    $response->assertSessionHasErrors(['password']);
});
