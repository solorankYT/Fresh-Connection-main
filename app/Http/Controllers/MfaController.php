<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notifications\MfaVerificationNotification;
use Inertia\Inertia;

class MfaController extends Controller
{
    public function showVerification()
    {
        $user = auth()->user();
        
        // If no verification code exists or is expired, force re-login
        if (!$user->verification_code || 
            !$user->verification_code_expires_at || 
            now()->isAfter($user->verification_code_expires_at)) {
            
            auth()->logout();
            session()->invalidate();
            session()->regenerateToken();
            
            return redirect()->route('login')
                ->with('error', 'Verification session expired. Please login again.');
        }

        return inertia()->render('Auth/VerifyMfa', [
            'userEmail' => $user->email,
            'expiresAt' => $user->verification_code_expires_at
        ]);
    }

    public function sendVerificationCode()
    {
        try {
            $user = auth()->user();
            
            // Generate new code
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Invalidate any existing code first
            $user->update([
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => now()->addMinutes(10),
                'is_verified' => false
            ]);

            \Log::info('Preparing email for user: ' . $user->email);
            
            // Send new code
            $user->notify(new MfaVerificationNotification($verificationCode));
            
            \Log::info('Email prepared successfully');

            return back()->with('message', 'A new verification code has been sent to your email.');
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return back()->with('error', 'Failed to send verification code. Please try again.');
        }
    }

    public function verify(Request $request)
    {
        $request->validate([
            'verification_code' => 'required|string|size:6'
        ]);

        $user = auth()->user();

        // Additional security checks
        if (!$user->verification_code || !$user->verification_code_expires_at) {
            auth()->logout();
            session()->invalidate();
            session()->regenerateToken();
            return redirect()->route('login')
                ->with('error', 'Verification session invalid. Please login again.');
        }

        if ($user->verification_code !== $request->verification_code) {
            // Increment failed attempts
            session()->increment('mfa_failed_attempts', 1);
            
            // After 3 failed attempts, force re-login
            if (session('mfa_failed_attempts', 0) >= 3) {
                auth()->logout();
                session()->invalidate();
                session()->regenerateToken();
                return redirect()->route('login')
                    ->with('error', 'Too many failed attempts. Please login again.');
            }
            
            return back()->withErrors(['verification_code' => 'Invalid verification code.']);
        }

        if (now()->isAfter($user->verification_code_expires_at)) {
            auth()->logout();
            session()->invalidate();
            session()->regenerateToken();
            return redirect()->route('login')
                ->with('error', 'Verification code expired. Please login again.');
        }

        // Clear all MFA-related session data
        session()->forget(['mfa_page_loaded', 'mfa_failed_attempts']);

        // Invalidate code immediately after use (GitHub-style one-time code)
        $user->update([
            'is_verified' => true,
            'verification_code' => null,
            'verification_code_expires_at' => null,
            'last_verified_at' => now()
        ]);

        return redirect()->intended();
    }
}
