<?php

namespace App\Services;

use App\Models\Order;

class OrderService
{
    public function __construct()
    {
        //
    }

    public function GetAllOrders()
    {
        return Order::latest()->paginate(10);
    }
}
