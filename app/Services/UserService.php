<?php

namespace App\Services;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use InvalidArgumentException;

class UserService
{
    /**
     * Get paginated users with optional search and role filtering.
     *
     * @return LengthAwarePaginator<User>
     */
    public function GetAllUsers(?string $search = null, ?int $roleId = null, int $perPage = 10): LengthAwarePaginator
    {
        return User::query()
            ->with('role')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($roleId !== null, function ($query) use ($roleId) {
                if ($roleId === 0) {
                    $query->whereNull('role_id');
                } else {
                    $query->where('role_id', $roleId);
                }
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Find a user by ID.
     */
    public function FindUserById(int $id): User
    {
        return User::with('role')->findOrFail($id);
    }

    /**
     * Create a new user.
     */
    public function CreateUser(StoreUserRequest $request): User
    {
        $roleId = $request->input('role_id');

        $data = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'role_id' => ! empty($roleId) ? (int) $roleId : null,
        ];

        return User::create($data);
    }

    /**
     * Update an existing user.
     */
    public function UpdateUser(UpdateUserRequest $request, int $id): User
    {
        $user = $this->FindUserById($id);
        $roleId = $request->input('role_id');

        $data = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'role_id' => ! empty($roleId) ? (int) $roleId : null,
        ];

        if ($request->filled('password')) {
            $data['password'] = $request->input('password');
        }

        $user->update($data);

        return $user->fresh(['role']);
    }

    /**
     * Change a user's role.
     */
    public function ChangeRole(int $id, ?int $roleId): User
    {
        $user = $this->FindUserById($id);
        $user->role_id = ! empty($roleId) ? $roleId : null;
        $user->save();

        return $user->fresh(['role']);
    }

    /**
     * Delete a user, guarding against self-deletion.
     */
    public function DeleteUser(int $id, int $currentUserId): bool
    {
        if ($id === $currentUserId) {
            throw new InvalidArgumentException('You cannot delete your own account.');
        }

        $user = $this->FindUserById($id);

        return (bool) $user->delete();
    }
}
