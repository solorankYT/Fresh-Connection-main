<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Log;
use Spatie\Activitylog\Facades\Activity;
use Illuminate\Support\Facades\Http;

class LogSuccessfulLogin
{
    public function handle(Login $event)
    {
        $ipAddress = request()->ip();
        $userAgent = request()->userAgent();
        $location = $this->getLocation($ipAddress);

        // Create detailed activity log with properly formatted properties
        Activity::useLog('authentication')
            ->causedBy($event->user)
            ->withProperties([
                'ip_address' => $ipAddress ?: '127.0.0.1',
                'user_agent' => $userAgent,
                'formatted_device' => $this->formatUserAgent($userAgent),
                'location' => $location ?: 'Unknown',
                'status' => 'success',
                'timestamp' => now()->toDateTimeString()
            ])
            ->log('logged_in');
        // add niyo lang to pag kelangan need iadd sa migration
        // // Update last login timestamp
        // $event->user->last_login_at = now();
        $event->user->save();
    }

    private function getLocation($ip)
    {
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return 'Local Development';
        }

        try {
            $response = Http::get("http://ip-api.com/json/{$ip}", [
                'fields' => 'status,message,country,city,query'
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                if ($data['status'] === 'success') {
                    return ($data['city'] ?? '') && ($data['country'] ?? '') 
                        ? "{$data['city']}, {$data['country']}" 
                        : 'Location Unavailable';
                }
            }
        } catch (\Exception $e) {
            Log::error('IP Geolocation failed: ' . $e->getMessage());
        }

        return 'Location Unavailable';
    }

    private function formatUserAgent($userAgent)
    {
        if (empty($userAgent)) {
            return 'Unknown Device';
        }

        $device = 'Desktop';
        if (preg_match('/(Mobile|Android|iPhone|iPad|Windows Phone)/i', $userAgent)) {
            $device = 'Mobile';
        }

        $browser = 'Unknown';
        if (preg_match('/Edge\/|Edg\//i', $userAgent)) {
            $browser = 'Edge';
        } elseif (strpos($userAgent, 'Chrome') !== false) {
            $browser = 'Chrome';
        } elseif (strpos($userAgent, 'Firefox') !== false) {
            $browser = 'Firefox';
        } elseif (strpos($userAgent, 'Safari') !== false) {
            $browser = 'Safari';
        }

        $os = 'Unknown';
        if (strpos($userAgent, 'Windows') !== false) {
            $os = 'Windows';
        } elseif (strpos($userAgent, 'Macintosh') !== false) {
            $os = 'macOS';
        } elseif (strpos($userAgent, 'Linux') !== false) {
            $os = 'Linux';
        }

        return "{$device} ({$os}) - {$browser}";
    }
}