<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
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
     * Display order management / user orders list.
     */
    public function ordersPage(): Response
    {
        $orders = Auth::user()?->hasRole('admin')
            ? $this->order_service->GetAllOrders()
            : $this->order_service->GetUserOrders(Auth::id());

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }
}
