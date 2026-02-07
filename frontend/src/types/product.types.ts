// Product unit enum
export type ProductUnit = 'PIECE' | 'KG' | 'GRAM' | 'LITER' | 'ML';

// Product entity
export interface Product {
    id: number;
    storeId: number;
    categoryId?: number | null;
    name: string;
    sku?: string;
    barcode?: string;
    description?: string;
    price: number;
    costPrice?: number;
    image?: string;
    active: boolean;
    unit: ProductUnit;
    createdAt: string;
    updatedAt: string;
}

// Product with inventory info (for POS)
export interface ProductWithInventory extends Product {
    quantity: number;
    reorderLevel: number;
    lowStock: boolean;
}

// Category entity
export interface Category {
    id: number;
    storeId: number;
    name: string;
    description?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Inventory entity
export interface Inventory {
    id: number;
    productId: number;
    branchId: number;
    quantity: number;
    reorderLevel: number;
    product?: Product;
    createdAt: string;
    updatedAt: string;
}

// Product create/update request
export interface ProductRequest {
    storeId: number;
    categoryId?: number | null;
    name: string;
    sku?: string;
    barcode?: string;
    description?: string;
    price: number;
    costPrice?: number;
    unit: ProductUnit;
    active?: boolean;
}
