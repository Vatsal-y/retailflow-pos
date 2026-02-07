import apiClient from './axios-config';
import type { BranchDashboard, StoreDashboard, SalesTrendData, PaymentBreakdown, LowStockItem } from '@/types';

export const analyticsApi = {
    // Branch dashboard
    getBranchDashboard: async (branchId: number): Promise<BranchDashboard> => {
        const response = await apiClient.get<BranchDashboard>(`/analytics/branch/${branchId}/dashboard`);
        return response.data;
    },

    // Sales trend
    getSalesTrend: async (branchId: number, days: number = 7): Promise<SalesTrendData[]> => {
        const response = await apiClient.get<SalesTrendData[]>(`/analytics/branch/${branchId}/sales-trend?days=${days}`);
        return response.data;
    },

    // Payment breakdown
    getPaymentBreakdown: async (
        branchId: number,
        startDate: string,
        endDate: string
    ): Promise<PaymentBreakdown[]> => {
        const response = await apiClient.get<PaymentBreakdown[]>(
            `/analytics/branch/${branchId}/payment-breakdown?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    },

    // Low stock items
    getLowStockItems: async (branchId: number): Promise<LowStockItem[]> => {
        const response = await apiClient.get<LowStockItem[]>(`/analytics/branch/${branchId}/low-stock`);
        return response.data;
    },

    // Store dashboard (for store admins)
    getStoreDashboard: async (storeId: number): Promise<StoreDashboard> => {
        const response = await apiClient.get<StoreDashboard>(`/analytics/store/${storeId}/dashboard`);
        return response.data;
    },

    // Store sales trend (for store admins)
    getStoreSalesTrend: async (storeId: number, days: number = 7): Promise<SalesTrendData[]> => {
        const response = await apiClient.get<SalesTrendData[]>(`/analytics/store/${storeId}/sales-trend?days=${days}`);
        return response.data;
    },

    // Store low stock items (for store admins)
    getStoreLowStockItems: async (storeId: number): Promise<LowStockItem[]> => {
        const response = await apiClient.get<LowStockItem[]>(`/analytics/store/${storeId}/low-stock`);
        return response.data;
    },
};
