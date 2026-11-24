<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'slug' => str()->slug($name).'-'.fake()->unique()->randomNumber(4),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'whatsup' => fake()->phoneNumber(),
            'is_active' => true,
        ];
    }
}
