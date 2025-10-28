<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Queue\SerializesModels;

class OrderInvoice extends Mailable
{
    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        \Log::info('Starting invoice email generation', ['order_id' => $this->order->id]);

        try {
            // Make sure order is loaded with all needed relationships
            $this->order->load(['items.product', 'user']);
            
            \Log::info('Generating PDF', ['order_id' => $this->order->id]);
            
            $pdf = Pdf::loadView('invoices.order-invoice', [
                'order' => $this->order
            ]);

            return $this->markdown('emails.invoice-generated')
                       ->subject('Fresh Connection - Invoice for Order #' . $this->order->id)
                       ->with([
                           'order' => $this->order,
                           'notifiable' => $this->order->user
                       ])
                       ->attachData($pdf->output(), 'Invoice-' . $this->order->id . '.pdf', [
                           'mime' => 'application/pdf'
                       ]);
                       
        } catch (\Exception $e) {
            \Log::error('Failed to generate invoice email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'order_id' => $this->order->id
            ]);
            throw $e;
        }
    }
}