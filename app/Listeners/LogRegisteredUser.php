<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Spatie\Activitylog\Facades\Activity;
use Spatie\Activitylog\Facades\ActivityLog;

class LogRegisteredUser
{
    public function handle(Registered $event)
    {
        Activity::useLog('authentication')
            ->causedBy($event->user)
            ->withProperties([
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log('registered');
    }
}