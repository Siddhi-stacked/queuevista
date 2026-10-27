import axios from 'axios';

// Base Axios instance configured for REST calls
// In Phase 2, this baseURL will point to the Spring Boot REST backend (e.g., http://localhost:8080/api)
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token when available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('queuevista_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors uniformly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Simulated handling for unauthorized or network issues
    if (error.response?.status === 401) {
      // Clear token and redirect if needed
      localStorage.removeItem('queuevista_auth_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
