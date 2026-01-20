import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BranchPerformance {
  branchId: string;
  branchName: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  growth: number;
}

interface StoreAnalyticsState {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueGrowth: number;
  branchPerformance: BranchPerformance[];
  monthlyRevenue: MonthlyRevenue[];
  topBranch: BranchPerformance | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StoreAnalyticsState = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  revenueGrowth: 0,
  branchPerformance: [],
  monthlyRevenue: [],
  topBranch: null,
  isLoading: false,
  error: null,
};

const storeAnalyticsSlice = createSlice({
  name: 'storeAnalytics',
  initialState,
  reducers: {
    setOverviewStats: (state, action: PayloadAction<{ revenue: number; orders: number; customers: number; growth: number }>) => {
      state.totalRevenue = action.payload.revenue;
      state.totalOrders = action.payload.orders;
      state.totalCustomers = action.payload.customers;
      state.revenueGrowth = action.payload.growth;
    },
    setBranchPerformance: (state, action: PayloadAction<BranchPerformance[]>) => {
      state.branchPerformance = action.payload;
      if (action.payload.length > 0) {
        state.topBranch = action.payload.reduce((max, branch) => 
          branch.revenue > max.revenue ? branch : max
        , action.payload[0]);
      }
    },
    setMonthlyRevenue: (state, action: PayloadAction<MonthlyRevenue[]>) => {
      state.monthlyRevenue = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setOverviewStats, setBranchPerformance, setMonthlyRevenue, setLoading, setError } = storeAnalyticsSlice.actions;
export default storeAnalyticsSlice.reducer;
