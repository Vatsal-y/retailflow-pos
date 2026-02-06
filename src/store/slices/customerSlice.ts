import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  storeId: number;
  loyaltyPoints?: number;
  totalPurchases?: number; // Maps to Backend BigDecimal
  visitCount?: number;     // Maps to Backend visitCount
  active?: boolean;
  createdAt: string;
  // properties not in backend entity but used in UI (need to handled optionally or removed)
  lastOrderAt?: string;
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  searchQuery: '',
};

// Fetch customers
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Customer[]>(`/customers?storeId=${storeId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch customers');
      }
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

// Create customer
export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (customerData: Omit<Customer, 'id' | 'createdAt' | 'loyaltyPoints' | 'totalPurchases'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Customer>('/customers', customerData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to create customer');
      }
      return rejectWithValue(error.message || 'Failed to create customer');
    }
  }
);

// Update customer
export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async (params: { id: string; data: Partial<Customer> }, { rejectWithValue }) => {
    try {
      const response = await api.put<Customer>(`/customers/${params.id}`, params.data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update customer');
      }
      return rejectWithValue(error.message || 'Failed to update customer');
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCustomers, setSelectedCustomer, setSearchQuery, clearError } = customerSlice.actions;
export default customerSlice.reducer;
