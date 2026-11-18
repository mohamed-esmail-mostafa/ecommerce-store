<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::query()->delete();
        $categories = [
            [
                'name_ar' => 'عطور',
                'name_en' => 'Perfumes',
                'slug' => 'perfumes',
                'description_ar' => 'تشكيلة متنوعة من العطور النسائية والرجالية بروائح مميزة.',
                'description_en' => 'A collection of distinctive perfumes for men and women.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'مكياج',
                'name_en' => 'Makeup',
                'slug' => 'makeup',
                'description_ar' => 'مستحضرات المكياج لإبراز جمالك وإطلالتك اليومية.',
                'description_en' => 'Makeup products to enhance your beauty and everyday look.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'العناية بالبشرة',
                'name_en' => 'Skin Care',
                'slug' => 'skin-care',
                'description_ar' => 'منتجات تنظيف وترطيب وتغذية البشرة.',
                'description_en' => 'Products for cleansing, moisturizing, and nourishing your skin.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'العناية بالشعر',
                'name_en' => 'Hair Care',
                'slug' => 'hair-care',
                'description_ar' => 'شامبو وبلسم وزيوت وكريمات للعناية بالشعر.',
                'description_en' => 'Shampoos, conditioners, oils, and creams for hair care.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'كريمات الجسم',
                'name_en' => 'Body Care',
                'slug' => 'body-care',
                'description_ar' => 'منتجات ترطيب وتنعيم الجسم والعناية اليومية بالبشرة.',
                'description_en' => 'Body moisturizing, softening, and daily skincare products.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'مزيلات العرق',
                'name_en' => 'Deodorants',
                'slug' => 'deodorants',
                'description_ar' => 'مزيلات العرق ومنتجات الانتعاش والحماية اليومية.',
                'description_en' => 'Deodorants and daily freshness and protection products.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'العناية بالأظافر',
                'name_en' => 'Nail Care',
                'slug' => 'nail-care',
                'description_ar' => 'طلاء الأظافر ومستلزمات العناية والتجميل الخاصة بها.',
                'description_en' => 'Nail polish and nail care and beauty essentials.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'واقي الشمس',
                'name_en' => 'Sunscreen',
                'slug' => 'sunscreen',
                'description_ar' => 'منتجات حماية البشرة من أشعة الشمس.',
                'description_en' => 'Products designed to protect skin from sun exposure.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'أدوات التجميل',
                'name_en' => 'Beauty Tools',
                'slug' => 'beauty-tools',
                'description_ar' => 'فرش المكياج والإسفنج وأدوات التجميل المختلفة.',
                'description_en' => 'Makeup brushes, sponges, and various beauty tools.',
                'image' => fake()->imageUrl(),
            ],
            [
                'name_ar' => 'منتجات الاستحمام',
                'name_en' => 'Bath Products',
                'slug' => 'bath-products',
                'description_ar' => 'جل الاستحمام والصابون ومستلزمات النظافة الشخصية.',
                'description_en' => 'Shower gels, soaps, and personal hygiene products.',
                'image' => fake()->imageUrl(),
            ],
        ];
        foreach ($categories as $category) {
            Category::updateOrCreate([
                'slug' => $category['slug'],
                'name_ar' => $category['name_ar'],
                'name_en' => $category['name_en'],
                'description_en' => $category['description_en'],
                'description_ar' => $category['description_ar'],
                'image' => $category['image']
            ]);
        }
    }
}
