export type BannerType = 'slider' | 'section';

export interface Banner {
    id: number;
    title: string | null;
    description: string | null;
    image: string | null;
    public_id: string | null;
    mobile_image: string | null;
    public_mobile_id: string | null;
    type: BannerType;
    link: string | null;
    button_text: string | null;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}
