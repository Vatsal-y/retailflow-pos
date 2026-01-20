import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface BranchAnalyticsState {
  todaySales: number;
  todayOrders: number;
  todayRevenue: number;
  avgOrderValue: number;
  dailySales: DailySales[];
  topProducts: TopProduct[];
  paymentBreakdown: PaymentBreakdown[];
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
  isLoading: false,
  error: null,
};

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
  },
});

export const { setTodayStats, setDailySales, setTopProducts, setPaymentBreakdown, setLoading, setError } = branchAnalyticsSlice.actions;
export default branchAnalyticsSlice.reducer;
