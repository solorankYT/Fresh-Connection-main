<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\OrderMailer;

class OrderStatusObserver
{
    /**
     * Handle the OrderStatus "created" event.
     */
    public function created(OrderStatus $orderStatus): void
    {
        $this->notifyUser($orderStatus);
    }

    /**
     * Handle the OrderStatus "updated" event.
     */
    public function updated(OrderStatus $orderStatus): void
    {
        $this->notifyUser($orderStatus);
    }

    /**
     * Send notification to user about order status change
     */
    private function notifyUser(OrderStatus $orderStatus): void
    {
        try {
            \Log::info('Processing order status change', ['order_status_id' => $orderStatus->id]);
            
            $order = Order::with(['user', 'items.product'])->find($orderStatus->order_id);
            
            if (!$order) {
                \Log::error('Order not found', ['order_id' => $orderStatus->order_id]);
                return;
            }

            if (!$order->user) {
                \Log::error('User not found for order', ['order_id' => $order->id]);
                return;
            }

            // Send status update email
            OrderMailer::sendStatusUpdateEmail($order, $orderStatus->status);
            \Log::info('Status update email sent', ['order_id' => $order->id]);

            // If status is delivered, also send the invoice
            if (strtolower($orderStatus->status) === 'delivered') {
                OrderMailer::sendInvoiceEmail($order);
                \Log::info('Invoice email sent', ['order_id' => $order->id]);
            }
        } catch (\Exception $e) {
            \Log::error('Error processing order status', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'order_id' => $orderStatus->order_id ?? null
            ]);
        }
    }

    /**
     * Handle the OrderStatus "deleted" event.
     */
    public function deleted(OrderStatus $orderStatus): void
    {
        //
    }

    /**
     * Handle the OrderStatus "restored" event.
     */
    public function restored(OrderStatus $orderStatus): void
    {
        //
    }

    /**
     * Handle the OrderStatus "force deleted" event.
     */
    public function forceDeleted(OrderStatus $orderStatus): void
    {
        //
    }
}
