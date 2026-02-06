import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface Inventory {
  id: string;
  productId: number;
  branchId: number;
  quantity: number;
  reorderLevel: number;
  lastRestocked?: string;
  // Product details
  productName?: string;
  productSku?: string;
  productPrice?: number;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface InventoryState {
  inventory: Inventory[];
  isLoading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  inventory: [],
  isLoading: false,
  error: null,
};

// Fetch inventory
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Inventory[]>(`/inventory?branchId=${branchId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch inventory');
      }
      return rejectWithValue(error.message || 'Failed to fetch inventory');
    }
  }
);

// Update inventory
export const updateInventory = createAsyncThunk(
  'inventory/updateInventory',
  async (params: { id: string; data: { quantity: number; reorderLevel?: number } }, { rejectWithValue }) => {
    try {
      const response = await api.put<Inventory>(`/inventory/${params.id}`, params.data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update inventory');
      }
      return rejectWithValue(error.message || 'Failed to update inventory');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<Inventory[]>) => {
      state.inventory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Inventory
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Inventory
      .addCase(updateInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.inventory.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.inventory[index] = action.payload;
        }
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setInventory, clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
