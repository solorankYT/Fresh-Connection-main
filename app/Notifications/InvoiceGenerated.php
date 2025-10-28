<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceGenerated extends Notification
{

    protected $order;
    protected $pdfContent;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        try {
            \Log::info('Starting invoice generation', ['order_id' => $this->order->id]);

            // Make sure order is loaded with all needed relationships
            $this->order->load(['items.product', 'user']);
            
            \Log::info('Generating PDF from template', [
                'order_data' => $this->order->toArray()
            ]);

            // Generate PDF from invoice template
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.order-invoice', [
                'order' => $this->order
            ]);

            \Log::info('PDF generated successfully, preparing email');

            return (new MailMessage)
                ->subject('Fresh Connection - Invoice for Order #' . $this->order->id)
                ->markdown('emails.invoice-generated', [
                    'order' => $this->order,
                    'notifiable' => $notifiable
                ])
                ->attachData(
                    $pdf->output(),
                    'Invoice-' . $this->order->id . '.pdf',
                    ['mime' => 'application/pdf']
                );
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