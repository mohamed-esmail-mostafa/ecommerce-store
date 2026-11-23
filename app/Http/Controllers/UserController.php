<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangeUserRoleRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\RoleService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class UserController extends Controller
{
    public function __construct(
        protected UserService $user_service,
        protected RoleService $role_service
    ) {}

    /**
     * Display the users page with pagination and filters.
     */
    public function users_page(Request $request): Response
    {
        $search = $request->input('search');
        $roleId = $request->filled('role_id') && $request->input('role_id') !== ''
            ? (int) $request->input('role_id')
            : null;
        $perPage = (int) $request->input('per_page', 10);

        return Inertia::render('users/index', [
            'roles' => $this->role_service->getAllRoles(),
            'users' => $this->user_service->GetAllUsers($search, $roleId, $perPage),
            'filters' => [
                'search' => $search ?? '',
                'role_id' => $roleId,
            ],
        ]);
    }

    /**
     * Store a new user.
     */
    public function store_user(StoreUserRequest $request): RedirectResponse
    {
        $this->user_service->CreateUser($request);

        return redirect()->back();
    }

    /**
     * Update an existing user.
     */
    public function update_user(UpdateUserRequest $request, int $id): RedirectResponse
    {
        $this->user_service->UpdateUser($request, $id);

        return redirect()->back();
    }

    /**
     * Change a user's role.
     */
    public function change_role(ChangeUserRoleRequest $request, int $id): RedirectResponse
    {
        $roleId = $request->filled('role_id') && $request->input('role_id') !== ''
            ? (int) $request->input('role_id')
            : null;

        $this->user_service->ChangeRole($id, $roleId);

        return redirect()->back();
    }

    /**
     * Delete an existing user.
     */
    public function delete_user(Request $request, int $id): RedirectResponse
    {
        try {
            $this->user_service->DeleteUser($id, (int) $request->user()?->id);
        } catch (InvalidArgumentException $e) {
            return redirect()->back()->withErrors([
                'delete' => $e->getMessage(),
            ]);
        }

        return redirect()->back();
    }
}
