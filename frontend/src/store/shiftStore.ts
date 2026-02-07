import { create } from 'zustand';
import { shiftsApi, getErrorMessage } from '@/api';
import type { ShiftReport } from '@/types';

interface ShiftState {
    activeShift: ShiftReport | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    checkActiveShift: (cashierId: number) => Promise<void>;
    startShift: (branchId: number, cashierId: number) => Promise<ShiftReport>;
    endShift: (cashierId: number) => Promise<ShiftReport>;
    clearError: () => void;
}

export const useShiftStore = create<ShiftState>((set) => ({
    activeShift: null,
    isLoading: false,
    error: null,

    checkActiveShift: async (cashierId: number) => {
        set({ isLoading: true, error: null });
        try {
            const shift = await shiftsApi.getActiveShift(cashierId);
            set({ activeShift: shift, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: getErrorMessage(error),
                activeShift: null,
            });
        }
    },

    startShift: async (branchId: number, cashierId: number) => {
        set({ isLoading: true, error: null });
        try {
            const shift = await shiftsApi.startShift(branchId, cashierId);
            set({ activeShift: shift, isLoading: false });
            return shift;
        } catch (error) {
            set({ isLoading: false, error: getErrorMessage(error) });
            throw error;
        }
    },

    endShift: async (cashierId: number) => {
        set({ isLoading: true, error: null });
        try {
            const shift = await shiftsApi.endShift(cashierId);
            set({ activeShift: null, isLoading: false });
            return shift;
        } catch (error) {
            set({ isLoading: false, error: getErrorMessage(error) });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
