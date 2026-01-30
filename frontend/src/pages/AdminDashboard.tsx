import { useApp } from '../lib/context';
import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Users, Briefcase, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AdminHeader } from './admin/components/AdminHeader';
import { StatCard } from './admin/components/StatCard';
import { ClientsTable } from './admin/components/ClientsTable';
import { ChatModal } from './admin/components/ChatModal';
import { CreateClientModal } from './admin/components/CreateClientModal';
import { ExpenseModal } from './admin/components/ExpenseModal';
import { ClientExpensesModal } from './admin/components/ClientExpensesModal';
import { ViewExpensesModal } from './admin/components/ViewExpensesModal';
import { ProgressModal } from './admin/components/ProgressModal';
import { WorkItemsTable } from '../components/WorkItemsTable';
import { CreateWorkItemModal } from '../components/CreateWorkItemModal';
import { secureStorage } from '../lib/secureStorage';
import type { Client, CreateClientForm } from './admin/types';
import {
  showClientSuccessAlert,
  showClientErrorAlert,
  showExpenseSuccessAlert,
  showExpenseErrorAlert,
  showWorkItemSuccessAlert,
  showWorkItemErrorAlert,
  showProgressSuccessAlert,
  showProgressErrorAlert,
  showMessageSuccessAlert,
  showMessageErrorAlert,
  showDeleteConfirmationDialog,
  showFormValidationErrorAlert,
  showRequiredFieldAlert
} from '../utils/simpleAlerts';

