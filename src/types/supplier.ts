export interface Supplier {
    id: number;
    name: string;
    ethics: number | "Q";
    price: number | "Q";
    quality: number | "Q";
    products: {
        tshirt: "Y" | "N" | "Q";
        hoodie: "Y" | "N" | "Q";
        vest: "Y" | "N" | "Q";
        poloShirt: "Y" | "N" | "Q";
        sweatshirt: "Y" | "N" | "Q";
        shirt: "Y" | "N" | "Q";
        tabard: "Y" | "N" | "Q";
        apron: "Y" | "N" | "Q";
        coat: "Y" | "N" | "Q";
        gilet: "Y" | "N" | "Q";
        fleece: "Y" | "N" | "Q";
        beanie: "Y" | "N" | "Q";
        cap: "Y" | "N" | "Q";
        joggers: "Y" | "N" | "Q";
        shorts: "Y" | "N" | "Q";
        toteBag: "Y" | "N" | "Q";
        cycleJersey: "Y" | "N" | "Q";
        rugbyTop: "Y" | "N" | "Q";
        socks: "Y" | "N" | "Q";
    };
}

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
