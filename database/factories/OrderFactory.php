<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 20, 500);
        $shipping = $subtotal >= 50 ? 0.0 : 10.0;

        return [
            'user_id' => User::factory(),
            'order_no' => 'ORD-'.strtoupper(Str::random(10)),
            'name' => fake()->name(),
            'phone' => fake()->numerify('010########'),
            'email' => fake()->safeEmail(),
            'governorate' => fake()->state(),
            'city' => fake()->city(),
            'address' => fake()->streetAddress(),
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'discount' => 0,
            'total' => $subtotal + $shipping,
            'payement_method' => fake()->randomElement(['cash_on_delivery', 'credit_card']),
            'payement_status' => fake()->randomElement(['pending', 'paid']),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
