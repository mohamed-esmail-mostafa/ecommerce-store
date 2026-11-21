import { Category } from './category';
import { Supplier } from './supplier';
import { Brand } from './brand';

export type ProductType = 'simple' | 'variant';
export type ProductKind = 'physical' | 'digital';

export interface ProductImage {
    id: number;
    product_id: number;
    image: string;
    type?: string | null;
    size?: string | null;
    public_id?: string | null;
    order?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    slug: string;
    category_id: number;
    supplier_id: number | null;
    brand_id?: number | null;
    brand?: string | null;
    title: string;
    description: string | null;
    long_description: string | null;
    sku: string | null;
    price: number | string;
    sale_price: number | string | null;
    product_type: ProductType;
    product_kind: ProductKind;
    stock: number;
    is_active: boolean;
    is_popular: boolean;
    is_featured: boolean;
    images: ProductImage[] | string[];
    category: Category;
    supplier?: Supplier | null;
    brandModel?: Brand | null;
    brand_model?: Brand | null;
    created_at?: string;
    updated_at?: string;
}
