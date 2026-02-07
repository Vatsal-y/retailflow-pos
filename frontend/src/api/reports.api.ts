import apiClient from './axios-config';

export interface TopProduct {
    productId: number;
    productName: string;
    quantitySold: number;
    revenue: number;
}

export interface BranchPerformance {
    branchId: number;
    branchName: string;
    totalRevenue: number;
    orderCount: number;
}

export interface EmployeePerformance {
    employeeId: number;
    employeeName: string;
    totalRevenue: number;
    totalOrders: number;
    totalShifts: number;
}

export interface CategorySales {
    categoryId: number;
    categoryName: string;
    revenue: number;
}

export interface PaymentMethodStats {
    method: string;
    revenue: number;
    count: number;
}

export interface RevenueTrend {
    date: string;
    revenue: number;
    orders: number;
}

export const reportsApi = {
    getTopProducts: async (storeId: number, limit: number = 10, branchId?: number): Promise<TopProduct[]> => {
        const params: Record<string, number> = { storeId, limit };
        if (branchId) params.branchId = branchId;
        const response = await apiClient.get<TopProduct[]>('/reports/top-products', { params });
        return response.data;
    },

    getBranchPerformance: async (storeId: number): Promise<BranchPerformance[]> => {
        const response = await apiClient.get<BranchPerformance[]>(`/reports/branch-performance?storeId=${storeId}`);
        return response.data;
    },

    getEmployeePerformance: async (storeId: number, branchId?: number): Promise<EmployeePerformance[]> => {
        const params: Record<string, number> = { storeId };
        if (branchId) params.branchId = branchId;
        const response = await apiClient.get<EmployeePerformance[]>('/reports/employee-performance', { params });
        return response.data;
    },

    getSalesByCategory: async (storeId: number, branchId?: number): Promise<CategorySales[]> => {
        const params: Record<string, number> = { storeId };
        if (branchId) params.branchId = branchId;
        const response = await apiClient.get<CategorySales[]>('/reports/sales-by-category', { params });
        return response.data;
    },

    getPaymentMethods: async (storeId: number, branchId?: number): Promise<PaymentMethodStats[]> => {
        const params: Record<string, number> = { storeId };
        if (branchId) params.branchId = branchId;
        const response = await apiClient.get<PaymentMethodStats[]>('/reports/payment-methods', { params });
        return response.data;
    },

    getRevenueTrend: async (storeId: number, days: number = 30, branchId?: number): Promise<RevenueTrend[]> => {
        const params: Record<string, number> = { storeId, days };
        if (branchId) params.branchId = branchId;
        const response = await apiClient.get<RevenueTrend[]>('/reports/revenue-trend', { params });
        return response.data;
    },
};
