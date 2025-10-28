<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F7942;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0 0 5px 5px;
        }
        .order-details {
            background-color: white;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            border: 1px solid #eee;
        }
        .status {
            font-size: 18px;
            color: #4F7942;
            margin: 15px 0;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4F7942;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }
        .detail-row {
            margin: 10px 0;
        }
        .detail-label {
            font-weight: bold;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Fresh Connection</h1>
    </div>
    
    <div class="content">
        <h2>Hello {{ $order->first_name }}!</h2>
        
        <div class="status">
            @switch($order->status)
                @case('placed')
                    Thank you for your order! We have received it successfully.
                    @break
                @case('pending')
                    Your order is pending confirmation
                    @break
                @case('processing')
                    Your order is being processed
                    @break
                @case('on_delivery')
                    Your order is out for delivery!
                    @break
                @case('delivered')
                    Your order has been delivered successfully!
                    @break
                @case('cancelled')
                    Your order has been cancelled
                    @break
                @default
                    Your order status has been updated
            @endswitch
        </div>

        <div class="order-details">
            <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span>#{{ $order->id }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span>{{ $order->formatted_total }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Current Status:</span>
                <span>{{ ucfirst($order->status) }}</span>
            </div>
            @if($order->status === 'on_delivery')
            <div class="detail-row">
                <span class="detail-label">Delivery Address:</span>
                <span>{{ $order->address }}, {{ $order->barangay }}, {{ $order->city }}, {{ $order->region }} {{ $order->zip_code }}</span>
            </div>
            @endif
        </div>

       

        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
    </div>

    <div class="footer">
        <p>Thank you for shopping with Fresh Connection!</p>
        <p>© {{ date('Y') }} Fresh Connection. All rights reserved.</p>
    </div>
</body>
</html>