export function AdminDashboard() {
  const { t, language, setLanguage, theme, setTheme } = useApp();
  
  // IMMEDIATE AUTHENTICATION CHECK - Runs before any rendering
  // Only check if we're not on the login page
  if (window.location.hash !== '#login') {
    const accessToken = secureStorage.getToken();
    const user = secureStorage.getUser();
    
    if (!accessToken || !user || user.role !== 'admin') {
      // Redirect immediately without rendering anything
      window.location.replace('#login');
      return null;
    }
  }
  
  // Check if user is authenticated and is admin
  useEffect(() => {
    const user = secureStorage.getUser();
    
    if (!user) {
      window.location.replace('#login');
      return;
    }
    
    if (user.role !== 'admin') {
      window.location.replace('#login');
      return;
    }
  }, []);

  // Additional check for browser history navigation
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = secureStorage.getToken();
      const user = secureStorage.getUser();
      
      // If no tokens or user, redirect to login immediately
      if (!accessToken || !user || user.role !== 'admin') {
        window.location.replace('#login');
        return;
      }
    };

    // Check on focus (when user comes back to the tab)
    const handleFocus = () => {
      checkAuth();
    };

    // Check on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const [tab, setTab] = useState('overview');

  const [clients, setClients] = useState<Client[]>([]);
  const [deleted, setDeleted] = useState<Client[]>([]);
  const [cashReceipts, setCashReceipts] = useState<any[]>([]);
  const [workItems, setWorkItems] = useState<any[]>([]);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<Client | null>(null);
  const [modalChat, setModalChat] = useState<Client | null>(null);
  const [modalExpense, setModalExpense] = useState<Client | null>(null);
  const [modalClientExpenses, setModalClientExpenses] = useState<Client | null>(null);
  const [modalProgress, setModalProgress] = useState<Client | null>(null);
  const [modalWorkItem, setModalWorkItem] = useState<any>(null);
  const [modalCreateWorkItem, setModalCreateWorkItem] = useState(false);

  const [form, setForm] = useState<CreateClientForm>({
    username: '',
    password: '',
    password_confirm: '',
    project_title: '',
    email: '',
    phone: '',
    address: '',
    start_date: '',
    expected_end_date: ''
  });

  const [editForm, setEditForm] = useState({
    name: '', username: '', password: '',
    paid: '', paidAt: '', invoice: '',
    progress: '', notes: '', total: ''
  });

  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleEditClient = (client: Client) => {
    setModalExpense(client);
  };

  const handleManageExpenses = (client: Client) => {
    setModalClientExpenses(client);
  };

  const handleOpenChat = (client: Client) => {
    setModalChat(client);
  };

  const handleSetProgress = (client: Client) => {
    setModalProgress(client);
  };

  const handleUpdateProgress = async (clientId: number, progress: number) => {
    try {
      await api.patch(`admin/clients/${clientId}/progress/`, { progress });
      setClients(clients.map(cl => cl.id === clientId ? { ...cl, progress } : cl));
      alert(t('تم تحديث التقدم بنجاح', 'Progress updated successfully'));
    } catch (err) {
      await showProgressErrorAlert(err instanceof Error ? err.message : undefined);
    }
  };

  const handleCompleteClient = async (id: number) => {
    try {
      await api.post(`admin/clients/${id}/complete/`);
      setClients(clients.map(c => c.id === id ? { ...c, status: 'completed' } : c));
      alert(t('تم إكمال العميل بنجاح', 'Client completed successfully'));
    } catch (err) {
      await showClientErrorAlert('complete', err instanceof Error ? err.message : undefined);
    }
  };

  const handleRetrieveClient = async (id: number) => {
    try {
      await api.post(`admin/clients/${id}/retrieve/`);
      setClients(clients.map(c => c.id === id ? { ...c, status: 'active' } : c));
      alert(t('تم استرجاع العميل بنجاح', 'Client retrieved successfully'));
    } catch (err) {
      await showClientErrorAlert('retrieve', err instanceof Error ? err.message : undefined);
    }
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint if available
      await api.post('logout/');
    } catch (err) {
      // Continue with logout even if backend call fails
    } finally {
      // Clear all authentication data
      secureStorage.clearAll();
      
      // Clear session storage as well
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Force hard reload and redirect to login
      window.location.href = window.location.origin + '/#login';
    }
  };

  const handleSendMessage = async () => {
    if (!modalChat) {
      await showRequiredFieldAlert('client');
      return;
    }
    if (!message.trim() && !selectedFile) {
      await showRequiredFieldAlert('message or file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('client', modalChat.id.toString());
      if (message.trim()) {
        formData.append('content', message);
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await api.post('messages/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('');
      setSelectedFile(null);

      try {
        const res = await api.get(`messages/?client_id=${modalChat.id}`);
        setModalChat(prev => prev ? { ...prev, messages: res.data } : null);
      } catch (err) {
        // Error handled by API service
      }
    } catch (err: any) {
      if (err.response?.data) {
        await showMessageErrorAlert(JSON.stringify(err.response.data));
      } else {
        await showMessageErrorAlert(err.message);
      }
    }
  };

  const handleTestMessage = async () => {
    if (!modalChat) return;

    try {
      const response = await api.post('messages/', {
        client: modalChat.id,
        content: `Test message from admin at ${new Date().toLocaleString()}`,
      });

      const res = await api.get(`messages/?client_id=${modalChat.id}`);
      setModalChat(prev => prev ? { ...prev, messages: res.data } : null);
    } catch (err: any) {
      await showMessageErrorAlert('Failed to create test message');
    }
  };

  const createExpense = async (expenseData: any) => {
    try {
      const formData = new FormData();
      formData.append('client_id', expenseData.client_id.toString());
      formData.append('date', expenseData.date);
      formData.append('description', expenseData.description);
      formData.append('amount', expenseData.amount.toString());
      formData.append('status', expenseData.status);
      if (expenseData.bill) {
        formData.append('bill', expenseData.bill);
      }

      const res = await api.post('expenses/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await showExpenseSuccessAlert('created');
    } catch (err: any) {
      if (err.response && err.response.data) {
        await showExpenseErrorAlert('create', JSON.stringify(err.response.data));
      } else {
        await showExpenseErrorAlert('create');
      }
    }
  };

  const deleteClient = async (id: number) => {
    const result = await showDeleteConfirmationDialog('client');
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`admin/clients/${id}/`);
      setClients(clients.filter(c => c.id !== id));
      await showClientSuccessAlert('deleted');
    } catch (err) {
      await showClientErrorAlert('delete', err instanceof Error ? err.message : undefined);
    }
  };

  const handleEditWorkItem = (item: any) => {
    setModalWorkItem(item);
  };

  const handleCreateWorkItem = () => {
    setModalCreateWorkItem(true);
  };

  const handleSaveWorkItem = async (item: any, files?: any) => {
    try {
      const formData = new FormData();
      formData.append('title_ar', item.title_ar);
      formData.append('title_en', item.title_en);
      formData.append('category', item.category);
      
      // Only add image fields if files are provided
      if (files) {
        if (files.before_image) {
          formData.append('before_image', files.before_image);
        }
        if (files.after_image) {
          formData.append('after_image', files.after_image);
          // The backend will automatically set this as the main image
        }
      }

      let res: any;
      if (item.id) {
        // Update existing work item
        res = await api.patch(`admin/work-items/${item.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setWorkItems(workItems.map(wi => wi.id === item.id ? res.data : wi));
        await showWorkItemSuccessAlert('updated');
      } else {
        // Create new work item
        res = await api.post('admin/work-items/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setWorkItems([res.data, ...workItems]);
        await showWorkItemSuccessAlert('created');
      }

      setModalWorkItem(null);
      setModalCreateWorkItem(false);
    } catch (err: any) {
      if (err.response && err.response.data) {
        await showWorkItemErrorAlert(item.id ? 'update' : 'create', JSON.stringify(err.response.data));
      } else {
        await showWorkItemErrorAlert(item.id ? 'update' : 'create');
      }
    }
  };

  const handleDeleteWorkItem = async (id: number) => {
    const result = await showDeleteConfirmationDialog('work item');
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`admin/work-items/${id}/`);
      setWorkItems(workItems.filter(wi => wi.id !== id));
      await showWorkItemSuccessAlert('deleted');
    } catch (err) {
      await showWorkItemErrorAlert('delete', err instanceof Error ? err.message : undefined);
    }
  };

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await api.get('admin/clients/');
        setClients(res.data);
      } catch (err) {
        // Error handled by API service
      }
    };
    loadClients();
  }, []);

  useEffect(() => {
    const loadCashReceipts = async () => {
      try {
        const res = await api.get('admin/payments/');
        setCashReceipts(res.data);
      } catch (err) {
        // Error handled by API service
      }
    };
    loadCashReceipts();
  }, []);

  useEffect(() => {
    const loadWorkItems = async () => {
      try {
        const res = await api.get('admin/work-items/');
        const transformedData = res.data.map((item: any) => ({
          ...item,
          image: item.image ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`) : (item.after_image ? (item.after_image.startsWith('http') ? item.after_image : `http://127.0.0.1:8000${item.after_image}`) : null),
          before_image: item.before_image ? (item.before_image.startsWith('http') ? item.before_image : `http://127.0.0.1:8000${item.before_image}`) : null,
          after_image: item.after_image ? (item.after_image.startsWith('http') ? item.after_image : `http://127.0.0.1:8000${item.after_image}`) : null,
        }));
        setWorkItems(transformedData);
      } catch (err) {
        // Error handled by API service
      }
    };
    loadWorkItems();
  }, []);

  useEffect(() => {
    const loadChat = async () => {
      if (!modalChat) return;

      try {
        const res = await api.get(`messages/?client_id=${modalChat.id}`);
        const messages = Array.isArray(res.data) ? res.data : [];
        setModalChat(prev => prev ? { ...prev, messages: messages } : null);
      } catch (err) {
        // Error handled by API service
      }
    };
    loadChat();
  }, [modalChat]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    completed: clients.filter(c => c.status === 'completed').length,
    totalRevenue: clients.reduce((acc, c) => acc + c.total, 0),
    totalReceived: cashReceipts.reduce((acc, receipt) => acc + parseFloat(String(receipt.amount)), 0),
  }), [clients, cashReceipts]);

  const projectsData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const name = language === 'ar'
        ? d.toLocaleString('ar-EG', { month: 'short' })
        : d.toLocaleString('en-US', { month: 'short' });
      const count = clients.filter(c => {
        const dC = new Date(c.createdAt);
        return dC.getFullYear() === d.getFullYear() && dC.getMonth() === d.getMonth();
      }).length;
      return { name, projects: count };
    });
  }, [clients, language]);

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: 'EGP' }).format(num);

  const financialData = useMemo(() => [
    {
      name: language === 'ar' ? 'إجمالي المدفوع' : 'Total Paid',
      value: stats.totalRevenue,
      fill: '#f59e0b'
    },
    {
      name: language === 'ar' ? 'إجمالي المستلم' : 'Total Received',
      value: stats.totalReceived,
      fill: '#10b981'
    }
  ], [stats.totalRevenue, stats.totalReceived, language]);

  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    clients.forEach(c => { map[c.status] = (map[c.status] || 0) + 1 });
    return Object.entries(map).map(([key, value]) => {
      const name = key === 'active'
        ? (language === 'ar' ? 'جاري العمل' : 'In Progress')
        : key === 'completed'
          ? (language === 'ar' ? 'مكتمل' : 'Completed')
          : (language === 'ar' ? 'معلق' : 'Pending');
      return { name, value };
    });
  }, [clients, language]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return language === 'ar'
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

  const createClient = async () => {
    // Ensure form values are strings and not objects
    const cleanForm = {
      username: typeof form.username === 'string' ? form.username : String(form.username || ''),
      password: typeof form.password === 'string' ? form.password : String(form.password || ''),
      password_confirm: typeof form.password_confirm === 'string' ? form.password_confirm : String(form.password_confirm || ''),
      project_title: typeof form.project_title === 'string' ? form.project_title : String(form.project_title || ''),
      email: typeof form.email === 'string' ? form.email : String(form.email || ''),
      phone: typeof form.phone === 'string' ? form.phone : String(form.phone || ''),
      address: typeof form.address === 'string' ? form.address : String(form.address || ''),
      start_date: typeof form.start_date === 'string' ? form.start_date : String(form.start_date || ''),
      expected_end_date: typeof form.expected_end_date === 'string' ? form.expected_end_date : String(form.expected_end_date || '')
    };
    
    const missingFields = [];
    if (!cleanForm.username.trim()) missingFields.push('username');
    if (!cleanForm.password.trim()) missingFields.push('password');
    if (!cleanForm.password_confirm.trim()) missingFields.push('password confirmation');
    if (!cleanForm.project_title.trim()) missingFields.push('project title');
    
    if (missingFields.length > 0) {
      await showFormValidationErrorAlert(missingFields);
      return;
    }
    
    if (cleanForm.password !== cleanForm.password_confirm) {
      await showFormValidationErrorAlert(['Passwords do not match.']);
      return;
    }
    
    try {
      const res = await api.post('admin/clients/', cleanForm);
      setClients([res.data, ...clients]);
      setForm({ username: '', password: '', password_confirm: '', project_title: '', email: '', phone: '', address: '', start_date: '', expected_end_date: '' });
      setModalCreate(false);
      setTab('clients');
      await showClientSuccessAlert('created');
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.details) {
        // Handle validation errors with field-specific messages
        const errorDetails = err.response.data.details;
        let errorMessage = '';
        
        if (typeof errorDetails === 'object') {
          // Extract field-specific error messages
          const errorMessages = [];
          for (const [field, fieldData] of Object.entries(errorDetails)) {
            if (typeof fieldData === 'object' && fieldData !== null) {
              // Handle nested structure like {"username": {"username": ["error message"]}}
              for (const [subField, messages] of Object.entries(fieldData)) {
                if (Array.isArray(messages)) {
                  errorMessages.push(`${subField}: ${messages.join(', ')}`);
                } else {
                  errorMessages.push(`${subField}: ${messages}`);
                }
              }
            } else if (Array.isArray(fieldData)) {
              errorMessages.push(`${field}: ${fieldData.join(', ')}`);
            } else {
              errorMessages.push(`${field}: ${fieldData}`);
            }
          }
          errorMessage = errorMessages.join('\n');
        } else {
          errorMessage = err.response.data.message || 'Validation failed';
        }
        
        await showClientErrorAlert('create', errorMessage);
      } else if (err.response?.status === 400 && err.response?.data?.error) {
        // Handle simple error messages
        await showClientErrorAlert('create', err.response.data.error);
      } else {
        // Handle other errors
        await showClientErrorAlert('create', err.response?.data?.message || err.message || 'Unknown error occurred');
      }
    }
  };

  const updateClient = async (id: number, updates: Partial<Client>) => {
    try {
      const res = await api.patch(`admin/clients/${id}/`, updates);
      setClients(clients.map(c => c.id === id ? res.data : c));
    } catch (err) {
      await showClientErrorAlert('update', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <AdminHeader
        t={t}
        onCreateClient={() => setModalCreate(true)}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Tabs */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t('نظرة عامة', 'Overview')}</TabsTrigger>
            <TabsTrigger value="clients">{t('العملاء', 'Clients')}</TabsTrigger>
            <TabsTrigger value="completed">{t('عملاء منتهية', 'Completed')}</TabsTrigger>
            <TabsTrigger value="work-items">{t('صفحة أعمالنا', 'Our Work Page')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title={t('إجمالي العملاء', 'Total Clients')} value={stats.total} icon={<Users className="h-6 w-6 text-blue-600" />} />
              <StatCard title={t('مشاريع نشطة', 'Active Projects')} value={stats.active} icon={<Briefcase className="h-6 w-6 text-green-600" />} />
              <StatCard title={t('مشاريع مكتملة', 'Completed')} value={stats.completed} icon={<TrendingUp className="h-6 w-6 text-purple-600" />} />
              <StatCard title={t('إجمالي المدفوع', 'Total Paid')} value={formatCurrency(stats.totalRevenue)} icon={<DollarSign className="h-6 w-6 text-yellow-600" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <StatCard title={t('إجمالي المستلم', 'Total Received')} value={formatCurrency(stats.totalReceived)} icon={<DollarSign className="h-6 w-6 text-green-600" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('حالة العملاء', 'Client Status')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#6b7280" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t('مقارنة مالية', 'Financial Comparison')}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="value" fill="#8884d8">
                        {financialData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardContent className="p-6">
                <ClientsTable
                  list={clients.filter(c => c.status === 'active')}
                  t={t}
                  formatCurrency={formatCurrency}
                  onEdit={handleEditClient}
                  onManageExpenses={handleManageExpenses}
                  onOpenChat={handleOpenChat}
                  onComplete={handleCompleteClient}
                  onDelete={deleteClient}
                  onSetProgress={handleSetProgress}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="p-6">
                <ClientsTable
                  list={clients.filter(c => c.status === 'completed')}
                  t={t}
                  formatCurrency={formatCurrency}
                  onEdit={handleEditClient}
                  onManageExpenses={handleManageExpenses}
                  onOpenChat={handleOpenChat}
                  onComplete={handleCompleteClient}
                  onDelete={deleteClient}
                  onSetProgress={handleSetProgress}
                  onRetrieve={handleRetrieveClient}
                  completed
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="work-items">
            <Card>
              <CardContent className="p-6">
                <WorkItemsTable
                  list={workItems}
                  onEdit={handleEditWorkItem}
                  onDelete={handleDeleteWorkItem}
                  onCreateNew={handleCreateWorkItem}
                  t={t}
                  language={language}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ChatModal
          modalChat={modalChat}
          t={t}
          onClose={() => setModalChat(null)}
          chatRef={chatRef}
          message={message}
          setMessage={setMessage}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSendMessage={handleSendMessage}
          onTestMessage={handleTestMessage}
        />
        <ViewExpensesModal
          isOpen={!!modalExpense}
          onClose={() => setModalExpense(null)}
          client={modalExpense}
          t={t}
        />
        <ClientExpensesModal
          isOpen={!!modalClientExpenses}
          onClose={() => setModalClientExpenses(null)}
          client={modalClientExpenses}
          t={t}
        />
        <CreateClientModal
          isOpen={modalCreate}
          onClose={() => setModalCreate(false)}
          form={form}
          setForm={setForm}
          onCreateClient={createClient}
          t={t}
        />
        <ProgressModal
          isOpen={!!modalProgress}
          onClose={() => setModalProgress(null)}
          client={modalProgress}
          onUpdateProgress={handleUpdateProgress}
          t={t}
        />
        <CreateWorkItemModal
          isOpen={modalCreateWorkItem}
          onClose={() => setModalCreateWorkItem(false)}
          item={null}
          onSave={handleSaveWorkItem}
          t={t}
          language={language}
        />
        <CreateWorkItemModal
          isOpen={!!modalWorkItem}
          onClose={() => setModalWorkItem(null)}
          item={modalWorkItem}
          onSave={handleSaveWorkItem}
          t={t}
          language={language}
        />
      </div>
    </div>
  );
}
