import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface Employee {
  id: string;
  userId: number;
  branchId: number;
  position: string;
  salary: number;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  // User details
  fullName?: string;
  email?: string;
  phone?: string;
}

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
};

// Fetch employees
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Employee[]>(`/employees?branchId=${branchId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch employees');
      }
      return rejectWithValue(error.message || 'Failed to fetch employees');
    }
  }
);

// Create employee
export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (employeeData: Omit<Employee, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post<Employee>('/employees', employeeData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to create employee');
      }
      return rejectWithValue(error.message || 'Failed to create employee');
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async (params: { id: string; data: Partial<Employee> }, { rejectWithValue }) => {
    try {
      const response = await api.put<Employee>(`/employees/${params.id}`, params.data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update employee');
      }
      return rejectWithValue(error.message || 'Failed to update employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees.unshift(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.employees.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setEmployees, setSelectedEmployee, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
