<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body {
            font-family: 'Helvetica', Arial, sans-serif;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background: #fff;
            line-height: 1.4;
            font-size: 12px;
        }
        .invoice-box {
            background: #fff;
            border: 1px solid #eee;
            padding: 15px;
            position: relative;
        }
        .invoice-header {
            border-bottom: 2px solid #4F7942;
            padding-bottom: 10px;
            margin-bottom: 15px;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .company-info {
            text-align: left;
        }
        .invoice-title {
            font-size: 28px;
            color: #4F7942;
            margin: 0;
            font-weight: bold;
        }
        .company-details {
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        }
        .invoice-meta {
            text-align: right;
        }
        .invoice-number {
            font-size: 20px;
            color: #4F7942;
            margin-bottom: 10px;
        }
        .invoice-details {
            margin-bottom: 40px;
        }
        .invoice-details-grid {
            display: flex;
            justify-content: space-between;
            gap: 40px;
        }
        .details-section {
            flex: 1;
            background: #f8f8f8;
            padding: 20px;
            border-radius: 5px;
        }
        .details-section h3 {
            color: #4F7942;
            margin: 0 0 15px 0;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .details-section p {
            margin: 0;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            background: #fff;
            border: 1px solid #eee;
        }
        th {
            background: #4F7942;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 1px;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
            color: #555;
        }
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        .total-section {
            margin-top: 40px;
            margin-left: auto;
            width: 350px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .total-label {
            color: #666;
            font-weight: 600;
        }
        .total-amount {
            color: #333;
            font-weight: 600;
        }
        .grand-total {
            margin-top: 20px;
            padding: 15px;
            background: #4F7942;
            color: white;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .grand-total .total-label,
        .grand-total .total-amount {
            color: white;
            font-size: 18px;
            font-weight: bold;
        }
        .footer {
            margin-top: 60px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 30px;
        }
        .footer p {
            margin: 5px 0;
        }
        .status-paid {
            display: inline-block;
            background: #4F7942;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .status-pending {
            display: inline-block;
            background: #ffa500;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="watermark">FRESH CONNECTION</div>
        
        <div class="invoice-header">
            <div class="company-info">
                <h1 class="invoice-title">Fresh Connection</h1>
                <div class="company-details">
                    Your Fresh Food Partner<br>
                    Metro Manila, Philippines<br>
                    freshconnectionservices@gmail.com<br>
                    +63 (2) 8123-4567
                </div>
            </div>
            <div class="invoice-meta">
                <div class="invoice-number">INVOICE #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</div>
                <div>Issue Date: {{ $order->created_at->format('F d, Y') }}</div>
                <div>Due Date: {{ $order->created_at->format('F d, Y') }}</div>
                <div style="margin-top: 10px;">
                    <span class="status-{{ strtolower($order->paid ? 'paid' : 'pending') }}">
                        {{ $order->paid ? 'PAID' : 'PENDING' }}
                    </span>
                </div>
            </div>
        </div>

        <div class="invoice-details">
            <div class="invoice-details-grid">
                <div class="details-section">
                    <h3>Billed To</h3>
                    <p>
                        <strong>{{ $order->first_name }} {{ $order->last_name }}</strong><br>
                        {{ $order->address }}<br>
                        {{ $order->barangay }}<br>
                        {{ $order->city }}, {{ $order->region }} {{ $order->zip_code }}<br>
                        <strong>Phone:</strong> {{ $order->mobile_number }}
                    </p>
                </div>
                <div class="details-section">
                    <h3>Payment Information</h3>
                    <p>
                        <strong>Method:</strong> {{ ucfirst($order->payment_method) }}<br>
                        <strong>Status:</strong> {{ ucfirst($order->paid ? 'Paid' : 'Pending') }}<br>
                        <strong>Order Status:</strong> {{ ucfirst($order->status) }}<br>
                        <strong>Order Date:</strong> {{ $order->created_at->format('F d, Y g:i A') }}
                    </p>
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 40%;">Item Description</th>
                    <th style="width: 20%; text-align: center;">Quantity</th>
                    <th style="width: 20%; text-align: right;">Unit Price</th>
                    <th style="width: 20%; text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->orderItems as $item)
                <tr>
                    <td>
                        <strong>{{ $item->product->name }}</strong><br>
                        <small style="color: #666;">SKU: {{ $item->product->id }}</small>
                    </td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">₱{{ number_format($item->price, 2) }}</td>
                    <td style="text-align: right;">₱{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-amount">₱{{ number_format($order->subtotal, 2) }}</span>
            </div>
            <div class="total-row">
                <span class="total-label">Delivery Fee</span>
                <span class="total-amount">₱{{ number_format($order->delivery_fee, 2) }}</span>
            </div>
            @if($order->discount > 0)
            <div class="total-row">
                <span class="total-label">Discount</span>
                <span class="total-amount">₱{{ number_format($order->discount, 2) }}</span>
            </div>
            @endif
            <div class="grand-total">
                <span class="total-label">TOTAL AMOUNT</span>
                <span class="total-amount">₱{{ number_format($order->total, 2) }}</span>
            </div>
        </div>

        <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>This invoice was automatically generated by Fresh Connection</p>
            <p style="margin-top: 15px;">
                For any questions or concerns, please contact our customer service:<br>
                Email: support@freshconnection.ph | Phone: +63 (2) 8123-4567
            </p>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                All prices are in Philippine Peso (₱). Please keep this invoice for your records.
            </p>
        </div>
    </div>
</body>
</html>