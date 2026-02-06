import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface PaymentBreakdown {
  method: string;
  amount: number;
  percentage: number;
}

export interface LowStockItem {
  productId: number;
  productName: string;
  quantity: number;
  reorderLevel: number;
}

interface BranchAnalyticsState {
  todaySales: number;
  todayOrders: number;
  todayRevenue: number;
  avgOrderValue: number;
  dailySales: DailySales[];
  topProducts: TopProduct[];
  paymentBreakdown: PaymentBreakdown[];
  lowStockItems: LowStockItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BranchAnalyticsState = {
  todaySales: 0,
  todayOrders: 0,
  todayRevenue: 0,
  avgOrderValue: 0,
  dailySales: [],
  topProducts: [],
  paymentBreakdown: [],
  lowStockItems: [],
  isLoading: false,
  error: null,
};

// Fetch branch dashboard data
export const fetchBranchDashboard = createAsyncThunk(
  'branchAnalytics/fetchBranchDashboard',
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analytics/branch/${branchId}/dashboard`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch dashboard');
      }
      return rejectWithValue(error.message || 'Failed to fetch dashboard');
    }
  }
);

// Fetch sales trend
export const fetchSalesTrend = createAsyncThunk(
  'branchAnalytics/fetchSalesTrend',
  async (params: { branchId: number; days?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analytics/branch/${params.branchId}/sales-trend?days=${params.days || 7}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch sales trend');
      }
      return rejectWithValue(error.message || 'Failed to fetch sales trend');
    }
  }
);

// Fetch payment breakdown
export const fetchPaymentBreakdown = createAsyncThunk(
  'branchAnalytics/fetchPaymentBreakdown',
  async (params: { branchId: number; startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/analytics/branch/${params.branchId}/payment-breakdown?startDate=${params.startDate}&endDate=${params.endDate}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch payment breakdown');
      }
      return rejectWithValue(error.message || 'Failed to fetch payment breakdown');
    }
  }
);

// Fetch low stock items
export const fetchLowStock = createAsyncThunk(
  'branchAnalytics/fetchLowStock',
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<LowStockItem[]>(`/analytics/branch/${branchId}/low-stock`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch low stock items');
      }
      return rejectWithValue(error.message || 'Failed to fetch low stock items');
    }
  }
);

const branchAnalyticsSlice = createSlice({
  name: 'branchAnalytics',
  initialState,
  reducers: {
    setTodayStats: (state, action: PayloadAction<{ sales: number; orders: number; revenue: number; aov: number }>) => {
      state.todaySales = action.payload.sales;
      state.todayOrders = action.payload.orders;
      state.todayRevenue = action.payload.revenue;
      state.avgOrderValue = action.payload.aov;
    },
    setDailySales: (state, action: PayloadAction<DailySales[]>) => {
      state.dailySales = action.payload;
    },
    setTopProducts: (state, action: PayloadAction<TopProduct[]>) => {
      state.topProducts = action.payload;
    },
    setPaymentBreakdown: (state, action: PayloadAction<PaymentBreakdown[]>) => {
      state.paymentBreakdown = action.payload;
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
      // Fetch Dashboard
      .addCase(fetchBranchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBranchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todaySales = action.payload.todaySales || 0;
        state.todayOrders = action.payload.todayOrders || 0;
        state.todayRevenue = action.payload.todayRevenue || action.payload.todaySales || 0;
        state.avgOrderValue = action.payload.avgOrderValue || 0;
      })
      .addCase(fetchBranchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Sales Trend
      .addCase(fetchSalesTrend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSalesTrend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailySales = action.payload;
      })
      .addCase(fetchSalesTrend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Payment Breakdown
      .addCase(fetchPaymentBreakdown.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPaymentBreakdown.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentBreakdown = action.payload;
      })
      .addCase(fetchPaymentBreakdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Low Stock
      .addCase(fetchLowStock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lowStockItems = action.payload;
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTodayStats, setDailySales, setTopProducts, setPaymentBreakdown, setLoading, setError, clearError } = branchAnalyticsSlice.actions;
export default branchAnalyticsSlice.reducer;
