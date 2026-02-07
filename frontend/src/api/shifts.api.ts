import apiClient from './axios-config';
import type { ShiftReport } from '@/types';

export const shiftsApi = {
    // Start shift
    startShift: async (branchId: number, cashierId: number): Promise<ShiftReport> => {
        const response = await apiClient.post<ShiftReport>(
            `/shift-reports/start?branchId=${branchId}&cashierId=${cashierId}`
        );
        return response.data;
    },

    // End shift
    endShift: async (cashierId: number): Promise<ShiftReport> => {
        const response = await apiClient.post<ShiftReport>(`/shift-reports/end?cashierId=${cashierId}`);
        return response.data;
    },

    // Get active shift for cashier
    getActiveShift: async (cashierId: number): Promise<ShiftReport | null> => {
        try {
            const response = await apiClient.get<ShiftReport>(`/shift-reports/active?cashierId=${cashierId}`);
            return response.data;
        } catch {
            return null; // No active shift
        }
    },

    // Get shift reports by branch
    getShiftReports: async (branchId: number): Promise<ShiftReport[]> => {
        const response = await apiClient.get<ShiftReport[]>(`/shift-reports?branchId=${branchId}`);
        return response.data;
    },

    // Get shift reports by cashier
    getShiftReportsByCashier: async (cashierId: number): Promise<ShiftReport[]> => {
        const response = await apiClient.get<ShiftReport[]>(`/shift-reports/cashier?cashierId=${cashierId}`);
        return response.data;
    },
};
