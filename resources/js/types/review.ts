import { Pagination } from './pagination';
import { User } from './auth';

export interface ReviewProduct {
    id: number;
    title: string;
    slug: string;
    price: string | number;
    sale_price?: string | number | null;
    images?: Array<{ id: number; image_url: string; is_primary?: boolean }>;
}

export interface Review {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    title?: string | null;
    comment?: string | null;
    is_approved: boolean;
    helpful_count: number;
    created_at: string;
    updated_at: string;
    product?: ReviewProduct | null;
    user?: User | null;
}

export interface ReviewStats {
    total: number;
    average_rating: number;
    approved_count: number;
    pending_count: number;
    rating_breakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export interface ReviewFilters {
    search?: string;
    status?: 'all' | 'approved' | 'pending';
    rating?: string;
}

export interface ReviewsPageProps {
    reviews: Pagination<Review>;
    stats: ReviewStats;
    filters?: ReviewFilters;
}

export interface ReviewFormValues {
    rating: number;
    title?: string;
    comment?: string;
    is_approved: boolean;
}
