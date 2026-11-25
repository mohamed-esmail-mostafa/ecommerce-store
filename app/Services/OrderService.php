<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class OrderService
{
    /**
     * Get paginated orders for admin overview with optional search and status filtering.
     */
    public function GetAllOrders(
        ?string $search = null,
        ?string $status = null,
        ?string $paymentStatus = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Order::query()
            ->with(['items.product.images', 'product.images', 'user'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_no', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($paymentStatus, function ($query, $paymentStatus) {
                $query->where('payement_status', $paymentStatus);
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get aggregated order statistics for the dashboard.
     *
     * @return array<string, int|float>
     */
    public function GetOrderStats(): array
    {
        return [
            'total_orders' => Order::count(),
            'pending_orders' => Order::whereIn('status', ['pending', 'processing', 'shipped'])->count(),
            'completed_orders' => Order::whereIn('status', ['completed', 'delivered'])->count(),
            'cancelled_orders' => Order::whereIn('status', ['cancelled', 'failed'])->count(),
            'total_revenue' => (float) Order::whereNotIn('status', ['cancelled', 'failed'])->sum('total'),
        ];
    }

    /**
     * Update an order's fulfillment and/or payment status.
     */
    public function UpdateOrderStatus(int $id, string $status, ?string $paymentStatus = null): Order
    {
        $order = Order::findOrFail($id);
        $order->status = $status;

        if ($paymentStatus !== null && $paymentStatus !== '') {
            $order->payement_status = $paymentStatus;
        }

        $order->save();

        return $order->fresh(['items.product.images', 'product.images', 'user']);
    }

    /**
     * Delete an existing order.
     */
    public function DeleteOrder(int $id): bool
    {
        $order = Order::findOrFail($id);

        return (bool) $order->delete();
    }

    /**
     * Get paginated orders for a specific user.
     */
    public function GetUserOrders(int $userId): LengthAwarePaginator
    {
        return Order::where('user_id', $userId)
            ->with(['items.product'])
            ->latest()
            ->paginate(10);
    }

    /**
     * Create an order from the user or guest cart.
     */
    public function createOrder(array $data, Cart $cart, ?int $userId = null): Order
    {
        return DB::transaction(function () use ($data, $cart, $userId) {
            $cart->loadMissing('items.product');

            if ($cart->items->isEmpty()) {
                throw new InvalidArgumentException('Cannot place an order with an empty cart.');
            }

            // Generate unique human-readable order number
            $orderNo = 'ORD-'.strtoupper(Str::random(10));
            while (Order::where('order_no', $orderNo)->exists()) {
                $orderNo = 'ORD-'.strtoupper(Str::random(10));
            }

            // Calculate totals
            $subtotal = 0;
            foreach ($cart->items as $item) {
                $itemPrice = (float) $item->price;
                $subtotal += $itemPrice * $item->quantity;
            }

            $discount = isset($data['discount']) ? (float) $data['discount'] : 0.0;
            $shippingCost = $subtotal >= 50 ? 0.0 : (isset($data['shipping_cost']) ? (float) $data['shipping_cost'] : 10.0);
            $total = max(0, $subtotal + $shippingCost - $discount);

            $firstItem = $cart->items->first();

            $order = Order::create([
                'user_id' => $userId,
                'product_id' => $firstItem?->product_id,
                'order_no' => $orderNo,
                'name' => $data['name'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'governorate' => $data['governorate'] ?? null,
                'city' => $data['city'] ?? null,
                'address' => $data['address'] ?? null,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'total' => $total,
                'payement_method' => $data['payement_method'] ?? 'cash_on_delivery',
                'payement_status' => 'pending',
                'status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            // Create individual order items & adjust product inventory
            foreach ($cart->items as $item) {
                $itemTotal = (float) $item->price * $item->quantity;

                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_title' => $item->product?->title ?? 'Product',
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $itemTotal,
                ]);

                if ($item->product && $item->product->stock > 0) {
                    $item->product->decrement('stock', min($item->quantity, $item->product->stock));
                }
            }

            // Clear cart
            $cart->items()->delete();

            return $order->load(['items.product.images', 'user']);
        });
    }

    /**
     * Find an order by its unique order number.
     */
    public function getOrderByNo(string $orderNo): Order
    {
        return Order::with(['items.product.images', 'user'])
            ->where('order_no', $orderNo)
            ->firstOrFail();
    }
}
