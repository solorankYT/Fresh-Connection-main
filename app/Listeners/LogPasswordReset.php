<?php

namespace App\Listeners;

use Illuminate\Auth\Events\PasswordReset;
use Spatie\Activitylog\Facades\Activity;

class LogPasswordReset
{
    public function handle(PasswordReset $event)
    {
        Activity::useLog('authentication')
            ->causedBy($event->user)
            ->withProperties([
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log('password_reset');
    }
}