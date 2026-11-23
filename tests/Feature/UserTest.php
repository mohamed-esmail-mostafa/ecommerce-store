<?php

use App\Models\Role;
use App\Models\User;

test('guests are redirected to login when visiting users page', function () {
    $response = $this->get('/users/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit users page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/users/page');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/index')
        ->has('users')
        ->has('roles')
    );
});

test('authenticated users can create a new user', function () {
    $admin = User::factory()->create();
    $this->actingAs($admin);

    $role = Role::create([
        'name' => 'Editor',
        'slug' => 'editor',
    ]);

    $userData = [
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'password' => 'secret12345',
        'phone' => '1234567890',
        'address' => '123 Main St',
        'role_id' => $role->id,
    ];

    $response = $this->post('/users/store', $userData);
    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'phone' => '1234567890',
        'address' => '123 Main St',
        'role_id' => $role->id,
    ]);
});

test('creating user requires valid email and password', function () {
    $admin = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->post('/users/store', [
        'name' => '',
        'email' => 'not-an-email',
        'password' => 'short',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'password']);
});

test('authenticated users can update a user', function () {
    $admin = User::factory()->create();
    $this->actingAs($admin);

    $targetUser = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $role = Role::create([
        'name' => 'Manager',
        'slug' => 'manager',
    ]);

    $updateData = [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'phone' => '0987654321',
        'address' => '456 New St',
        'role_id' => $role->id,
    ];

    $response = $this->post("/users/update/{$targetUser->id}", $updateData);
    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $targetUser->id,
        'name' => 'New Name',
        'email' => 'new@example.com',
        'phone' => '0987654321',
        'address' => '456 New St',
        'role_id' => $role->id,
    ]);
});

test('authenticated users can change role of a user', function () {
    $admin = User::factory()->create();
    $this->actingAs($admin);

    $targetUser = User::factory()->create();
    $role = Role::create([
        'name' => 'Admin Role',
        'slug' => 'admin-role',
    ]);

    $response = $this->post("/users/change-role/{$targetUser->id}", [
        'role_id' => $role->id,
    ]);
    $response->assertRedirect();

    expect($targetUser->fresh()->role_id)->toBe($role->id);

    // Can remove role
    $response = $this->post("/users/change-role/{$targetUser->id}", [
        'role_id' => null,
    ]);
    $response->assertRedirect();

    expect($targetUser->fresh()->role_id)->toBeNull();
});

test('authenticated users can delete another user', function () {
    $admin = User::factory()->create();
    $this->actingAs($admin);

    $targetUser = User::factory()->create();

    $response = $this->delete("/users/delete/{$targetUser->id}");
    $response->assertRedirect();

    $this->assertDatabaseMissing('users', [
        'id' => $targetUser->id,
    ]);
});

test('authenticated users cannot delete their own account via delete endpoint', function () {
    $admin = User::factory()->create();
    $this->actingAs($admin);

    $response = $this->delete("/users/delete/{$admin->id}");
    $response->assertSessionHasErrors(['delete']);

    $this->assertDatabaseHas('users', [
        'id' => $admin->id,
    ]);
});
