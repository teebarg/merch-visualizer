export interface Product {
    id: number;
    company_id: string;
    availability: "Y" | "N" | "Q";
}

export interface Company {
    id: number;
    name: string;
    ethics_rating: number;
    price_rating: number;
    quality_rating: number;
    products: Product[];
}
