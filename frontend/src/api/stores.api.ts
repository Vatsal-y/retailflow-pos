import apiClient from './axios-config';
import type { Store, Branch, Employee, SubscriptionPlan } from '@/types';

export const storesApi = {
    // Stores
    getStores: async (): Promise<Store[]> => {
        const response = await apiClient.get<Store[]>('/stores');
        return response.data;
    },

    getStore: async (id: number): Promise<Store> => {
        const response = await apiClient.get<Store>(`/stores/${id}`);
        return response.data;
    },

    createStore: async (data: Partial<Store>): Promise<Store> => {
        const response = await apiClient.post<Store>('/stores', data);
        return response.data;
    },

    updateStore: async (id: number, data: Partial<Store>): Promise<Store> => {
        const response = await apiClient.put<Store>(`/stores/${id}`, data);
        return response.data;
    },

    // Branches
    getBranches: async (storeId: number): Promise<Branch[]> => {
        const response = await apiClient.get<Branch[]>(`/branches?storeId=${storeId}`);
        return response.data;
    },

    getBranch: async (id: number): Promise<Branch> => {
        const response = await apiClient.get<Branch>(`/branches/${id}`);
        return response.data;
    },

    createBranch: async (data: Partial<Branch>): Promise<Branch> => {
        const response = await apiClient.post<Branch>('/branches', data);
        return response.data;
    },

    updateBranch: async (id: number, data: Partial<Branch>): Promise<Branch> => {
        const response = await apiClient.put<Branch>(`/branches/${id}`, data);
        return response.data;
    },

    // Employees
    getEmployees: async (branchId: number): Promise<Employee[]> => {
        const response = await apiClient.get<Employee[]>(`/employees?branchId=${branchId}`);
        return response.data;
    },

    createEmployee: async (data: Partial<Employee>): Promise<Employee> => {
        const response = await apiClient.post<Employee>('/employees', data);
        return response.data;
    },

    updateEmployee: async (id: number, data: Partial<Employee>): Promise<Employee> => {
        const response = await apiClient.put<Employee>(`/employees/${id}`, data);
        return response.data;
    },

    // Subscription Plans
    getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
        const response = await apiClient.get<SubscriptionPlan[]>('/subscriptions/plans');
        return response.data;
    },

    getSubscriptionPlan: async (id: number): Promise<SubscriptionPlan> => {
        const response = await apiClient.get<SubscriptionPlan>(`/subscriptions/plans/${id}`);
        return response.data;
    },
};
