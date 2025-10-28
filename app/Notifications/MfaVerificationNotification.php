<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MfaVerificationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    private string $verificationCode;

    public function __construct(string $verificationCode)
    {
        $this->verificationCode = $verificationCode;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        try {
            \Log::info('Preparing email for user: ' . $notifiable->email);
            
            $ipAddress = request()->ip();
            $browser = request()->userAgent();
            
            return (new MailMessage)
                ->subject('Security Verification Code - Fresh Connection')
                ->view('emails.mfa-verification', [
                    'code' => $this->verificationCode,
                    'browser' => $browser,
                    'ipAddress' => $ipAddress,
                    'timestamp' => now()->format('F j, Y g:i A'),
                    'timestamp' => now()->format('F j, Y g:i A')
                ]);
                
        } catch (\Exception $e) {
            \Log::error('Failed to send MFA email: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
