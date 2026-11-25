<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangeUserRoleRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateAccountPasswordRequest;
use App\Http\Requests\UpdateAccountProfileRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Order;
use App\Services\CategoryService;
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

    /**
     * Display the authenticated user's account page with profile & orders.
     */
    public function my_account(Request $request, CategoryService $categoryService): Response
    {
        $user = $request->user()->load('role');

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product.images', 'product.images'])
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        $orderStats = [
            'total_orders' => Order::where('user_id', $user->id)->count(),
            'pending_orders' => Order::where('user_id', $user->id)->whereIn('status', ['pending', 'processing'])->count(),
            'completed_orders' => Order::where('user_id', $user->id)->whereIn('status', ['completed', 'delivered'])->count(),
            'total_spent' => (float) Order::where('user_id', $user->id)->whereNotIn('status', ['cancelled', 'failed'])->sum('total'),
        ];

        return Inertia::render('account/index', [
            'user' => $user,
            'orders' => $orders,
            'orderStats' => $orderStats,
            'categories' => $categoryService->GetAll(),
        ]);
    }

    /**
     * Update customer profile info.
     */
    public function update_account_profile(UpdateAccountProfileRequest $request): RedirectResponse
    {
        $this->user_service->UpdateAccountProfile($request->user(), $request->validated());

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update customer account password.
     */
    public function update_account_password(UpdateAccountPasswordRequest $request): RedirectResponse
    {
        $this->user_service->UpdateAccountPassword($request->user(), $request->validated('password'));

        return redirect()->back()->with('success', 'Password updated successfully.');
    }
}
