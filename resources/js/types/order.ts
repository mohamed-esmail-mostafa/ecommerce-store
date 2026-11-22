import { User } from './auth';
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
    created_at?: string;
    updated_at?: string;
}
