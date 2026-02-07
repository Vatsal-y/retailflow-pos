import apiClient from './axios-config';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types';

export const authApi = {
    // Login user
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    // Register user
    register: async (data: RegisterRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/register', data);
        return response.data;
    },

    // Get current user
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    // Refresh token
    refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data;
    },
};
