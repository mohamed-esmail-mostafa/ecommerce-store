<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Brand::query()->delete();
        $brands = [];

        for ($i = 1; $i <= 1000; $i++) {
            $brands[] = [
                'name' => fake()->unique()->company(),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Insert every 1,000 records
            if (count($brands) === 1000) {
                DB::table('brands')->insert($brands);

                $brands = [];
            }
        }

        // Insert remaining records
        if (! empty($brands)) {
            DB::table('brands')->insert($brands);
        }
    }
}
