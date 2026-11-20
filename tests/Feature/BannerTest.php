<?php

use App\Models\Banner;
use App\Models\User;
use App\Services\CloudinaryService;
use Illuminate\Http\UploadedFile;

test('guests are redirected to the login page when visiting banners page', function () {
    $response = $this->get('/banners/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the banners page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/banners/page');
    $response->assertOk();
});

test('authenticated users can store a new banner', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $bannerData = [
        'title' => 'Summer Sale Banner',
        'description' => 'Huge discounts on all summer items',
        'type' => 'slider',
        'link' => '/shop',
        'button_text' => 'Shop Now',
        'is_active' => true,
    ];

    $response = $this->post('/banners/store', $bannerData);
    $response->assertRedirect();

    $this->assertDatabaseHas('banners', [
        'title' => 'Summer Sale Banner',
        'type' => 'slider',
        'button_text' => 'Shop Now',
        'is_active' => true,
    ]);
});

test('authenticated users can update an existing banner', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $banner = Banner::create([
        'title' => 'Old Title',
        'description' => 'Old description',
        'type' => 'slider',
        'link' => '/old-link',
        'button_text' => 'Old Button',
        'is_active' => true,
    ]);

    $updateData = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'type' => 'section',
        'link' => '/new-link',
        'button_text' => 'Explore',
        'is_active' => false,
    ];

    $response = $this->post('/banners/update/'.$banner->id, $updateData);
    $response->assertRedirect();

    $banner->refresh();
    expect($banner->title)->toBe('Updated Title')
        ->and($banner->type)->toBe('section')
        ->and($banner->link)->toBe('/new-link')
        ->and($banner->is_active)->toBeFalse();
});

test('authenticated users can toggle a banner status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $banner = Banner::create([
        'title' => 'Test Banner',
        'type' => 'slider',
        'is_active' => true,
    ]);

    $response = $this->patch('/banners/toggle/'.$banner->id);
    $response->assertRedirect();

    $banner->refresh();
    expect($banner->is_active)->toBeFalse();

    $response2 = $this->patch('/banners/toggle/'.$banner->id);
    $response2->assertRedirect();

    $banner->refresh();
    expect($banner->is_active)->toBeTrue();
});

test('authenticated users can delete a banner', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $banner = Banner::create([
        'title' => 'Banner To Delete',
        'type' => 'slider',
        'is_active' => true,
    ]);

    $response = $this->delete('/banners/delete/'.$banner->id);
    $response->assertRedirect();

    $this->assertDatabaseMissing('banners', [
        'id' => $banner->id,
    ]);
});

test('authenticated users can store a banner with images uploaded to cloudinary', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $cloudinaryMock = Mockery::mock(CloudinaryService::class);
    $cloudinaryMock->shouldReceive('uploadToCloudinary')
        ->twice()
        ->andReturn([
            'url' => 'https://res.cloudinary.com/demo/image/upload/sample.webp',
            'public_id' => 'sample_id',
        ]);

    $this->app->instance(CloudinaryService::class, $cloudinaryMock);

    $file = UploadedFile::fake()->image('desktop.jpg');
    $mobileFile = UploadedFile::fake()->image('mobile.jpg');

    $response = $this->post('/banners/store', [
        'title' => 'Banner With Cloudinary Images',
        'type' => 'slider',
        'image' => $file,
        'mobile_image' => $mobileFile,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('banners', [
        'title' => 'Banner With Cloudinary Images',
        'image' => 'https://res.cloudinary.com/demo/image/upload/sample.webp',
        'public_id' => 'sample_id',
    ]);
});
