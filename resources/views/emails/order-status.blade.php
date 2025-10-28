<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { margin-bottom: 30px; }
        .status { padding: 10px; background-color: #f8f9fa; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Status Update</h1>
            <p>Dear {{ $order->user->name }},</p>
        </div>

        <div class="status">
            <p>Your order #{{ $order->id }} {{ $message }}.</p>
        </div>

        <p>Order Status: <strong>{{ ucfirst($status) }}</strong></p>

        <div class="footer">
            <p>Thank you for shopping with Fresh Connection!</p>
            <p>Best regards,<br>Fresh Connection</p>
        </div>
    </div>
</body>
</html>