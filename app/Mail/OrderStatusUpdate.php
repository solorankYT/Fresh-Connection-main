<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdate extends Mailable
{
    public $order;
    public $status;

    public function __construct(Order $order, $status)
    {
        $this->order = $order;
        $this->status = $status;
    }

    public function build()
    {
        $statusMessages = [
            'pending' => 'has been received and is being processed',
            'processing' => 'is now being processed',
            'shipped' => 'has been shipped',
            'delivered' => 'has been delivered',
            'cancelled' => 'has been cancelled'
        ];

        $message = $statusMessages[$this->status] ?? 'has been updated';

        return $this->markdown('emails.order-status')
                   ->subject("Order #{$this->order->id} Update - Fresh Connection")
                   ->with([
                       'order' => $this->order,
                       'status' => $this->status,
                       'message' => $message
                   ]);
    }
}