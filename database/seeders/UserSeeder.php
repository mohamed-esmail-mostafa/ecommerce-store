<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->delete();
        $users = [];

        for ($i = 1; $i <= 10000; $i++) {

            User::updateOrCreate(
                ['name' => fake()->name(),
                    'email' => 'test-'.$i.'@gmail.com',
                    'password' => Hash::make('123456789'),
                    'phone' => '01'.fake()->numerify('#########'),
                    'address' => fake()->address(),
                    'created_at' => now(),
                    'updated_at' => now(), ]
            );
            // $users[] = [

            //     'name' => fake()->name(),
            //     'email' => 'test-' . $i . '@gmail.com',
            //     'password' => Hash::make('123456789'),
            //     'phone' => '01' . fake()->numerify('#########'),
            //     'address' => fake()->address(),
            //     'created_at' => now(),
            //     'updated_at' => now(),
            // ];

            // if (count($users) === 1000) {
            //     DB::table('users')->insert($users);
            //     $users = [];

            // }

            // if (! empty($users)) {
            //     DB::table('users')->insert($users);
            // }
        }
    }
}
