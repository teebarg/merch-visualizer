export interface Database {
    public: {
        Tables: {
            suppliers: {
                Row: {
                    id: number;
                    name: string;
                    ethics: number | "Q";
                    price: number | "Q";
                    quality: number | "Q";
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["suppliers"]["Row"], "id" | "created_at" | "updated_at">;
                Update: Partial<Database["public"]["Tables"]["suppliers"]["Insert"]>;
            };
            products: {
                Row: {
                    id: number;
                    supplier_id: number;
                    product_type: string;
                    available: "Y" | "N" | "Q";
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
                Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
            };
        };
    };
}
