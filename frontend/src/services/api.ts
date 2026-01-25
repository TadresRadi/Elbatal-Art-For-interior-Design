import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES, LOADING_STATES } from '../constants';
import type { ApiResponse } from '../types';

/**
 * Enhanced API service with proper error handling and token management
 */
class ApiService {
  public api: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: API_CONFIG.TIMEOUT,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = this.getAccessToken();
        
        if (token && !this.isAuthEndpoint(config.url)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (this.isUnauthorizedError(error) && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshAccessToken();
            this.setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Check if endpoint requires authentication
   */
  private isAuthEndpoint(url?: string): boolean {
    const authEndpoints = ['login/', 'token/refresh/', 'token/'];
    return authEndpoints.some(endpoint => url?.includes(endpoint));
  }

  /**
   * Check if error is unauthorized (401)
   */
  private isUnauthorizedError(error: any): boolean {
    return error.response?.status === 401;
  }

  /**
   * Handle authentication failure
   */
  private handleAuthFailure(): void {
    this.clearAuthData();
    window.location.hash = '#login';
  }

  /**
   * Handle API errors and return user-friendly messages
   */
  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          return new Error(data.error || ERROR_MESSAGES.VALIDATION_ERROR);
        case 401:
          return new Error(ERROR_MESSAGES.UNAUTHORIZED);
        case 403:
          return new Error(ERROR_MESSAGES.FORBIDDEN);
        case 404:
          return new Error(ERROR_MESSAGES.NOT_FOUND);
        case 500:
        case 502:
        case 503:
        case 504:
          return new Error(ERROR_MESSAGES.SERVER_ERROR);
        default:
          return new Error(data.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    } else if (error.request) {
      return new Error(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      return new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

  /**
   * Get access token from storage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Set access token to storage
   */
  private setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise<string>((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      this.setAccessToken(access);
      
      // Notify all subscribers
      this.refreshSubscribers.forEach((resolve) => resolve(access));
      this.refreshSubscribers = [];
      
      return access;
    } catch (error) {
      this.refreshSubscribers = [];
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get<T>(url, config);
    return { data: response.data };
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post<T>(url, data, config);
    return { data: response.data };
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put<T>(url, data, config);
    return { data: response.data };
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.patch<T>(url, data, config);
    return { data: response.data };
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete<T>(url, config);
    return { data: response.data };
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return { data: response.data };
  }

  /**
   * Download file
   */
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Health check for API connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('health/');
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export the axios instance for backward compatibility
export default apiService.api;
