<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use App\Notifications\InvoiceGenerated;

class InvoiceController extends Controller
{
    public function generate(Order $order)
    {
        // Generate PDF with Unicode support
        $pdf = PDF::loadView('invoices.order-invoice', ['order' => $order])
            ->setOption('defaultFont', 'Arial')
            ->setOption('isRemoteEnabled', true)
            ->setOption('isPhpEnabled', true)
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isFontSubsettingEnabled', true);
        
        // Generate filename
        $filename = 'invoice-' . $order->id . '.pdf';
        
        // Store the PDF
        Storage::put('public/invoices/' . $filename, $pdf->output());
        
        // Update order with invoice path
        $order->update([
            'invoice_path' => 'invoices/' . $filename
        ]);

        // Send email notification with invoice
        try {
            \Illuminate\Support\Facades\Log::info('Attempting to send invoice notification', [
                'order_id' => $order->id,
                'user_id' => $order->user->id,
                'user_email' => $order->user->email
            ]);
            
            $order->user->notify(new InvoiceGenerated($order));
            
            \Illuminate\Support\Facades\Log::info('Invoice notification queued successfully');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send invoice notification', [
                'error' => $e->getMessage(),
                'order_id' => $order->id
            ]);
        }

        return $pdf->download($filename);
    }

    public function download(Order $order)
    {
        if (!$order->invoice_path) {
            return redirect()->back()->with('error', 'Invoice not found');
        }

        return Storage::download('public/' . $order->invoice_path);
    }
}