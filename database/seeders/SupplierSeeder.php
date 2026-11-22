<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Supplier::query()->delete();
        for ($i = 1; $i <= 100; $i++) {
            Supplier::updateOrCreate([
                'name' => fake()->name(),
                'slug' => fake()->unique()->name(),
                'phone' => '01'.fake()->numerify('#########'),
                'address' => fake()->address(),
                'whatsup' => '01'.fake()->numerify('#########'),

            ]);
        }
    }
}
