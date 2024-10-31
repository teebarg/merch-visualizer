export interface Company {
    id: string;
    name: string;
    ethics: number | null;
    price: number | null;
    quality: number | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    display_name: string;
  }
  
  export interface CompanyProduct {
    id: string;
    company_id: string;
    product_id: string;
    is_available: boolean;
  }
  
  export interface CompanyWithProducts extends Company {
    products: Record<string, boolean>;
  }
  
  export interface MetricsData {
    name: string;
    ethics: number | null;
    price: number | null;
    quality: number | null;
  }
  
  export interface ProductAvailability {
    name: string;
    display_name: string;
    availability: number;
  }
  
  export interface User {
    id: string;
    email: string;
    role: 'admin' | 'viewer';
  }