<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class Redirect2FAToProfile
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow POST requests and Inertia requests
        if ($request->isMethod('post') || $request->header('X-Inertia')) {
            return $next($request);
        }

        // Redirect non-Inertia GET requests to profile
        return redirect()->route('profile');
    }
}
