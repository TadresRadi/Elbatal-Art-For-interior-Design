export type Translate = (ar: string, en: string) => string;

export type ChatMessage = {
  id: number;
  content: string;
  sender: 'admin' | 'client';
  timestamp: string;
  file_url?: string;
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
  messages?: ChatMessage[];
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
};
