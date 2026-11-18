export interface Parent {
    id: number;
    name_en: string;
    name_ar: string;
}


export interface Category {
    id: number;
    name_en: string;
    name_ar: string;
    slug: string;
    parent_id: number | null;
    parent: Parent | null;
    description_en: string | null;
    description_ar: string | null;
    image: string | null;
    is_active: boolean;
    created_at: string;
}