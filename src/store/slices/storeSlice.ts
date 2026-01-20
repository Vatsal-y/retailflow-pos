import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  currency: string;
  taxRate: number;
  subscriptionPlan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'pending';
  branchCount: number;
  employeeCount: number;
  createdAt: string;
}

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  selectedStore: Store | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  currentStore: null,
  selectedStore: null,
  isLoading: false,
  error: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
    addStore: (state, action: PayloadAction<Store>) => {
      state.stores.push(action.payload);
    },
    updateStore: (state, action: PayloadAction<Store>) => {
      const index = state.stores.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.stores[index] = action.payload;
      }
    },
    deleteStore: (state, action: PayloadAction<string>) => {
      state.stores = state.stores.filter(s => s.id !== action.payload);
    },
    setCurrentStore: (state, action: PayloadAction<Store | null>) => {
      state.currentStore = action.payload;
    },
    setSelectedStore: (state, action: PayloadAction<Store | null>) => {
      state.selectedStore = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setStores, addStore, updateStore, deleteStore, setCurrentStore, setSelectedStore, setLoading, setError } = storeSlice.actions;
export default storeSlice.reducer;
