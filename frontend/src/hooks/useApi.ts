import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { ApiState, ApiResponse, LoadingState, ExpenseForm, PaymentForm } from '../types';

/**
 * Custom hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => void; loading: LoadingState } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
    loadingState: 'idle',
  });

  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  const fetchData = useCallback(async () => {
    try {
      setLoadingState('loading');
      setState((prev: any) => ({ ...prev, loading: true, error: null, loadingState: 'loading' }));
      
      const response = await apiCall();
      
      setState({
        data: response.data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
        loadingState: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        lastUpdated: null,
        loadingState: 'error',
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
    loading: loadingState,
  };
}

/**
 * Custom hook for paginated API calls
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred';
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
 * Custom hook for client data
 */
export function useClient(clientId: number) {
  return useApi(
    () => api.get(`admin/clients/${clientId}/`),
    [clientId]
  );
}

/**
 * Custom hook for client expenses
 */
export function useClientExpenses(clientId: number) {
  return useApi(
    () => api.get(`admin/expenses/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Custom hook for client payments
 */
export function useClientPayments(clientId: number) {
  return useApi(
    () => api.get(`admin/payments/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Custom hook for expense versions
 */
export function useExpenseVersions(clientId: number) {
  return useApi(
    () => api.get(`admin/expense-versions/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Custom hook for payment versions
 */
export function usePaymentVersions(clientId: number) {
  return useApi(
    () => api.get(`admin/payment-versions/?client_id=${clientId}`),
    [clientId]
  );
}

/**
 * Custom hook for client dashboard data
 */
export function useClientDashboard() {
  return useApi(
    () => api.get('client/dashboard/'),
    []
  );
}

/**
 * Custom hook for admin dashboard data
 */
export function useAdminDashboard() {
  return useApi(
    () => api.get('admin/dashboard/'),
    []
  );
}

/**
 * Custom hook for creating expenses
 */
export function useCreateExpense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExpense = useCallback(async (clientId: number, expenseData: ExpenseForm) => {
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
      
      const response = await api.post(`admin/expenses/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create expense';
      setError(errorMessage);
      throw error;
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
 * Custom hook for creating payments
 */
export function useCreatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (clientId: number, paymentData: PaymentForm) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`admin/cash-receipts/`, {
        client: clientId,
        ...paymentData,
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create payment';
      setError(errorMessage);
      throw error;
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
 * Custom hook for completing discussions
 */
export function useCompleteDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeExpenseDiscussion = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('admin/expense-versions/create-version/', {
        client_id: clientId,
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to complete expense discussion';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const completePaymentDiscussion = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('admin/payment-versions/create-version/', {
        client_id: clientId,
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to complete payment discussion';
      setError(errorMessage);
      throw error;
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
