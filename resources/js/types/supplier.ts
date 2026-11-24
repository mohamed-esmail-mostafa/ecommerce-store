export interface Supplier {
    id: number;
    name: string;
    slug: string;
    phone?: string | null;
    address?: string | null;
    whatsup?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SupplierFilters {
    search?: string;
    status?: 'all' | 'active' | 'inactive';
}

export interface SuppliersPageProps {
    suppliers: Supplier[];
    filters?: SupplierFilters;
}

export interface SupplierFormValues {
    name: string;
    phone?: string;
    address?: string;
    whatsup?: string;
    is_active: boolean;
}
