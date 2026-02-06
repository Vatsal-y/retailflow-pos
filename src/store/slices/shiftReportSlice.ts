import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface ShiftReport {
  id: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  totalSales?: number;
  totalOrders?: number;
  cashSales?: number;
  cardSales?: number;
  upiSales?: number;
  walletSales?: number;
  status: 'active' | 'closed';
}

interface ShiftReportState {
  shiftReports: ShiftReport[];
  currentShift: ShiftReport | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShiftReportState = {
  shiftReports: [],
  currentShift: null,
  isLoading: false,
  error: null,
};

// Start a new shift
export const startShift = createAsyncThunk(
  'shiftReport/startShift',
  async (params: { branchId: number; cashierId: number; openingCash?: number }, { rejectWithValue }) => {
    try {
      const response = await api.post<ShiftReport>(
        `/shift-reports/start?branchId=${params.branchId}&cashierId=${params.cashierId}`,
        { openingCash: params.openingCash || 0 }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to start shift');
      }
      return rejectWithValue(error.message || 'Failed to start shift');
    }
  }
);

// End the current shift
export const endShift = createAsyncThunk(
  'shiftReport/endShift',
  async (params: { cashierId: number; closingCash?: number }, { rejectWithValue }) => {
    try {
      const response = await api.post<ShiftReport>(
        `/shift-reports/end?cashierId=${params.cashierId}`,
        { closingCash: params.closingCash || 0 }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to end shift');
      }
      return rejectWithValue(error.message || 'Failed to end shift');
    }
  }
);

// Fetch shift reports for a branch
export const fetchShiftReports = createAsyncThunk(
  'shiftReport/fetchShiftReports',
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<ShiftReport[]>(`/shift-reports?branchId=${branchId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch shift reports');
      }
      return rejectWithValue(error.message || 'Failed to fetch shift reports');
    }
  }
);

const shiftReportSlice = createSlice({
  name: 'shiftReport',
  initialState,
  reducers: {
    setShiftReports: (state, action: PayloadAction<ShiftReport[]>) => {
      state.shiftReports = action.payload;
    },
    setActiveShift: (state, action: PayloadAction<ShiftReport | null>) => {
      state.currentShift = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Shift
      .addCase(startShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShift = action.payload;
        state.shiftReports.unshift(action.payload);
      })
      .addCase(startShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // End Shift
      .addCase(endShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endShift.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShift = null;
        const index = state.shiftReports.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.shiftReports[index] = action.payload;
        }
      })
      .addCase(endShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Shift Reports
      .addCase(fetchShiftReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShiftReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shiftReports = action.payload;
        // Set active shift if there's one with status 'active'
        const active = action.payload.find(s => s.status === 'active');
        if (active) {
          state.currentShift = active;
        }
      })
      .addCase(fetchShiftReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShiftReports, setActiveShift, setLoading, setError, clearError } = shiftReportSlice.actions;
export default shiftReportSlice.reducer;
