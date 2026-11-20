<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function __construct(protected RoleService $role_service) {}

    /**
     * Display the roles page.
     */
    public function roles_page(): Response
    {
        return Inertia::render('roles/index', [
            'roles' => $this->role_service->getAllRoles(),
        ]);
    }

    /**
     * Store a new role.
     */
    public function store_role(StoreRoleRequest $request): RedirectResponse
    {
        $this->role_service->createRole($request);

        return redirect()->back();
    }

    /**
     * Find a role by its slug and return as JSON.
     */
    public function find_by_slug(string $slug): JsonResponse
    {
        $role = $this->role_service->findRoleBySlug($slug);

        return response()->json([
            'role' => $role,
        ]);
    }

    /**
     * Update an existing role.
     */
    public function update_role(UpdateRoleRequest $request, string $slug): RedirectResponse
    {
        $this->role_service->updateRole($request, $slug);

        return redirect()->back();
    }

    /**
     * Delete an existing role.
     */
    public function delete_role(string $slug): RedirectResponse
    {
        $this->role_service->deleteRole($slug);

        return redirect()->back();
    }
}
