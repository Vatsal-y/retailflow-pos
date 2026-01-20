import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  branchName: string;
  stock: number;
  reorderPoint: number;
  lastRestocked?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

interface InventoryState {
  inventory: InventoryItem[];
  movements: StockMovement[];
  isLoading: boolean;
  error: string | null;
  lowStockCount: number;
}

const initialState: InventoryState = {
  inventory: [],
  movements: [],
  isLoading: false,
  error: null,
  lowStockCount: 0,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<InventoryItem[]>) => {
      state.inventory = action.payload;
      state.lowStockCount = action.payload.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length;
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.inventory.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.inventory[index] = action.payload;
      }
    },
    setMovements: (state, action: PayloadAction<StockMovement[]>) => {
      state.movements = action.payload;
    },
    addMovement: (state, action: PayloadAction<StockMovement>) => {
      state.movements.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setInventory, updateInventoryItem, setMovements, addMovement, setLoading, setError } = inventorySlice.actions;
export default inventorySlice.reducer;
