export interface Post {
    id: string;
    title: string;
    slug?: string;
    topic: string;
    content: string;
    image_url: string;
    created_at: string;
    price?: number | null;
    in_stock?: boolean;
    compare_at_price?: number | null;
    stock_quantity?: number;
    sort_order?: number;
    featured?: boolean;
    tags?: string[];
    images?: string[];
    volume_ml?: number | null;
}

export interface User {
    id: string;
    email?: string;
}
