<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;
use App\Notifications\MfaVerificationNotification;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        return Inertia::render('Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            try {
                $request->session()->regenerate();
                $user = Auth::user();
                $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $user->update([
                    'is_verified' => false,
                    'verification_code' => $verificationCode,
                    'verification_code_expires_at' => now()->addMinutes(10)
                ]);

                // Send verification code immediately
                try {
                    Log::info('Starting email process for user: ' . $user->email);
                    Log::info('Generated verification code: ' . $verificationCode);
                    
                    // Verify user model has required attributes
                    Log::info('User model state:', [
                        'has_email' => isset($user->email),
                        'email' => $user->email,
                        'verification_code' => $user->verification_code,
                        'expires_at' => $user->verification_code_expires_at
                    ]);
                    
                    $user->notify(new MfaVerificationNotification($verificationCode));
                    Log::info('Email notification queued successfully');
                    
                    // Double check the code was saved
                    $user->refresh();
                    Log::info('Verification state after email:', [
                        'has_code' => !empty($user->verification_code),
                        'code_expiry' => $user->verification_code_expires_at
                    ]);
                    
                } catch (\Exception $e) {
                    Log::error('Failed to send email: ' . $e->getMessage());
                    Log::error('Stack trace: ' . $e->getTraceAsString());
                }

                return redirect()->route('verify-mfa');
            } catch (\Exception $e) {
                Log::error('MFA Error: ' . $e->getMessage());
                return back()->withErrors(['email' => 'Error during login process. Please try again.']);
            }
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
            'password' => 'Incorrect Password',
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function twoFactorChallenge()
    {
        if (!session()->has('auth.2fa.id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge');
    }

    public function twoFactorVerify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $userId = session('auth.2fa.id');
        
        if (!$userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::find($userId);
        
        if (!$user) {
            return redirect()->route('login');
        }

        $google2fa = new Google2FA();

        if ($google2fa->verifyKey($user->two_factor_secret, $request->code)) {
            Auth::login($user);
            session()->forget('auth.2fa.id');
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'code' => 'The provided two-factor authentication code was invalid.',
        ]);
    }
}
