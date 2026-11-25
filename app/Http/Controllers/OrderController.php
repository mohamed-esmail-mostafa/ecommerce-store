<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $order_service,
    ) {}

    /**
     * Display the checkout page for guests and authenticated users.
     */
    public function checkoutPage(CartService $cartService): Response
    {
        $cart = $cartService->getCart()
            ->load(['items.product.images', 'items.product.category']);

        return Inertia::render('checkout/index', [
            'cart' => $cart,
            'user' => Auth::user(),
        ]);
    }

    /**
     * Store a newly created order from the current cart.
     */
    public function store(StoreOrderRequest $request, CartService $cartService): RedirectResponse
    {
        $cart = $cartService->getCart()->load('items.product');

        if ($cart->items->isEmpty()) {
            return back()->withErrors([
                'cart' => 'Your cart is empty. Please add items before checking out.',
            ]);
        }

        $order = $this->order_service->createOrder(
            $request->validated(),
            $cart,
            Auth::id()
        );

        return redirect()->route('order.confirmation', ['order_no' => $order->order_no])
            ->with('success', 'Your order has been placed successfully!');
    }

    /**
     * Display the order confirmation page.
     */
    public function confirmation(string $order_no): Response
    {
        $order = $this->order_service->getOrderByNo($order_no);

        return Inertia::render('checkout/confirmation', [
            'order' => $order,
        ]);
    }

    /**
     * Display order management / orders list with filtering and stats.
     */
    public function ordersPage(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->filled('status') && $request->input('status') !== 'all'
            ? (string) $request->input('status')
            : null;
        $paymentStatus = $request->filled('payement_status') && $request->input('payement_status') !== 'all'
            ? (string) $request->input('payement_status')
            : null;
        $perPage = (int) $request->input('per_page', 10);

        return Inertia::render('orders/index', [
            'orders' => $this->order_service->GetAllOrders($search, $status, $paymentStatus, $perPage),
            'stats' => $this->order_service->GetOrderStats(),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
                'payement_status' => $paymentStatus ?? 'all',
            ],
        ]);
    }

    /**
     * Update an order's status and payment status.
     */
    public function updateStatus(UpdateOrderRequest $request, int $id): RedirectResponse
    {
        $this->order_service->UpdateOrderStatus(
            $id,
            $request->validated('status'),
            $request->validated('payement_status')
        );

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Delete an existing order.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->order_service->DeleteOrder($id);

        return redirect()->back()->with('success', 'Order deleted successfully.');
    }
}
