<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $order_service,

    ) {}



    public function ordersPage()
    {
        return Inertia::render('orders/index',[
            'orders'=>$this->order_service->GetAllOrders()
        ]);
    }
}
