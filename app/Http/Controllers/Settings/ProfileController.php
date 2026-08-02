<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (empty($user->google_id)) {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);
        }

        $hasActiveOrders = false;
        $activeStatuses = ['delivered', 'completed', 'cancelled'];

        if ($user->role === 'client' || empty($user->role)) {
            $hasActiveOrders = \App\Models\Order::where('user_id', $user->id)
                ->whereNotIn('status', $activeStatuses)
                ->exists();
        } elseif ($user->role === 'merchant') {
            $hasActiveOrders = \App\Models\Order::whereHas('branch', function ($q) use ($user) {
                $q->whereHas('restaurant', function ($r) use ($user) {
                    $r->where('owner_id', $user->id);
                });
            })->whereNotIn('status', $activeStatuses)->exists();
        } elseif ($user->role === 'driver') {
            $hasActiveOrders = \App\Models\Order::where('driver_id', $user->id)
                ->whereNotIn('status', $activeStatuses)
                ->exists();
        }

        if ($hasActiveOrders) {
            return back()->withErrors([
                'error' => 'No puedes eliminar tu cuenta mientras tengas pedidos activos. Espera a que se completen o cancelen.',
            ]);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
