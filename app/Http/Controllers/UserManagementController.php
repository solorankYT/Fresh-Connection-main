<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get pagination size parameter
        $perPage = $request->input('per_page', 50);
        
        $query = User::query();

        // Apply search filter
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('street_address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('barangay', 'like', "%{$search}%")
                    ->orWhere('postal_code', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")  // Add this line
                    ->orWhere('role', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $validSortKeys = ['id', 'first_name', 'email', 'role', 'status', 'created_at'];
        $sortKey = $request->input('sort_key', 'id');
        $sortDirection = $request->input('sort_direction', 'asc') === 'desc' ? 'desc' : 'asc';

        // Handle special case for name sorting (which needs to sort by first_name)
        if ($sortKey === 'name') {
            $sortKey = 'first_name';
        }

        if (in_array($sortKey, $validSortKeys)) {
            $query->orderBy($sortKey, $sortDirection);
        }

        // Change from get() to paginate()
        $users = $query->paginate($perPage);

        // Get monthly user registration data for the last 6 months
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        $monthlyUserData = DB::table('users')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('YEAR(created_at) as year'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Format data for the chart
        $chartData = [];
        $monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Initialize with 0 counts for all 6 months
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthKey = $month->month;
            $yearKey = $month->year;

            $dataPoint = [
                'month' => $monthNames[$monthKey - 1],
                'desktop' => 0,
                'monthKey' => $monthKey,
                'yearKey' => $yearKey
            ];

            $chartData[] = $dataPoint;
        }

        // Fill in actual counts
        foreach ($monthlyUserData as $data) {
            foreach ($chartData as &$point) {
                if ($point['monthKey'] == $data->month && $point['yearKey'] == $data->year) {
                    $point['desktop'] = $data->count;
                    break;
                }
            }
        }

        // Remove the utility keys
        foreach ($chartData as &$point) {
            unset($point['monthKey']);
            unset($point['yearKey']);
        }

        // Get top 5 cities with most users
        $topCitiesData = DB::table('users')
            ->select('city', DB::raw('COUNT(*) as count'))
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->groupBy('city')
            ->orderBy('count', 'desc')
            ->limit(7)
            ->get();

        // Format data for the bar chart
        $barChartData = [];

        foreach ($topCitiesData as $cityData) {
            $barChartData[] = [
                'month' => $cityData->city, // Using 'month' field for backward compatibility
                'desktop' => $cityData->count
            ];
        }

        // If less than 5 cities were found, fill with placeholder data
        while (count($barChartData) < 5) {
            $barChartData[] = [
                'month' => 'Other',
                'desktop' => 0
            ];
        }

        $summary = [
            'totalUsers' => User::count(),
            'activeUsers' => User::where('status', 'active')->count(),
            'inactiveUsers' => User::where('status', 'inactive')->count(),
        ];

        // Add these lines to return filters with the response
        $search = $request->input('search', '');
        $sortKey = $request->input('sort_key', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        
        // At the end of the method, add filters to the Inertia response:
        return Inertia::render('admin/UserManagement', [
            'users' => $users,
            'summary' => $summary,
            'chartData' => $chartData,
            'barChartData' => $barChartData,
            'filters' => [
                'search' => $search,
                'sort_key' => $sortKey,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $users = $request->input('users'); // Retrieve the array of users

        \Log::info('Bulk update request data:', ['users' => $users]);

        if (!$users || !is_array($users)) {
            return redirect()->back()->withErrors(['error' => 'Invalid data format']);
        }

        foreach ($users as $userData) {
            \Log::info('Processing user:', ['id' => $userData['id'], 'data' => $userData]);

            $user = User::find($userData['id']);
            if (!$user) {
                \Log::warning('User not found for update:', ['id' => $userData['id']]);
                continue;
            }

            // Merge existing user data with incoming changes
            $mergedData = array_merge($user->toArray(), $userData);

            try {
                $validatedData = validator($mergedData, [
                    'role' => 'required|string|in:admin,supplier,customer',
                    'status' => 'required|string|in:active,inactive',
                ])->validate();
            } catch (\Exception $e) {
                \Log::error('Validation failed:', ['id' => $userData['id'], 'error' => $e->getMessage()]);
                continue;
            }

            $updated = $user->update($validatedData);
            \Log::info('User update result:', ['id' => $userData['id'], 'updated' => $updated]);
        }

        // Redirect back with success message using Inertia
        return redirect()->route('admin.user-management')->with('success', 'Users updated successfully!');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone_number' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,supplier,customer',
            'status' => 'required|string|in:active,inactive',
        ]);

        User::create($validatedData);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
