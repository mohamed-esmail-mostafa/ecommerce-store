<?php

namespace Database\Seeders;

use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductImage::query()->delete();
        for ($i = 1; $i <= 10000; $i++) {

            ProductImage::updateOrCreate(
                [
                    'product_id' => fake()->numberBetween(1, 10000),
                    'image' => fake()->imageUrl(),
                ]
            );

        }
    }
}
