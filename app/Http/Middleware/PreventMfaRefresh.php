<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PreventMfaRefresh
{
    public function handle(Request $request, Closure $next)
    {
        // If user is not authenticated, continue normally
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        
        // If accessing MFA verification page
        if ($request->is('verify-mfa')) {
            // Force re-login if:
            // 1. No verification code exists
            // 2. Code is expired
            // 3. User is already verified
            // 4. Refreshing the page
            if (!$user->verification_code || 
                !$user->verification_code_expires_at || 
                now()->isAfter($user->verification_code_expires_at) ||
                $user->is_verified ||
                ($request->isMethod('get') && session('mfa_page_loaded'))) {
                
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('login')
                    ->with('error', 'Verification session expired for security reasons. Please log in again.');
            }
            
            // Mark that MFA page has been loaded once
            if ($request->isMethod('get')) {
                session(['mfa_page_loaded' => true]);
            }
        }

        return $next($request);
    }
}