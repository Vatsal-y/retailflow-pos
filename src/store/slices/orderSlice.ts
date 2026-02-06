import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

/* ---------------- TYPES ---------------- */

export type OrderStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "UPI"
  | "WALLET";

/* ✅ Backend OrderItem Response */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/* ✅ Backend Order Response */
export interface Order {
  id: number;
  orderNumber: string;

  branchId: number;
  cashierId: number;
  customerId?: number;

  items: OrderItem[];

  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;

  paymentMethod: PaymentMethod;
  status: OrderStatus;

  createdAt: string;
}

/* ---------------- STATE ---------------- */

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
};

/* ---------------- THUNKS ---------------- */

/* ✅ Create Order (Checkout) */
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (
    orderData: {
      branchId: number;
      cashierId: number;
      customerId?: number;
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
      paymentMethod: PaymentMethod;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<Order>("/orders", orderData);

      console.log("✅ Order Created Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Order Create Failed:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

/* ✅ Fetch Orders by Branch */
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Order[]>(
        `/orders/branch/${branchId}`
      );

      console.log("✅ Orders Loaded:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Fetch Orders Failed:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

/* ---------------- SLICE ---------------- */

const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------------- CREATE ORDER ---------------- */

      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;

        // ✅ Instantly show new order in Orders tab
        state.orders.unshift(action.payload);
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------------- FETCH ORDERS ---------------- */

      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;

        // ✅ Replace orders with latest DB data
        state.orders = action.payload;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

/* ---------------- EXPORTS ---------------- */

export const { setSelectedOrder, clearError } = orderSlice.actions;

export default orderSlice.reducer;
