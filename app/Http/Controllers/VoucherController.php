<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VoucherController extends Controller
{
    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0'
        ]);

        $voucher = Voucher::where('code', $request->code)->first();

        if (!$voucher) {
            return response()->json([
                'valid' => false,
                'message' => 'Voucher not found'
            ], 404);
        }

        if (!$voucher->isValid()) {
            return response()->json([
                'valid' => false,
                'message' => 'Voucher is not valid'
            ], 400);
        }

        if ($request->subtotal < $voucher->minimum_spend) {
            return response()->json([
                'valid' => false,
                'message' => "Minimum spend required is ₱" . number_format($voucher->minimum_spend, 2)
            ], 400);
        }

        $discount = $voucher->calculateDiscount($request->subtotal);

        return response()->json([
            'valid' => true,
            'voucher' => $voucher,
            'discount' => $discount,
            'message' => 'Voucher is valid'
        ]);
    }

    public function apply(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'order_id' => 'required|exists:orders,id'
        ]);

        $voucher = Voucher::where('code', $request->code)->first();

        if (!$voucher || !$voucher->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid voucher'
            ], 400);
        }

        // Increment times_used
        $voucher->increment('times_used');

        return response()->json([
            'success' => true,
            'message' => 'Voucher applied successfully'
        ]);
    }
}