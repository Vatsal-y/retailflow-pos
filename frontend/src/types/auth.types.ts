// User roles matching backend enum
export type UserRole = 'SUPER_ADMIN' | 'STORE_ADMIN' | 'BRANCH_MANAGER' | 'CASHIER';

// Login request
export interface LoginRequest {
    email: string;
    password: string;
}

// Register request
export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: UserRole;
    storeId?: number | null;
    branchId?: number | null;
}

// Login response from backend
export interface LoginResponse {
    token: string;
    refreshToken: string;
    email: string;
    fullName: string;
    role: UserRole;
    userId: number;
    storeId: number | null;
    branchId: number | null;
}

// User entity
export interface User {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: UserRole;
    storeId: number | null;
    branchId: number | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Auth state for store
export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
