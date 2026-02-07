import apiClient from './axios-config';
import type { Product, ProductRequest, Category, Inventory } from '@/types';

export const productsApi = {
    // Get all products for a store
    getProducts: async (storeId: number): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>(`/products?storeId=${storeId}`);
        return response.data;
    },

    // Get products with pagination
    getProductsPaged: async (
        storeId: number,
        page: number = 0,
        size: number = 20
    ): Promise<{ content: Product[]; totalElements: number; totalPages: number }> => {
        const response = await apiClient.get(`/products/paged?storeId=${storeId}&page=${page}&size=${size}`);
        return response.data;
    },

    // Search products
    searchProducts: async (storeId: number, query: string): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>(`/products/search?storeId=${storeId}&q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Get single product
    getProduct: async (id: number): Promise<Product> => {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },

    // Create product
    createProduct: async (data: ProductRequest): Promise<Product> => {
        const response = await apiClient.post<Product>('/products', data);
        return response.data;
    },

    // Update product
    updateProduct: async (id: number, data: Partial<ProductRequest>): Promise<Product> => {
        const response = await apiClient.put<Product>(`/products/${id}`, data);
        return response.data;
    },

    // Delete product
    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    },

    // Categories
    getCategories: async (storeId: number): Promise<Category[]> => {
        const response = await apiClient.get<Category[]>(`/categories?storeId=${storeId}`);
        return response.data;
    },

    createCategory: async (data: { storeId: number; name: string; description?: string }): Promise<Category> => {
        const response = await apiClient.post<Category>('/categories', data);
        return response.data;
    },

    updateCategory: async (id: number, data: { name: string; description?: string }): Promise<Category> => {
        const response = await apiClient.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/categories/${id}`);
    },

    // Inventory
    getInventory: async (branchId: number): Promise<Inventory[]> => {
        const response = await apiClient.get<Inventory[]>(`/inventory?branchId=${branchId}`);
        return response.data;
    },

    updateInventory: async (id: number, data: { quantity: number; reorderLevel?: number }): Promise<Inventory> => {
        const response = await apiClient.put<Inventory>(`/inventory/${id}`, data);
        return response.data;
    },

    // Get inventory for a product at all branches
    getProductInventory: async (productId: number): Promise<{
        inventoryId: number;
        branchId: number;
        branchName: string;
        quantity: number;
        reorderLevel: number;
    }[]> => {
        const response = await apiClient.get(`/inventory/product/${productId}`);
        return response.data;
    },
};
