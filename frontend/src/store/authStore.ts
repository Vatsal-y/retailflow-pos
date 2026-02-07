import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, getErrorMessage } from '@/api';
import type { User, UserRole, LoginRequest, LoginResponse } from '@/types';
import { STORAGE_KEYS } from '@/lib/utils';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    clearError: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials: LoginRequest) => {
                set({ isLoading: true, error: null });
                try {
                    const response: LoginResponse = await authApi.login(credentials);

                    // Store tokens
                    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

                    // Create user object from response
                    const user: User = {
                        id: response.userId,
                        email: response.email,
                        fullName: response.fullName,
                        role: response.role as UserRole,
                        storeId: response.storeId,
                        branchId: response.branchId,
                        active: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    set({
                        user,
                        token: response.token,
                        refreshToken: response.refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        isLoading: false,
                        error: getErrorMessage(error),
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem(STORAGE_KEYS.TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            setUser: (user: User) => {
                set({ user });
            },

            clearError: () => {
                set({ error: null });
            },

            checkAuth: async () => {
                const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    const user = await authApi.getCurrentUser();
                    set({ user, isAuthenticated: true, token });
                } catch {
                    get().logout();
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
