<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .table th { text-align: left; }
        .footer { margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Invoice for Order #{{ $order->id }}</h1>
            <p>Dear {{ $notifiable->name }},</p>
            <p>Thank you for shopping at Fresh Connection! Your invoice is attached to this email.</p>
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
                <td>Total Amount</td>
                <td>₱{{ number_format($order->total, 2) }}</td>
            </tr>
        </table>

        <p>If you have any questions about your order, please don't hesitate to contact us.</p>

        <div class="footer">
            <p>Best regards,<br>Fresh Connection</p>
        </div>
    </div>
</body>
</html>