import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Branch {
  id: string;
  name: string;
  code: string;
  storeId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  managerId?: string;
  managerName?: string;
  status: 'active' | 'inactive';
  openingTime: string;
  closingTime: string;
  createdAt: string;
}

interface BranchState {
  branches: Branch[];
  currentBranch: Branch | null;
  selectedBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  currentBranch: null,
  selectedBranch: null,
  isLoading: false,
  error: null,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
    addBranch: (state, action: PayloadAction<Branch>) => {
      state.branches.push(action.payload);
    },
    updateBranch: (state, action: PayloadAction<Branch>) => {
      const index = state.branches.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.branches[index] = action.payload;
      }
    },
    deleteBranch: (state, action: PayloadAction<string>) => {
      state.branches = state.branches.filter(b => b.id !== action.payload);
    },
    setCurrentBranch: (state, action: PayloadAction<Branch | null>) => {
      state.currentBranch = action.payload;
    },
    setSelectedBranch: (state, action: PayloadAction<Branch | null>) => {
      state.selectedBranch = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setBranches, addBranch, updateBranch, deleteBranch, setCurrentBranch, setSelectedBranch, setLoading, setError } = branchSlice.actions;
export default branchSlice.reducer;
