// Centralized type definitions for the application

export type Translate = (ar: string, en: string) => string;

// Base API response types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: number;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  ordering?: string;
  search?: string;
};

// User and Client types
export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  is_active?: boolean;
};

export type Client = {
  id: number;
  user: User;
  username: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  budget: number;
  status: 'active' | 'completed' | 'pending' | 'inactive';
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  
  // Discussion completion fields
  discussion_completed: boolean;
  discussion_completed_at: string | null;
  expenses_discussion_completed: boolean;
  expenses_discussion_completed_at: string | null;
  payments_discussion_completed: boolean;
  payments_discussion_completed_at: string | null;
  
  // Version tracking
  expenses_version_count: number;
  payments_version_count: number;
  
  // Computed fields
  progress?: number;
  total?: number;
  paid?: number;
  pending?: number;
  upcoming?: number;
  expenses_count?: number;
};

// Expense and Payment types
export type Expense = {
  id: number;
  client: number;
  date: string;
  description: string;
  amount: number | string;
  status: 'paid' | 'pending' | 'upcoming';
  bill_url?: string | null;
  bill?: File;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: number;
  client: number;
  date: string;
  amount: number | string;
  created_at: string;
  updated_at: string;
};

// Version types
export type ExpenseVersion = {
  id: number;
  client: number;
  version_number: number;
  discussion_completed_at: string;
  expenses_data: Expense[];
  created_at: string;
  updated_at: string;
  
  // Computed properties
  expenses_count?: number;
  total_amount?: number;
};

export type PaymentVersion = {
  id: number;
  client: number;
  version_number: number;
  discussion_completed_at: string;
  payments_data: Payment[];
  created_at: string;
  updated_at: string;
  
  // Computed properties
  payments_count?: number;
  total_amount?: number;
};

// Project types
export type Project = {
  id: number;
  title: string;
  client: number;
  client_name: string;
  total_budget: number;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  start_date: string;
  expected_end_date: string;
  created_at: string;
  updated_at: string;
};

// Chat types
export type ChatMessage = {
  id: number;
  content: string;
  sender: 'admin' | 'client';
  timestamp: string;
  file_url?: string;
  file_name?: string;
};

// Dashboard types
export type DashboardStats = {
  total: number;
  active: number;
  completed: number;
  totalRevenue: number;
  pending?: number;
};

export type ClientDashboardData = {
  project: {
    title: string;
    status: string;
    client_username: string;
    client_phone: string;
    client_address: string;
    client_budget: number;
    progress: number;
    start_date: string | null;
    expected_end_date: string | null;
    expenses_discussion_completed: boolean;
    payments_discussion_completed: boolean;
    expenses_discussion_completed_at: string | null;
    payments_discussion_completed_at: string | null;
  };
  expenses: Expense[];
  client_info: {
    username: string;
    email: string;
    phone: string;
    address: string;
    budget: number;
    is_active: boolean;
    status: string;
    created_at: string;
  };
  expenses_summary: {
    total: number;
    paid: number;
    pending: number;
    upcoming: number;
    count: number;
  };
};

// Form types
export type CreateClientForm = {
  username: string;
  password: string;
  password_confirm?: string;
  email: string;
  first_name: string;
  last_name: string;
  project_title: string;
  phone: string;
  address: string;
  budget: number;
  start_date: string;
  expected_end_date: string;
};

export type UpdateClientForm = {
  phone?: string;
  address?: string;
  budget?: number;
  username?: string;
  email?: string;
};

export type ExpenseForm = {
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'upcoming';
  bill?: File;
};

export type PaymentForm = {
  date: string;
  amount: number;
};

// UI State types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  loadingState?: LoadingState;
};

// Component Props types
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type TableProps<T> = {
  data: T[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
};

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
