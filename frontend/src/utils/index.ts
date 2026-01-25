import type { Expense, Payment, ExpenseVersion, PaymentVersion } from '../types';

/**
 * Currency formatting utility
 */
export const formatCurrency = (value: number | string, locale: string = 'en-US'): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0.00';
  
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : locale, {
    style: 'currency',
    currency: 'EGP',
  }).format(numValue);
};

/**
 * Date formatting utility
 */
export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Date formatting for display
 */
export const formatDateTime = (dateString: string | null, locale: string = 'en-US'): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleString(locale === 'ar' ? 'ar-EG' : locale);
};

/**
 * Get status color classes
 */
export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Calculate total amount from expenses
 */
export const calculateExpensesTotal = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => {
    const amount = typeof expense.amount === 'string' 
      ? parseFloat(expense.amount) 
      : expense.amount;
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
};

/**
 * Calculate total amount from payments
 */
export const calculatePaymentsTotal = (payments: Payment[]): number => {
  return payments.reduce((total, payment) => {
    const amount = typeof payment.amount === 'string' 
      ? parseFloat(payment.amount) 
      : payment.amount;
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
};

/**
 * Filter expenses by date range
 */
export const filterExpensesByDate = (
  expenses: Expense[], 
  startDate?: string, 
  endDate?: string
): Expense[] => {
  if (!startDate && !endDate) return expenses;
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    
    if (startDate && expenseDate < new Date(startDate)) {
      return false;
    }
    
    if (endDate && expenseDate > new Date(endDate)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Filter expenses by status
 */
export const filterExpensesByStatus = (
  expenses: Expense[], 
  status: string | string[]
): Expense[] => {
  const statuses = Array.isArray(status) ? status : [status];
  return expenses.filter(expense => statuses.includes(expense.status));
};

/**
 * Sort expenses by date
 */
export const sortExpensesByDate = (expenses: Expense[], order: 'asc' | 'desc' = 'desc'): Expense[] => {
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });
};

/**
 * Group expenses by status
 */
export const groupExpensesByStatus = (expenses: Expense[]): Record<string, Expense[]> => {
  return expenses.reduce((groups, expense) => {
    if (!groups[expense.status]) {
      groups[expense.status] = [];
    }
    groups[expense.status].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);
};

/**
 * Validate expense form data
 */
export const validateExpenseForm = (data: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }
  
  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (!data.status) {
    errors.status = 'Status is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate payment form data
 */
export const validatePaymentForm = (data: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate expense report data
 */
export const generateExpenseReport = (expenses: Expense[]) => {
  const total = calculateExpensesTotal(expenses);
  const statusGroups = groupExpensesByStatus(expenses);
  
  return {
    total,
    count: expenses.length,
    byStatus: Object.entries(statusGroups).map(([status, items]) => ({
      status,
      count: items.length,
      total: calculateExpensesTotal(items),
    })),
    average: expenses.length > 0 ? total / expenses.length : 0,
  };
};

/**
 * Generate payment report data
 */
export const generatePaymentReport = (payments: Payment[]) => {
  const total = calculatePaymentsTotal(payments);
  
  return {
    total,
    count: payments.length,
    average: payments.length > 0 ? total / payments.length : 0,
    firstPaymentDate: payments.length > 0 ? payments[0].date : null,
    lastPaymentDate: payments.length > 0 ? payments[payments.length - 1].date : null,
  };
};

/**
 * Calculate version statistics
 */
export const calculateVersionStats = (versions: ExpenseVersion[] | PaymentVersion[]) => {
  if (versions.length === 0) {
    return {
      totalVersions: 0,
      totalAmount: 0,
      averageAmount: 0,
      latestVersion: null,
      firstVersion: null,
    };
  }
  
  const sortedVersions = [...versions].sort((a, b) => a.version_number - b.version_number);
  const totalAmount = versions.reduce((total, version) => {
    return total + (version.total_amount || 0);
  }, 0);
  
  return {
    totalVersions: versions.length,
    totalAmount,
    averageAmount: totalAmount / versions.length,
    latestVersion: sortedVersions[sortedVersions.length - 1],
    firstVersion: sortedVersions[0],
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Get relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
};

/**
 * Check if two arrays are equal
 */
export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * Remove duplicates from array
 */
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) return [...new Set(array)];
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};
