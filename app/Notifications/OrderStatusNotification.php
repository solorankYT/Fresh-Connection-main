<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification
{

    protected $order;
    protected $status;

    public function __construct($order, $status)
    {
        $this->order = $order;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $statusMessages = [
            'pending' => 'has been received and is being processed',
            'processing' => 'is now being processed',
            'shipped' => 'has been shipped',
            'delivered' => 'has been delivered',
            'cancelled' => 'has been cancelled'
        ];

        $message = $statusMessages[$this->status] ?? 'has been updated';

        return (new MailMessage)
            ->subject('Order Status Update - Fresh Connection')
            ->greeting('Hello ' . $notifiable->name)
            ->line('Your order #' . $this->order->order_number . ' ' . $message)
            ->action('View Order', url('/orders/' . $this->order->id))
            ->line('Thank you for shopping with Fresh Connection!');
    }
}
