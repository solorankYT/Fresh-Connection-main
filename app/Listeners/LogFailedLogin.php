<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Failed;
use Spatie\Activitylog\Facades\Activity;

class LogFailedLogin
{
    public function handle(Failed $event)
    {
        Activity::useLog('authentication')
            ->withProperties([
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'email' => $event->credentials['email'] ?? null,
            ])
            ->log('failed_login_attempt');
    }
}