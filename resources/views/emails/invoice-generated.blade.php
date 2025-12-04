<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            margin-bottom: 30px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .table th, .table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .table th {
            text-align: left;
        }
        .footer {
            margin-top: 30px;
            color: #666;
        }
        .total-row {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invoice for Order #{{ $order->id }}</h1>
            <p>Dear {{ $notifiable->name }},</p>
            <p>Thank you for shopping at Fresh Connection! Your invoice is attached below.</p>
        </div>

        <table class="table">
            <tr>
                <th>Order Details</th>
                <th></th>
            </tr>
            <tr>
                <td>Order Number</td>
                <td>#{{ $order->id }}</td>
            </tr>
            <tr>
                <td>Order Date</td>
                <td>{{ $order->created_at->format('M d, Y') }}</td>
            </tr>
            <tr>
                <td>Payment Method</td>
                <td>{{ ucwords(str_replace('_', ' ', $order->payment_method)) }}</td>
            </tr>
        </table>

        <!-- Items Table -->
        <table class="table">
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product->product_name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>&#8369;{{ number_format($item->price, 2) }}</td>
                <td>&#8369;{{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach

            <tr><td colspan="4"><hr></td></tr>
            <tr>
                <td colspan="3" class="text-right">Subtotal</td>
                <td>&#8369;{{ number_format($order->subtotal, 2) }}</td>
            </tr>

            <tr>
                <td colspan="3" class="text-right">VAT (12%)</td>
                <td>&#8369;{{ number_format($order->total * 0.12, 2) }}</td>
            </tr>

            @if($order->discount && $order->promotion)
            <tr>
                <td colspan="3" class="text-right">Discount ({{ $order->promotion->code }})</td>
                <td>{{ number_format($order->discount, 2) }}</td>
            </tr>
            @endif

            <tr>
                <td colspan="3" class="text-right">Delivery Fee</td>
                <td>&#8369;{{ number_format($order->delivery_fee, 2) }}</td>
            </tr>

            <tr class="total-row">
                <td colspan="3" class="text-right">Total</td>
                <td>&#8369;{{ number_format($order->total, 2) }}</td>
            </tr>
        </table>

        <p>If you have any questions about your order, please don't hesitate to contact us.</p>

        <div class="footer">
            <p>Best regards,<br>Fresh Connection</p>
        </div>
    </div>
</body>
</html>
