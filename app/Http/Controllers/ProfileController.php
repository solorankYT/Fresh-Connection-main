<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Order;
use App\Models\OrderItem;
use PragmaRX\Google2FA\Google2FA;
use Spatie\Activitylog\Models\Activity;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $orders = Order::where('user_id', $user->id)
            ->latest()
            ->with('orderItems') // Include order items
            ->get();

        $products = OrderItem::whereIn('order_id', $orders->pluck('id'))
            ->with('product:product_id,product_name,product_image') // Use the correct column name
            ->get()
            ->map(fn($item) => $item->product);

        return Inertia::render('Profile', [
            'user' => $user,
            'orders' => $orders, // Pass orders
            'products' => $products, // Pass products
        ]);
    }

    public function update(Request $request)
    {

        // Validate the incoming request
        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'street_address' => 'nullable|string|max:255',
            'user_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validate user_image
        ]);

        // Handle user_image upload
        if ($request->hasFile('user_image')) {
            $validated['user_image'] = $request->file('user_image')->store('users', 'public');
        }

        // Update the user's profile
        Auth::user()->update($validated);

        return to_route('profile')->with('message', 'Profile updated successfully');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', Password::defaults(), 'confirmed'],
            'new_password_confirmation' => ['required'],
        ]);

        // Update password
        $user = Auth::user();
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return to_route('profile')->with('message', 'Password updated successfully');
    }

    public function getLoginHistory()
    {
        try {
            $loginHistory = Activity::query()
                ->where('log_name', 'authentication')
                ->where('causer_id', auth()->id())
                ->where('description', 'logged_in')
                ->orderBy('created_at', 'desc')
                ->take(50)
                ->get()
                ->map(function ($activity) {
                    $properties = $activity->properties;
                    return [
                        'created_at' => $activity->created_at,
                        'ip_address' => $properties['ip_address'] ?? 'Unknown',
                        'user_agent' => $properties['formatted_device'] ?? 'Unknown Device', // Use formatted_device instead of raw user_agent
                        'location' => $properties['location'] ?? 'Unknown Location',
                        'status' => $properties['status'] ?? 'success'
                    ];
                });

            return response()->json($loginHistory);
        } catch (\Exception $e) {
            \Log::error('Login history error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch login history'], 500);
        }
    }

    private function generateSecretKey(): string
    {
        $google2fa = new Google2FA();
        return $google2fa->generateSecretKey();
    }

    private function generateRecoveryCodes(): string
    {
        $codes = collect(range(1, 8))->map(function () {
            return strtoupper(substr(md5(uniqid()), 0, 8));
        });

        return json_encode($codes);
    }

    public function showTwoFactorStatus()
    {
        $user = Auth::user();

        return Inertia::render('Profile', [
            'user' => $user,
            'qrCodeUrl' => session('qr_code_url'),
            'flash' => [
                'message' => session('message')
            ]
        ]);
    }

    public function toggleTwoFactor(Request $request)
    {
        $user = Auth::user();
        $google2fa = new Google2FA();

        if ($request->enable) {
            $secret = $this->generateSecretKey();
            $qrCodeUrl = $google2fa->getQRCodeUrl(
                config('app.name'),
                $user->email,
                $secret
            );

            session(['2fa_temp_secret' => $secret]);

            return Inertia::render('Profile', array_merge(
                $this->getProfileData($user),
                [
                    'qrCodeUrl' => $qrCodeUrl,
                    'flash' => [
                        'message' => 'Please scan the QR code with your authenticator app',
                        'qrCodeUrl' => $qrCodeUrl
                    ]
                ]
            ));
        }

        $user->two_factor_enabled = false;
        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->save();

        return Inertia::render('Profile', array_merge(
            $this->getProfileData($user),
            [
                'flash' => [
                    'message' => '2FA has been disabled'
                ]
            ]
        ));
    }

    public function verify2FA(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6'
        ]);

        $google2fa = new Google2FA();
        $secret = session('2fa_temp_secret');

        if (!$secret) {
            return Inertia::render('Profile', array_merge(
                $this->getProfileData(Auth::user()),
                [
                    'flash' => [
                        'error' => 'Setup session expired'
                    ]
                ]
            ));
        }

        if (!$google2fa->verifyKey($secret, $request->code)) {
            return Inertia::render('Profile', array_merge(
                $this->getProfileData(Auth::user()),
                [
                    'qrCodeUrl' => session('qr_code_url'),
                    'flash' => [
                        'error' => 'Invalid verification code'
                    ]
                ]
            ));
        }

        $user = Auth::user();
        $user->two_factor_enabled = true;
        $user->two_factor_secret = $secret;
        $user->two_factor_recovery_codes = $this->generateRecoveryCodes();
        $user->save();

        session()->forget('2fa_temp_secret');

        return Inertia::render('Profile', array_merge(
            $this->getProfileData($user),
            [
                'flash' => [
                    'message' => '2FA has been enabled',
                    'recoveryCodes' => json_decode($user->two_factor_recovery_codes)
                ]
            ]
        ));
    }

    private function getProfileData($user)
    {
        $orders = Order::where('user_id', $user->id)
            ->latest()
            ->with('orderItems')
            ->get();

        $products = OrderItem::whereIn('order_id', $orders->pluck('id'))
            ->with('product:product_id,product_name,product_image')
            ->get()
            ->map(fn($item) => $item->product);

        return [
            'user' => $user,
            'orders' => $orders,
            'products' => $products
        ];
    }
}
