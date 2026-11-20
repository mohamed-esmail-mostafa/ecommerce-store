<?php

namespace App\Services;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class RoleService
{
    /**
     * Get all roles.
     *
     * @return Collection<int, Role>
     */
    public function getAllRoles(): Collection
    {
        return Role::withCount('users')->latest()->get();
    }

    /**
     * Find a role by its slug.
     */
    public function findRoleBySlug(string $slug): Role
    {
        return Role::withCount('users')->where('slug', $slug)->firstOrFail();
    }

    /**
     * Alias for findRoleBySlug.
     */
    public function getRoleBySlug(string $slug): Role
    {
        return $this->findRoleBySlug($slug);
    }

    /**
     * Create a new role.
     */
    public function createRole(StoreRoleRequest $request): Role
    {
        $role = new Role;
        $role->name = $request->input('name');

        $slug = $request->filled('slug')
            ? Str::slug($request->input('slug'))
            : Str::slug($request->input('name'));

        if (empty($slug)) {
            $slug = 'role-'.time();
        }

        // Ensure unique slug
        $originalSlug = $slug;
        $counter = 1;
        while (Role::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $role->slug = $slug;
        $role->save();

        return $role;
    }

    /**
     * Update an existing role.
     */
    public function updateRole(UpdateRoleRequest $request, string $slug): Role
    {
        $role = $this->findRoleBySlug($slug);
        $role->name = $request->input('name');

        if ($request->filled('slug')) {
            $newSlug = Str::slug($request->input('slug'));
            if ($newSlug !== $role->slug) {
                $originalSlug = $newSlug;
                $counter = 1;
                while (Role::where('slug', $newSlug)->where('id', '!=', $role->id)->exists()) {
                    $newSlug = "{$originalSlug}-{$counter}";
                    $counter++;
                }
                $role->slug = $newSlug;
            }
        } elseif ($request->input('name') !== $role->name) {
            $newSlug = Str::slug($request->input('name'));
            if ($newSlug !== $role->slug) {
                $originalSlug = $newSlug;
                $counter = 1;
                while (Role::where('slug', $newSlug)->where('id', '!=', $role->id)->exists()) {
                    $newSlug = "{$originalSlug}-{$counter}";
                    $counter++;
                }
                $role->slug = $newSlug;
            }
        }

        $role->save();

        return $role;
    }

    /**
     * Delete a role by its slug.
     */
    public function deleteRole(string $slug): bool
    {
        $role = $this->findRoleBySlug($slug);

        return (bool) $role->delete();
    }
}
