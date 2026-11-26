<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;

function createProductForTest(array $overrides = []): Product
{
    $category = Category::create([
        'name_en' => 'Electronics '.uniqid(),
        'name_ar' => 'إلكترونيات '.uniqid(),
        'slug' => 'electronics-'.uniqid(),
    ]);

    return Product::create(array_merge([
        'category_id' => $category->id,
        'title' => 'Sample Product '.uniqid(),
        'slug' => 'sample-product-'.uniqid(),
        'price' => 120.00,
        'stock' => 10,
        'product_type' => 'simple',
        'product_kind' => 'physical',
        'is_active' => true,
        'is_featured' => false,
        'is_popular' => false,
    ], $overrides));
}

test('guests are redirected when accessing product edit or delete routes', function () {
    $product = createProductForTest();

    $this->get("/products/update/{$product->slug}")->assertRedirect(route('login'));
    $this->post("/products/update/{$product->id}", [])->assertRedirect(route('login'));
    $this->delete("/products/delete/{$product->id}")->assertRedirect(route('login'));
    $this->post('/products/bulk-delete', ['ids' => [$product->id]])->assertRedirect(route('login'));
});

test('authenticated users can view edit product page by slug or id', function () {
    $user = User::factory()->create();
    $product = createProductForTest(['title' => 'Headphones Pro', 'slug' => 'headphones-pro']);

    $this->actingAs($user);

    $this->get('/products/update/headphones-pro')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/update')
            ->where('product.id', $product->id)
            ->where('product.title', 'Headphones Pro')
        );

    $this->get("/products/update/{$product->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/update')
            ->where('product.id', $product->id)
        );
});

test('authenticated users can update a product and remove marked existing images', function () {
    $user = User::factory()->create();
    $product = createProductForTest(['title' => 'Old Title', 'price' => 50.00, 'stock' => 5]);
    $image = ProductImage::create([
        'product_id' => $product->id,
        'image' => '/storage/products/sample.jpg',
        'order' => 0,
    ]);

    $this->actingAs($user);

    $response = $this->post("/products/update/{$product->id}", [
        'category_id' => $product->category_id,
        'title' => 'Updated Product Title',
        'slug' => 'updated-product-title',
        'price' => 89.99,
        'stock' => 25,
        'product_type' => 'simple',
        'product_kind' => 'physical',
        'is_active' => '1',
        'deleted_images' => [$image->id],
    ]);

    $response->assertRedirect('/products/page');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'title' => 'Updated Product Title',
        'slug' => 'updated-product-title',
        'price' => 89.99,
        'stock' => 25,
    ]);

    $this->assertDatabaseMissing('product_images', [
        'id' => $image->id,
    ]);
});

test('authenticated users can delete a single product', function () {
    $user = User::factory()->create();
    $product = createProductForTest();

    $this->actingAs($user);

    $response = $this->delete("/products/delete/{$product->id}");
    $response->assertRedirect();

    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});

test('authenticated users can bulk delete multiple selected products', function () {
    $user = User::factory()->create();
    $product1 = createProductForTest();
    $product2 = createProductForTest();
    $product3 = createProductForTest();

    $this->actingAs($user);

    $response = $this->post('/products/bulk-delete', [
        'ids' => [$product1->id, $product2->id],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseMissing('products', ['id' => $product1->id]);
    $this->assertDatabaseMissing('products', ['id' => $product2->id]);
    $this->assertDatabaseHas('products', ['id' => $product3->id]);
});

test('bulk delete validates that ids array is non empty and valid', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post('/products/bulk-delete', ['ids' => []])
        ->assertSessionHasErrors(['ids']);
});
