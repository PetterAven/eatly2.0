<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'level_id',
        'email_verified_at',
        'phone',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function getRoleAttribute($value)
    {
        if ($this->level_id) {
            return match ((int) $this->level_id) {
                2 => 'merchant',
                3 => 'driver',
                4 => 'admin',
                default => 'client',
            };
        }

        if ($value === 'vendor' || $value === 'restaurante') {
            return 'merchant';
        }

        return $value ?? 'client';
    }

    public function redirectRouteName(): string
    {
        return match ($this->role) {
            'vendor' => 'vendor.dashboard',
            'delivery' => 'delivery.dashboard',
            default => 'dashboard',
        };
    }

    public function isMerchant(): bool
    {
        return $this->level_id == 2 || in_array($this->role, ['merchant', 'vendor', 'restaurante']);
    }

    public function isDriver(): bool
    {
        return $this->level_id == 3 || $this->role === 'driver';
    }

    public function isClient(): bool
    {
        return $this->level_id == 1 || $this->role === 'client';
    }

    public function isAdmin(): bool
    {
        return $this->level_id == 4 || $this->role === 'admin';
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function restaurants()
    {
        return $this->hasMany(Restaurant::class, 'owner_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
