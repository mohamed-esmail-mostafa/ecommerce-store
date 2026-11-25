import { User } from './auth';
import { Pagination } from './pagination';
import { Product } from './product';

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number | null;
    product_title?: string | null;
    quantity: number;
    price: number | string;
    total: number | string;
    product?: Product | null;
    created_at?: string;
    updated_at?: string;
}

export interface OrderFilters {
    search?: string;
    status?: string;
    payement_status?: string;
}

export interface OrderStats {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_revenue: number;
}

export interface OrdersPageProps {
    orders: Pagination<Order>;
    stats: OrderStats;
    filters?: OrderFilters;
}

export interface Order {
    id: number;
    user_id?: number | null;
    product_id?: number | null;
    order_no: string;
    name: string;
    phone: string;
    email: string;
    governorate?: string | null;
    city?: string | null;
    address?: string | null;
    subtotal: number | string;
    shipping_cost?: number | string | null;
    discount?: number | string | null;
    total: number | string;
    payement_method?: string | null;
    payement_status?: string | null;
    status: string;
    notes?: string | null;
    items?: OrderItem[];
    user?: User | null;
    product?: Product | null;
    created_at?: string;
    updated_at?: string;
}

export interface OrderFilters {
    search?: string;
    status?: string;
    payement_status?: string;
}

export interface OrderStats {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_revenue: number;
}

export interface OrdersPageProps {
    orders: Pagination<Order>;
    stats: OrderStats;
    filters?: OrderFilters;
}
