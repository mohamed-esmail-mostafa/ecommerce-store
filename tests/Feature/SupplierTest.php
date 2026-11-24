<?php

use App\Models\Supplier;
use App\Models\User;

test('guests are redirected to login when visiting suppliers page', function () {
    $response = $this->get('/suppliers/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit suppliers page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/suppliers/page');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('suppliers/index')
        ->has('suppliers')
    );
});

test('authenticated users can create a new supplier', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $supplierData = [
        'name' => 'Acme Supplies Corp',
        'phone' => '01012345678',
        'address' => '100 Industrial Zone, Cairo',
        'whatsup' => '01012345678',
        'is_active' => true,
    ];

    $response = $this->post('/suppliers/store', $supplierData);
    $response->assertRedirect();

    $this->assertDatabaseHas('suppliers', [
        'name' => 'Acme Supplies Corp',
        'phone' => '01012345678',
        'address' => '100 Industrial Zone, Cairo',
        'whatsup' => '01012345678',
        'is_active' => true,
    ]);
});

test('authenticated users can update an existing supplier', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $supplier = Supplier::factory()->create([
        'name' => 'Old Supplier Name',
    ]);

    $updateData = [
        'name' => 'Updated Supplier Name',
        'phone' => '01099998888',
        'address' => '200 Downtown, Alex',
        'whatsup' => '01099998888',
        'is_active' => false,
    ];

    $response = $this->post("/suppliers/update/{$supplier->slug}", $updateData);
    $response->assertRedirect();

    $this->assertDatabaseHas('suppliers', [
        'id' => $supplier->id,
        'name' => 'Updated Supplier Name',
        'phone' => '01099998888',
        'is_active' => false,
    ]);
});

test('authenticated users can toggle supplier active status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $supplier = Supplier::factory()->create([
        'is_active' => true,
    ]);

    $response = $this->post("/suppliers/toggle-status/{$supplier->slug}");
    $response->assertRedirect();

    expect($supplier->fresh()->is_active)->toBeFalse();

    $this->post("/suppliers/toggle-status/{$supplier->slug}");
    expect($supplier->fresh()->is_active)->toBeTrue();
});

test('authenticated users can delete a supplier', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $supplier = Supplier::factory()->create();

    $response = $this->delete("/supplier/delete/{$supplier->slug}");
    $response->assertRedirect();

    $this->assertDatabaseMissing('suppliers', [
        'id' => $supplier->id,
    ]);
});
