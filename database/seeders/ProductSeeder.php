<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::query()->delete();
        for ($i = 1; $i <= 10000; $i++) {

            Product::updateOrCreate(
                [
                'category_id'=>1,
                'title' => fake()->sentence(5),
                'slug' => 'product-' . $i ,
                'description' => fake()->sentence(10),
                'price'=>fake()->numberBetween(10,20),
                'sale_price'=>fake()->numberBetween(10,20),
                'stock'=>fake()->numberBetween(10,20),
                ]
            );
            
           
        }
    }
}
