import { Product } from './product';

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    price: number | string;
    product: Product;
    created_at?: string;
    updated_at?: string;
}

export interface Cart {
    id: number;
    user_id?: number | null;
    guest_token?: string | null;
    status: string;
    expires_at?: string | null;
    items: CartItem[];
    created_at?: string;
    updated_at?: string;
}
