import apiClient from './axios-config';
import type { Customer, CustomerRequest } from '@/types';

export const customersApi = {
    // Get all customers for a store
    getCustomers: async (storeId: number): Promise<Customer[]> => {
        const response = await apiClient.get<Customer[]>(`/customers?storeId=${storeId}`);
        return response.data;
    },

    // Get single customer
    getCustomer: async (id: number): Promise<Customer> => {
        const response = await apiClient.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    // Create customer
    createCustomer: async (data: CustomerRequest): Promise<Customer> => {
        const response = await apiClient.post<Customer>('/customers', data);
        return response.data;
    },

    // Update customer
    updateCustomer: async (id: number, data: Partial<CustomerRequest>): Promise<Customer> => {
        const response = await apiClient.put<Customer>(`/customers/${id}`, data);
        return response.data;
    },

    // Search customers by phone or name
    searchCustomers: async (storeId: number, query: string): Promise<Customer[]> => {
        const customers = await customersApi.getCustomers(storeId);
        const lowerQuery = query.toLowerCase();
        return customers.filter(
            (c) =>
                c.name.toLowerCase().includes(lowerQuery) ||
                c.phone?.includes(query) ||
                c.email?.toLowerCase().includes(lowerQuery)
        );
    },
};
