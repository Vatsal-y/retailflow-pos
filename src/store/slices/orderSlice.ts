import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  cashierId: string;
  branchId: string;
  createdAt: string;
  paidAt?: string;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: OrderStatus;
    dateFrom?: string;
    dateTo?: string;
    paymentMethod?: PaymentMethod;
  };
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Create a new order (checkout)
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: {
    branchId: number;
    customerId?: number;
    cashierId: number;
    items: Array<{
      productId: number;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    subtotal: number;
    discountAmount?: number;
    discountPercentage?: number;
    totalAmount: number;
    paymentMethod: string;
    notes?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post<Order>('/orders', orderData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to create order');
      }
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

// Fetch orders for a branch
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Order[]>(`/orders?branchId=${branchId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch orders');
      }
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

// Fetch order history with date range
export const fetchOrderHistory = createAsyncThunk(
  'order/fetchOrderHistory',
  async (params: { branchId: number; startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      let url = `/orders/history?branchId=${params.branchId}`;
      if (params.startDate) url += `&startDate=${params.startDate}`;
      if (params.endDate) url += `&endDate=${params.endDate}`;

      const response = await api.get<Order[]>(url);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch order history');
      }
      return rejectWithValue(error.message || 'Failed to fetch order history');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    setFilters: (state, action: PayloadAction<OrderState['filters']>) => {
      state.filters = action.payload;
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
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Order History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOrders, addOrder, updateOrder, setSelectedOrder, setFilters, setLoading, setError, clearError } = orderSlice.actions;
export default orderSlice.reducer;

