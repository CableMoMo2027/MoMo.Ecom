export interface ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    image: string;
    badge?: string;
    category?: string;
}
