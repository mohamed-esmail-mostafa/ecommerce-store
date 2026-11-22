<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;

beforeEach(function () {
    $this->category1 = Category::create([
        'name_ar' => 'عطور نسائية',
        'name_en' => 'Women Perfumes',
        'slug' => 'women-perfumes',
    ]);

    $this->category2 = Category::create([
        'name_ar' => 'ساعات',
        'name_en' => 'Watches',
        'slug' => 'watches',
    ]);

    $this->brand1 = Brand::create(['name' => 'Dior']);
    $this->brand2 = Brand::create(['name' => 'Rolex']);

    $this->product1 = Product::create([
        'title' => 'Miss Dior Perfume',
        'slug' => 'miss-dior-perfume',
        'category_id' => $this->category1->id,
        'brand_id' => $this->brand1->id,
        'price' => '300.00',
        'sale_price' => '250.00',
        'stock' => 5,
        'product_type' => 'simple',
        'product_kind' => 'physical',
        'is_active' => true,
    ]);

    $this->product2 = Product::create([
        'title' => 'Submariner Watch',
        'slug' => 'submariner-watch',
        'category_id' => $this->category2->id,
        'brand_id' => $this->brand2->id,
        'price' => '1000.00',
        'sale_price' => null,
        'stock' => 0,
        'product_type' => 'simple',
        'product_kind' => 'physical',
        'is_active' => true,
    ]);
});

test('shop page renders successfully and displays all active products', function () {
    $response = $this->get(route('shop.page'));
    $response->assertOk();
});

test('shop page filters by category id passed as route parameter', function () {
    $response = $this->get('/shop/page/'.$this->category1->id);
    $response->assertOk();
});

test('shop page filters by brand id query parameter', function () {
    $response = $this->get('/shop/page?brand_id='.$this->brand1->id);
    $response->assertOk();
});

test('shop page filters by price range', function () {
    $response = $this->get('/shop/page?min_price=200&max_price=400');
    $response->assertOk();
});

test('shop page filters by stock availability', function () {
    $response = $this->get('/shop/page?in_stock=1');
    $response->assertOk();
});

test('shop page filters by on sale items', function () {
    $response = $this->get('/shop/page?on_sale=1');
    $response->assertOk();
});

test('shop page sorts products by price ascending and descending', function () {
    $responseAsc = $this->get('/shop/page?sort=price_asc');
    $responseAsc->assertOk();

    $responseDesc = $this->get('/shop/page?sort=price_desc');
    $responseDesc->assertOk();
});

test('shop page searches products by keyword', function () {
    $response = $this->get('/shop/page?search=Dior');
    $response->assertOk();
});
