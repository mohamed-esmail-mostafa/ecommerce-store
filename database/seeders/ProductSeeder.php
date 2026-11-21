<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryIds = Category::pluck('id')->toArray();

        if (empty($categoryIds)) {
            $this->command->error('No categories found. Seed categories first.');

            return;
        }

        DB::table('products')->delete();

        $faker = fake();
        $batch = [];

        for ($i = 1; $i <= 10000; $i++) {

            $price = $faker->randomFloat(2, 10, 2000);

            $batch[] = [
                'category_id' => $faker->randomElement($categoryIds),
                'title' => $faker->words(4, true),
                'slug' => 'product-'.$i,
                'description' => $faker->sentence(),
                'long_description' => $faker->paragraph(4),
                'sku' => 'SKU-'.$i,
                'price' => $price,
                'sale_price' => $faker->boolean(50)
                    ? round($price * 0.8, 2)
                    : null,
                'product_type' => 'simple',
                'product_kind' => 'physical',
                'brand_id' => null,
                'brand' => $faker->company(),
                'stock' => $faker->numberBetween(0, 500),
                'is_active' => true,
                'is_popular' => $faker->boolean(20),
                'is_featured' => $faker->boolean(15),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($batch) === 500) {
                DB::table('products')->insert($batch);
                $batch = [];

                $this->command->info("Inserted {$i} products");
            }
        }

        if (! empty($batch)) {
            DB::table('products')->insert($batch);
        }

        $this->command->info(
            'Total products: '.DB::table('products')->count()
        );

    }
}
