<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index()
    {
        // Fetch all promotions
        $promotions = Promotion::all();
        
        // Debug log
        \Log::info('Fetched promotions:', ['count' => $promotions->count(), 'promotions' => $promotions->toArray()]);

        return Inertia::render('admin/Promotion', [
            'promotions' => $promotions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'code' => 'required|string|unique:promotion,code|max:50',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->discount_type === 'percentage' && $value > 100) {
                        $fail('The discount percentage cannot be greater than 100.');
                    }
                },
            ],
            'minimum_purchase' => 'required|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['times_used'] = 0; // Initialize usage counter
        Promotion::create($validated);

        return redirect()->back()->with('success', 'Promotion created successfully');
    }
}
