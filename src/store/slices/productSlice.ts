import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface Product {
  id: string; // Keep string ID if frontend expects it, or convert if backend returns number
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId: string; // Backend might return object, check DTO
  categoryName: string;
  price: number;
  costPrice?: number;
  image?: string;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  storeId?: number; // Backend uses numbers
  branchId?: number;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(`/products?storeId=${storeId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch products');
      }
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setSearchQuery,
  setSelectedCategory,
  setLoading,
  setError
} = productSlice.actions;
export default productSlice.reducer;
