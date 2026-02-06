import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8082/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Clear local storage and redirect to login if unauthorized
            // We'll dispatch a logout action from the component/slice instead of here to avoid circular dependencies
            console.error('Unauthorized access. Please login again.');
        }
        return Promise.reject(error);
    }
);

export default api;
