import { User } from './auth';
import { Category } from './category';
import { Order } from './order';
import { Pagination } from './pagination';

export interface AccountOrderStats {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    total_spent: number;
}

export interface ProfileFormValues {
    name: string;
    email: string;
    phone: string;
    address: string;
    [key: string]: any;
}

export interface PasswordFormValues {
    current_password: string;
    password: string;
    password_confirmation: string;
    [key: string]: any;
}

export interface AccountPageProps {
    user: User;
    orders: Pagination<Order>;
    orderStats: AccountOrderStats;
    categories?: Category[];
}
