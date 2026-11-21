<?php

use App\Models\Brand;
use App\Models\User;

test('guests are redirected from brands page', function () {
    $response = $this->get('/brands/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can view brands page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/brands/page');
    $response->assertOk();
});

test('authenticated users can store a new brand', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post('/brands/store', [
        'name' => 'Apple',
    ]);
    $response->assertRedirect();

    $this->assertDatabaseHas('brands', [
        'name' => 'Apple',
    ]);
});

test('authenticated users can update an existing brand', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $brand = Brand::create(['name' => 'Old Brand']);

    $response = $this->post('/brands/update/'.$brand->id, [
        'name' => 'Updated Brand Name',
    ]);
    $response->assertRedirect();

    $brand->refresh();
    expect($brand->name)->toBe('Updated Brand Name');
});

test('authenticated users can delete a brand', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $brand = Brand::create(['name' => 'Brand To Delete']);

    $response = $this->delete('/brands/delete/'.$brand->id);
    $response->assertRedirect();

    $this->assertDatabaseMissing('brands', [
        'id' => $brand->id,
    ]);
});
