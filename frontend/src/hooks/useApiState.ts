import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { LOADING_STATES } from '../constants';
import type { ApiResponse, LoadingState } from '../types';

/**
 * Enhanced API state hook with proper error handling and loading states
 */
export function useApiState<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LOADING_STATES.IDLE);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoadingState(LOADING_STATES.LOADING);
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      setData(response.data);
      setLoadingState(LOADING_STATES.SUCCESS);
      setLastUpdated(new Date());
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setLoadingState(LOADING_STATES.ERROR);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoadingState(LOADING_STATES.IDLE);
    setLastUpdated(null);
  }, []);

  return {
    data,
    loading,
    error,
    loadingState,
    lastUpdated,
    refetch: execute,
    reset,
  };
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T>(
  apiCall: (params: any) => Promise<ApiResponse<any>>,
  initialParams: any = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(params);
      
      setData(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    if (pagination.next) {
      const urlParams = new URLSearchParams(pagination.next.split('?')[1]);
      const newParams = Object.fromEntries(urlParams.entries());
      setParams((prev: any) => ({ ...prev, ...newParams }));
    }
  }, [pagination.next]);

  const prevPage = useCallback(() => {
    if (pagination.previous) {
      const urlParams = new URLSearchParams(pagination.previous.split('?')[1]);
      const newParams = Object.fromEntries(urlParams.entries());
      setParams((prev: any) => ({ ...prev, ...newParams }));
    }
  }, [pagination.previous]);

  return {
    data,
    loading,
    error,
    pagination,
    params,
    setParams,
    refetch: fetchData,
    nextPage,
    prevPage,
  };
}

/**
 * Hook for client data
 */
export function useClient(clientId: number) {
  return useApiState(
    () => apiService.get(`admin/clients/${clientId}/`),
    [clientId]
  );
}

/**
 * Hook for client expenses
 */
export function useClientExpenses(clientId: number) {
  return useApiState(
    () => apiService.get(`admin/expenses/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Hook for client payments
 */
export function useClientPayments(clientId: number) {
  return useApiState(
    () => apiService.get(`admin/payments/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Hook for expense versions
 */
export function useExpenseVersions(clientId: number) {
  return useApiState(
    () => apiService.get(`admin/expense-versions/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Hook for payment versions
 */
export function usePaymentVersions(clientId: number) {
  return useApiState(
    () => apiService.get(`admin/payment-versions/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Hook for client dashboard data
 */
export function useClientDashboard() {
  return useApiState(
    () => apiService.get('client/dashboard/'),
    []
  );
}

/**
 * Hook for admin dashboard data
 */
export function useAdminDashboard() {
  return useApiState(
    () => apiService.get('admin/dashboard/'),
    []
  );
}

/**
 * Hook for creating expenses
 */
export function useCreateExpense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExpense = useCallback(async (clientId: number, expenseData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      
      // Append all non-file fields
      Object.entries(expenseData).forEach(([key, value]) => {
        if (key !== 'bill' && value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      
      // Append file if present
      if (expenseData.bill) {
        formData.append('bill', expenseData.bill);
      }
      
      const response = await apiService.post(`admin/expenses/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create expense';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createExpense,
    loading,
    error,
    resetError: () => setError(null),
  };
}

/**
 * Hook for creating payments
 */
export function useCreatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (clientId: number, paymentData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post(`admin/cash-receipts/`, {
        client: clientId,
        ...paymentData,
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createPayment,
    loading,
    error,
    resetError: () => setError(null),
  };
}

/**
 * Hook for completing discussions
 */
export function useCompleteDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeExpenseDiscussion = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('admin/expense-versions/create-version/', {
        client_id: clientId,
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to complete expense discussion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completePaymentDiscussion = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post('admin/payment-versions/create-version/', {
        client_id: clientId,
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to complete payment discussion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    completeExpenseDiscussion,
    completePaymentDiscussion,
    loading,
    error,
    resetError: () => setError(null),
  };
}
