import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city?: string;
  phone: string;
  storeId: number;
  active: boolean;
  createdAt: string;
}

interface BranchState {
  branches: Branch[];
  selectedBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  selectedBranch: null,
  isLoading: false,
  error: null,
};

// Fetch branches
export const fetchBranches = createAsyncThunk(
  'branch/fetchBranches',
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Branch[]>(`/branches?storeId=${storeId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch branches');
      }
      return rejectWithValue(error.message || 'Failed to fetch branches');
    }
  }
);

// Create branch
export const createBranch = createAsyncThunk(
  'branch/createBranch',
  async (branchData: Omit<Branch, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Branch>('/branches', branchData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to create branch');
      }
      return rejectWithValue(error.message || 'Failed to create branch');
    }
  }
);

// Update branch
export const updateBranch = createAsyncThunk(
  'branch/updateBranch',
  async (params: { id: string; data: Partial<Branch> }, { rejectWithValue }) => {
    try {
      const response = await api.put<Branch>(`/branches/${params.id}`, params.data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update branch');
      }
      return rejectWithValue(error.message || 'Failed to update branch');
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
    setSelectedBranch: (state, action: PayloadAction<Branch | null>) => {
      state.selectedBranch = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Branches
      .addCase(fetchBranches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Branch
      .addCase(createBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches.unshift(action.payload);
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Branch
      .addCase(updateBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.branches.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBranches, setSelectedBranch, clearError } = branchSlice.actions;
export default branchSlice.reducer;
