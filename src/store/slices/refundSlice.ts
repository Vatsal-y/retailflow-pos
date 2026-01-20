import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Refund {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  processedAt?: string;
}

interface RefundState {
  refunds: Refund[];
  selectedRefund: Refund | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RefundState = {
  refunds: [],
  selectedRefund: null,
  isLoading: false,
  error: null,
};

const refundSlice = createSlice({
  name: 'refund',
  initialState,
  reducers: {
    setRefunds: (state, action: PayloadAction<Refund[]>) => {
      state.refunds = action.payload;
    },
    addRefund: (state, action: PayloadAction<Refund>) => {
      state.refunds.unshift(action.payload);
    },
    updateRefund: (state, action: PayloadAction<Refund>) => {
      const index = state.refunds.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.refunds[index] = action.payload;
      }
    },
    setSelectedRefund: (state, action: PayloadAction<Refund | null>) => {
      state.selectedRefund = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRefunds, addRefund, updateRefund, setSelectedRefund, setLoading, setError } = refundSlice.actions;
export default refundSlice.reducer;
