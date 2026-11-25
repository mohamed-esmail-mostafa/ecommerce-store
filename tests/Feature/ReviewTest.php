<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;

function createTestProduct(): Product
{
    $category = Category::create([
        'name_ar' => 'قسم تجريبي',
        'name_en' => 'Test Category',
        'slug' => 'test-category-'.uniqid(),
    ]);

    return Product::create([
        'category_id' => $category->id,
        'title' => 'Test Product',
        'slug' => 'test-product-'.uniqid(),
        'price' => 99.99,
        'stock' => 10,
        'is_active' => true,
    ]);
}

test('guests are redirected to login when visiting reviews page', function () {
    $response = $this->get('/reviews/page');
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit reviews page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/reviews/page');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reviews/index')
        ->has('reviews')
        ->has('stats')
    );
});

test('authenticated users can toggle review approval status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = createTestProduct();
    $review = Review::create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'rating' => 4,
        'title' => 'Nice product',
        'comment' => 'Great quality',
        'is_approved' => false,
    ]);

    $response = $this->post("/reviews/toggle-approval/{$review->id}");
    $response->assertRedirect();

    expect($review->fresh()->is_approved)->toBeTrue();

    $this->post("/reviews/toggle-approval/{$review->id}");
    expect($review->fresh()->is_approved)->toBeFalse();
});

test('authenticated users can update a review', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = createTestProduct();
    $review = Review::create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'rating' => 3,
        'title' => 'Initial Title',
        'comment' => 'Initial Comment',
        'is_approved' => false,
    ]);

    $updateData = [
        'rating' => 5,
        'title' => 'Updated Five Star Title',
        'comment' => 'This product is exceptionally great!',
        'is_approved' => true,
    ];

    $response = $this->post("/reviews/update/{$review->id}", $updateData);
    $response->assertRedirect();

    $this->assertDatabaseHas('reviews', [
        'id' => $review->id,
        'rating' => 5,
        'title' => 'Updated Five Star Title',
        'is_approved' => true,
    ]);
});

test('authenticated users can delete a review', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = createTestProduct();
    $review = Review::create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'rating' => 5,
        'title' => 'To delete',
        'comment' => 'To delete comment',
        'is_approved' => true,
    ]);

    $response = $this->delete("/reviews/delete/{$review->id}");
    $response->assertRedirect();

    $this->assertDatabaseMissing('reviews', [
        'id' => $review->id,
    ]);
});
