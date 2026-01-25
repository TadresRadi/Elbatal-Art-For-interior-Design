/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api/',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Application Routes
export const ROUTES = {
  HOME: 'home',
  WORKS: 'works',
  ABOUT: 'about',
  SERVICES: 'services',
  NEWS: 'news',
  CONTACT: 'contact',
  LOGIN: 'login',
  CLIENT_DASHBOARD: 'client-dashboard',
  ADMIN_DASHBOARD: 'admin-dashboard',
} as const;

// Dashboard Routes
export const DASHBOARD_ROUTES = [
  ROUTES.CLIENT_DASHBOARD,
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.LOGIN,
] as const;

// Language Configuration
export const LANGUAGES = {
  ARABIC: 'ar',
  ENGLISH: 'en',
} as const;

// Theme Configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Status Options
export const EXPENSE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  UPCOMING: 'upcoming',
} as const;

// Client Status Options
export const CLIENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PENDING: 'pending',
  INACTIVE: 'inactive',
} as const;

// Project Status Options
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PENDING: 'pending',
} as const;

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  EXPENSE_BILL_FOLDER: 'expenses/',
} as const;

// Currency Configuration
export const CURRENCY = {
  DEFAULT_LOCALE: 'en-US',
  DEFAULT_CURRENCY: 'EGP',
  ARABIC_LOCALE: 'ar-EG',
} as const;

// Date Format Configuration
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DATETIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
} as const;

// Validation Rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 20,
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
  },
  AMOUNT: {
    MIN_VALUE: 0,
    MAX_VALUE: 999999999.99,
    DECIMAL_PLACES: 2,
  },
} as const;

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Item created successfully.',
  UPDATED: 'Item updated successfully.',
  DELETED: 'Item deleted successfully.',
  SAVED: 'Changes saved successfully.',
  UPLOADED: 'File uploaded successfully.',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
  LAST_PAGE: 'lastPage',
} as const;

// Debounce Delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  API_CALL: 500,
  INPUT: 250,
  BUTTON_CLICK: 100,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// Color Palette (for CSS variables)
export const COLORS = {
  PRIMARY: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  SUCCESS: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  WARNING: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  ERROR: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;
