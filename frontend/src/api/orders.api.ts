import apiClient from './axios-config';
import type { Order, OrderRequest, PaymentMethod, OrderStatus, Refund } from '@/types';

export const ordersApi = {
    // Create order
    createOrder: async (data: OrderRequest): Promise<Order> => {
        const response = await apiClient.post<Order>('/orders', data);
        return response.data;
    },

    // Get orders by branch
    getOrders: async (branchId: number): Promise<Order[]> => {
        const response = await apiClient.get<Order[]>(`/orders?branchId=${branchId}`);
        return response.data;
    },

    // Get orders with filters
    getOrdersFiltered: async (params: {
        branchId?: number;
        customerId?: number;
        startDate?: string;
        endDate?: string;
        status?: OrderStatus;
        paymentMethod?: PaymentMethod;
    }): Promise<Order[]> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, String(value));
            }
        });
        const response = await apiClient.get<Order[]>(`/orders?${queryParams.toString()}`);
        return response.data;
    },

    // Get order by ID
    getOrder: async (id: number): Promise<Order> => {
        const response = await apiClient.get<Order>(`/orders/${id}`);
        return response.data;
    },

    // Get order history by date range
    getOrderHistory: async (branchId: number, startDate: string, endDate: string): Promise<Order[]> => {
        const response = await apiClient.get<Order[]>(
            `/orders/history?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    },

    // Get orders by customer
    getCustomerOrders: async (customerId: number): Promise<Order[]> => {
        const response = await apiClient.get<Order[]>(`/orders?customerId=${customerId}`);
        return response.data;
    },

    // Refunds
    createRefund: async (data: { orderId: number; amount: number; reason: string; processedBy: number }): Promise<Refund> => {
        const response = await apiClient.post<Refund>('/refunds', { ...data, status: 'PENDING' });
        return response.data;
    },

    getRefunds: async (): Promise<Refund[]> => {
        const response = await apiClient.get<Refund[]>('/refunds');
        return response.data;
    },

    approveRefund: async (id: number, approvedBy: number): Promise<Refund> => {
        const response = await apiClient.put<Refund>(`/refunds/${id}/approve?approvedBy=${approvedBy}`);
        return response.data;
    },
};
