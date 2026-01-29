import axios from "axios";
import { secureStorage } from './secureStorage';
import { InputValidator } from '../utils/validation';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Function to refresh token
const refreshToken = async (): Promise<string> => {
  const refresh = secureStorage.getRefreshToken();
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
      refresh: refresh
    });
    
    const { access } = response.data;
    secureStorage.setToken(access);
    return access;
  } catch (error) {
    // If refresh fails, clear tokens and redirect to login
    secureStorage.clearAll();
    window.location.hash = '#login';
    throw error;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  let token = secureStorage.getToken();
  
  // If no token, try to refresh (except for login endpoint)
  if (!token && !config.url?.includes('login/')) {
    try {
      token = await refreshToken();
    } catch (error) {
      // Redirect to login if refresh fails
      return config;
    }
  }
  
  if (token && !config.url?.includes('login/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add security headers
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    // Sanitize response data to prevent XSS
    if (response.data) {
      response.data = InputValidator.sanitizeApiResponse(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        secureStorage.clearAll();
        window.location.hash = '#login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

