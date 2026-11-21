export interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page?: number;
    first_page_url: string;
    last_page_url: string;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}
