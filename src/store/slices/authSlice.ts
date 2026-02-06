import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export type UserRole = 'CASHIER' | 'BRANCH_MANAGER' | 'STORE_ADMIN' | 'SUPER_ADMIN';

interface AuthUser {
  id: string; // Changed from number to string to match frontend types if needed, or keep consistent
  email: string;
  name: string;
  role: UserRole;
  storeId?: number;
  branchId?: number;
  avatar?: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getUserFromStorage = (): AuthUser | null => {
  try {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr || userStr === 'undefined') return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse auth_user from local storage', error);
    localStorage.removeItem('auth_user');
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        localStorage.setItem('auth_token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
