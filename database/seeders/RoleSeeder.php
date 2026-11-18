<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => "Admin / مدير النظام",
                'slug' => "admin"
            ],
            [
                'name' => "Store Manager / مدير المتجر ",
                'slug' => "store-manager"
            ],
            [
                'name' => "Sales Man /  مسئول المبيعات ",
                'slug' => "sales-man"
            ],
            [
                'name' => "Customer /   زبون ",
                'slug' => "customer"
            ]

        ];
        foreach ($roles as $role) {
            Role::updateOrCreate([
                'name' => $role['name'],
                'slug' => $role['slug'],

            ]);
        }
    }
}
