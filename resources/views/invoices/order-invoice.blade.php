<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background: #fff;
            line-height: 1.4;
            font-size: 12px;
        }
        .invoice-box {
            border: 1px solid #eee;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #4F7942;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .company-info h1 {
            color: #4F7942;
            margin: 0;
            font-size: 28px;
        }
        .company-details {
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        }
        .invoice-meta {
            text-align: right;
        }
        .invoice-meta .invoice-number {
            font-size: 20px;
            color: #4F7942;
            font-weight: bold;
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
        .details-section {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 5px;
            flex: 1;
        }
        .details-section h3 {
            color: #4F7942;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
        }
        .invoice-details-grid {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #4F7942;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            font-size: 12px;
        }
        tr:nth-child(even) td {
            background: #f9f9f9;
        }
        .total-section {
            width: 300px;
            margin-left: auto;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
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
            margin-top: 15px;
            padding: 12px;
            background: #4F7942;
            color: white;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 40px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }

        
        @php
        $font = public_path('fonts/DejaVuSans.ttf');
        @endphp

        @font-face {
            font-family: "DejaVu";
            src: url("{{ $font }}") format("truetype");
        }


    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="invoice-header">
            <div class="company-info">
                <h1>Fresh Connection</h1>
                <div class="company-details">
                    Your Fresh Food Partner<br>
                    Metro Manila, Philippines<br>
                    tfreshconnectionopd@gmail.com<br>
                    +63 (9) 123456789
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
                    <strong>Method:</strong> {{ ucwords(str_replace('_', ' ', $order->payment_method)) }}<br>
                    <strong>Status:</strong> {{ $order->paid ? 'Paid' : 'Pending' }}<br>
                    <strong>Order Status:</strong> {{ ucfirst($order->status) }}<br>
                    <strong>Order Date:</strong> {{ $order->created_at->format('F d, Y g:i A') }}
                </p>
            </div>
        </div>

        <!-- Items Table -->
        <table>
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th style="text-align:center;">Quantity</th>
                    <th style="text-align:right;">Unit Price</th>
                    <th style="text-align:right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->orderItems as $item)
                <tr>
                    <td>{{ $item->product->product_name }}</td>
                    <td style="text-align:center;">{{ $item->quantity }}</td>
                    <td style="text-align:right;">&#8369;{{ number_format($item->price, 2) }}</td>
                    <td style="text-align:right;">&#8369;{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        @php
            $tax = $order->subtotal * 0.12;
            $grandTotal = $order->subtotal + $tax + $order->delivery_fee - $order->discount;
        @endphp

        <div class="total-section">
            <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-amount">&#8369;{{ number_format($order->subtotal, 2) }}</span>
            </div>
            <div class="total-row">
                <span class="total-label">VAT (12%)</span>
                <span class="total-amount">&#8369;{{ number_format($tax, 2) }}</span>
            </div>
            @if($order->discount > 0)
            <div class="total-row">
                <span class="total-label">Discount</span>
                <span class="total-amount">-&#8369;{{ number_format($order->discount, 2) }}</span>
            </div>
            @endif
            <div class="total-row">
                <span class="total-label">Delivery Fee</span>
                <span class="total-amount">&#8369;{{ number_format($order->delivery_fee, 2) }}</span>
            </div>
            <div class="grand-total">
                <span class="total-label">TOTAL AMOUNT</span>
                <span class="total-amount">&#8369;{{ number_format($grandTotal, 2) }}</span>
            </div>
        </div>

        <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>This invoice was automatically generated by Fresh Connection</p>
            <p>
                For questions, please contact us:<br>
                Email: tfreshconnectionopd@gmail.com | Phone: +63 (9) 123456789
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 10px;">
                All prices are in Philippine Peso (&#8369;). Please keep this invoice for your records.
            </p>
        </div>
    </div>
</body>
</html>
