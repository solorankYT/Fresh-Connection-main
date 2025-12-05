<h2 style="text-align:center">Sales Report</h2>

<table width="100%" border="1" cellspacing="0" cellpadding="5">
    <thead>
        <tr>
            <th>Product Name</th>
            <th>Total Sold</th>
            <th>Total Revenue</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($sales as $item)
        <tr>
            <td>{{ $item->product_name }}</td>
            <td>{{ $item->total_sold }}</td>
            <td>&#8369;{{ number_format($item->total_revenue, 2) }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<style>
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }

@php
$font = public_path('fonts/DejaVuSans.ttf');
@endphp

@font-face {
    font-family: "DejaVu";
    src: url("{{ $font }}") format("truetype");
}

body, table, th, td {
    font-family: "DejaVu", sans-serif;
}

