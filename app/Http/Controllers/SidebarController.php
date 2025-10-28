<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SidebarController extends Controller
{
    public function getUserData()
    {
        $user = Auth::user(); // Fetch the authenticated user
        return Inertia::render('Sidebar', [
            'user' => $user,
        ]);
    }
}
