import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ShiftReport {
  id: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  totalSales: number;
  totalOrders: number;
  cashPayments: number;
  cardPayments: number;
  upiPayments: number;
  walletPayments: number;
  discrepancy?: number;
  status: 'active' | 'closed';
  notes?: string;
}

interface ShiftReportState {
  shifts: ShiftReport[];
  currentShift: ShiftReport | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShiftReportState = {
  shifts: [],
  currentShift: null,
  isLoading: false,
  error: null,
};

const shiftReportSlice = createSlice({
  name: 'shiftReport',
  initialState,
  reducers: {
    setShifts: (state, action: PayloadAction<ShiftReport[]>) => {
      state.shifts = action.payload;
    },
    setCurrentShift: (state, action: PayloadAction<ShiftReport | null>) => {
      state.currentShift = action.payload;
    },
    startShift: (state, action: PayloadAction<ShiftReport>) => {
      state.currentShift = action.payload;
      state.shifts.unshift(action.payload);
    },
    endShift: (state, action: PayloadAction<ShiftReport>) => {
      state.currentShift = null;
      const index = state.shifts.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.shifts[index] = action.payload;
      }
    },
    updateShift: (state, action: PayloadAction<Partial<ShiftReport>>) => {
      if (state.currentShift) {
        state.currentShift = { ...state.currentShift, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setShifts, setCurrentShift, startShift, endShift, updateShift, setLoading, setError } = shiftReportSlice.actions;
export default shiftReportSlice.reducer;
