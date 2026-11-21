<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('guests are redirected from product creation page', function () {
    $response = $this->get('/create/product/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can view product create page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/create/product/page');
    $response->assertOk();
});

test('authenticated users can store a new product with full attributes', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::create([
        'name_ar' => 'إلكترونيات',
        'name_en' => 'Electronics',
        'slug' => 'electronics',
    ]);

    $brand = Brand::create([
        'name' => 'Sony',
    ]);

    $productData = [
        'title' => 'Wireless Headphones WH-1000XM5',
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'price' => '399.99',
        'sale_price' => '349.99',
        'stock' => '25',
        'description' => 'Premium noise cancelling headphones',
        'long_description' => '<p>Detailed audio specifications and battery life.</p>',
        'product_type' => 'simple',
        'product_kind' => 'physical',
        'is_active' => true,
        'is_featured' => true,
        'is_popular' => false,
    ];

    $response = $this->post('/store/product', $productData);
    $response->assertRedirect('/products/page');

    $this->assertDatabaseHas('products', [
        'title' => 'Wireless Headphones WH-1000XM5',
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'brand' => 'Sony',
        'price' => 399.99,
        'sale_price' => 349.99,
        'stock' => 25,
        'is_featured' => true,
    ]);
});

test('authenticated users can store product with multiple images', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::create([
        'name_ar' => 'أجهزة',
        'name_en' => 'Devices',
        'slug' => 'devices',
    ]);

    $images = [
        UploadedFile::fake()->image('photo1.jpg', 600, 600),
        UploadedFile::fake()->image('photo2.png', 800, 800),
    ];

    $productData = [
        'title' => 'Smartphone Pro Max',
        'category_id' => $category->id,
        'price' => '999.00',
        'stock' => '10',
        'images' => $images,
    ];

    $response = $this->post('/store/product', $productData);
    $response->assertRedirect('/products/page');

    $product = Product::where('title', 'Smartphone Pro Max')->first();
    expect($product)->not->toBeNull();

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'title' => 'Smartphone Pro Max',
    ]);

    $this->assertDatabaseCount('product_images', 2);
    $this->assertDatabaseHas('product_images', [
        'product_id' => $product->id,
        'order' => 0,
    ]);
    $this->assertDatabaseHas('product_images', [
        'product_id' => $product->id,
        'order' => 1,
    ]);
});

test('product search on service filters products from backend', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::create([
        'name_ar' => 'هواتف',
        'name_en' => 'Phones',
        'slug' => 'phones',
    ]);

    Product::create([
        'title' => 'iPhone 16 Pro Max',
        'slug' => 'iphone-16-pro-max',
        'category_id' => $category->id,
        'price' => 1199.00,
        'stock' => 10,
        'is_active' => true,
    ]);

    Product::create([
        'title' => 'Samsung Galaxy S24 Ultra',
        'slug' => 'samsung-s24-ultra',
        'category_id' => $category->id,
        'price' => 1299.00,
        'stock' => 15,
        'is_active' => true,
    ]);

    // Search for iPhone
    $response = $this->get('/products/page?search=iPhone');
    $response->assertOk();

    $page = $response->viewData('page');
    $data = $page['props']['products']['data'];

    expect(count($data))->toBe(1)
        ->and($data[0]['title'])->toBe('iPhone 16 Pro Max');
});
