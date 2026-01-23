export type Translate = (ar: string, en: string) => string;

export type ChatMessage = {
  id: number;
  content: string;
  sender: 'admin' | 'client';
  timestamp: string;
  file_url?: string;
  file_name?: string;
};

export type Expense = {
  id: number;
  client: number;
  date: string;
  description: string;
  amount: number | string; // API may return string
  status: 'paid' | 'pending' | 'upcoming';
  bill_url?: string | null;
  bill?: File; // For file uploads
  created_at?: string;
  updated_at?: string;
};

export type Client = {
  id: number;
  name: string;
  username: string;
  password?: string;
  progress: number;
  paid: number;
  total: number;
  invoice?: string;
  paidAt?: string;
  notes?: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
  updatedAt?: string;
  messages?: ChatMessage[];
  phone?: string;
  address?: string;
  budget?: number;
};

export type CreateClientForm = {
  username: string;
  password: string;
  project_title: string;
  budget: string;
  phone: string;
  address: string;
  start_date: string;
  expected_end_date: string;
};

export type DashboardStats = {
  total: number;
  active: number;
  completed: number;
  totalRevenue: number;
  pending?: number;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  ordering?: string;
  search?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
