<?php

use App\Models\Role;
use App\Models\User;

test('guests are redirected to login when visiting roles page', function () {
    $response = $this->get('/roles/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit roles page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/roles/page');
    $response->assertOk();
});

test('authenticated users can create a new role', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $roleData = [
        'name' => 'Store Manager',
        'slug' => 'store-manager',
    ];

    $response = $this->post('/roles/store', $roleData);
    $response->assertRedirect();

    $this->assertDatabaseHas('roles', [
        'name' => 'Store Manager',
        'slug' => 'store-manager',
    ]);
});

test('authenticated users can create a role with auto-generated slug', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $roleData = [
        'name' => 'Content Creator',
    ];

    $response = $this->post('/roles/store', $roleData);
    $response->assertRedirect();

    $this->assertDatabaseHas('roles', [
        'name' => 'Content Creator',
        'slug' => 'content-creator',
    ]);
});

test('authenticated users can find role by slug via api', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $role = Role::create([
        'name' => 'Administrator',
        'slug' => 'administrator',
    ]);

    $response = $this->getJson('/roles/find/'.$role->slug);
    $response->assertOk()
        ->assertJsonPath('role.name', 'Administrator')
        ->assertJsonPath('role.slug', 'administrator');
});

test('authenticated users can update a role', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $role = Role::create([
        'name' => 'Old Name',
        'slug' => 'old-name',
    ]);

    $response = $this->post('/roles/update/'.$role->slug, [
        'name' => 'Super Admin',
        'slug' => 'super-admin',
    ]);

    $response->assertRedirect();

    $role->refresh();
    expect($role->name)->toBe('Super Admin')
        ->and($role->slug)->toBe('super-admin');
});

test('authenticated users can delete a role', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $role = Role::create([
        'name' => 'Role To Delete',
        'slug' => 'role-to-delete',
    ]);

    $response = $this->delete('/roles/delete/'.$role->slug);
    $response->assertRedirect();

    $this->assertDatabaseMissing('roles', [
        'id' => $role->id,
    ]);
});
