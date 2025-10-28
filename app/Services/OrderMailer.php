<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderMailer
{
    public static function sendStatusUpdateEmail(Order $order, string $status)
    {
        $statusMessages = [
            'pending' => 'has been received and is being processed',
            'processing' => 'is now being processed',
            'shipped' => 'has been shipped',
            'delivered' => 'has been delivered',
            'cancelled' => 'has been cancelled'
        ];

        $message = $statusMessages[$status] ?? 'has been updated';

        Mail::send('emails.order-status', [
            'order' => $order,
            'message' => $message,
            'status' => $status
        ], function($mail) use ($order) {
            $mail->to($order->user->email)
                 ->subject("Order #{$order->id} Update - Fresh Connection");
        });
    }

    public static function sendInvoiceEmail(Order $order)
    {
        // Generate PDF
        $pdf = Pdf::loadView('invoices.order-invoice', [
            'order' => $order
        ]);

        Mail::send('emails.invoice-generated', [
            'order' => $order,
            'notifiable' => $order->user
        ], function($mail) use ($order, $pdf) {
            $mail->to($order->user->email)
                 ->subject("Fresh Connection - Invoice for Order #{$order->id}")
                 ->attachData($pdf->output(), "Invoice-{$order->id}.pdf", [
                     'mime' => 'application/pdf'
                 ]);
        });
    }
}