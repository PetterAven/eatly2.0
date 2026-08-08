<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'role' => ['sometimes', 'string', Rule::in(['client', 'driver', 'merchant', 'vendor', 'delivery'])],
        ])->validate();

        $role = $input['role'] ?? 'client';
        $roleMap = [
            'client' => 1,
            'merchant' => 2,
            'vendor' => 2,
            'driver' => 3,
            'delivery' => 3,
        ];

        $normalizedRole = match ($role) {
            'vendor' => 'merchant',
            'delivery' => 'driver',
            default => $role,
        };

        $levelId = $roleMap[$role] ?? 1;

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => $normalizedRole,
            'level_id' => $levelId,
        ]);
    }
}
