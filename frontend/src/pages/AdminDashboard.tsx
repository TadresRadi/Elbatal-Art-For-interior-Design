import { useApp } from '../lib/context';
import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AdminHeader } from './admin/components/AdminHeader';
import { StatCard } from './admin/components/StatCard';
import { ClientsTable } from './admin/components/ClientsTable';
import { ChatModal } from './admin/components/ChatModal';
import { CreateClientModal } from './admin/components/CreateClientModal';
import { ExpenseModal } from './admin/components/ExpenseModal';
import { ClientExpensesModal } from './admin/components/ClientExpensesModal';
import { ProgressModal } from './admin/components/ProgressModal';
import type { Client, CreateClientForm } from './admin/types';

export function AdminDashboard() {
  const { t, language, setLanguage, theme, setTheme } = useApp();
  const [tab, setTab] = useState('overview');

  const [clients, setClients] = useState<Client[]>([]);
  const [deleted, setDeleted] = useState<Client[]>([]);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<Client | null>(null);
  const [modalChat, setModalChat] = useState<Client | null>(null);
  const [modalExpense, setModalExpense] = useState<Client | null>(null);
  const [modalClientExpenses, setModalClientExpenses] = useState<Client | null>(null);
  const [modalProgress, setModalProgress] = useState<Client | null>(null);

  const [form, setForm] = useState<CreateClientForm>({
    username: '',
    password: '',
    project_title: '',
    budget: '',
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
    setModalClientExpenses(client);
  };

  const handleManageExpenses = (client: Client) => {
    setModalExpense(client);
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
      console.error('Error updating progress:', err);
      alert(t('فشل تحديث التقدم', 'Failed to update progress'));
    }
  };

  const handleCompleteClient = async (clientId: number) => {
    try {
      await api.post(`admin/clients/${clientId}/complete/`);
      setClients(clients.map(cl => cl.id === clientId ? { ...cl, status: 'completed', progress: 100 } : cl));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/#login';
  };

  const handleSendMessage = async () => {
    if (!modalChat) return alert('العميل غير محدد');
    if (!message.trim() && !selectedFile) return alert('Please enter a message or select a file');

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
        console.error('Error refreshing messages:', err);
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      if (err.response?.data) {
        alert('فشل إرسال الرسالة: ' + JSON.stringify(err.response.data));
      } else {
        alert('حدث خطأ أثناء إرسال الرسالة: ' + err.message);
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
      console.error('Error creating test message:', err);
      alert('Failed to create test message');
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
      alert(t('تم إضافة المصروف بنجاح', 'Expense added successfully'));
    } catch (err: any) {
      console.error('Error creating expense:', err);
      if (err.response && err.response.data) {
        alert(t('فشل إضافة المصروف: ', 'Failed to add expense: ') + JSON.stringify(err.response.data));
      } else {
        alert(t('فشل إضافة المصروف', 'Failed to add expense'));
      }
    }
  };

  const deleteClient = async (id: number) => {
    if (!window.confirm(t('هل أنت متأكد من حذف العميل', 'Delete client'))) return;
    try {
      await api.delete(`admin/clients/${id}/`);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await api.get('admin/clients/');
        setClients(res.data);
      } catch (err) {
        console.error('Error loading clients:', err);
      }
    };
    loadClients();
  }, []);

  useEffect(() => {
    const loadChat = async () => {
      if (!modalChat) return;

      try {
        const res = await api.get(`messages/?client_id=${modalChat.id}`);
        const messages = Array.isArray(res.data) ? res.data : [];
        setModalChat(prev => prev ? { ...prev, messages: messages } : null);

        // Auto-scroll to bottom after loading
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 100);
      } catch (err: any) {
        console.error('Error loading chat messages:', err);
        // Set empty messages array on error to prevent undefined issues
        setModalChat(prev =>
          prev ? { ...prev, messages: [] } : null
        );
      }
    };

    loadChat();
  }, [modalChat?.id]);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [modalChat?.messages]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    completed: clients.filter(c => c.status === 'completed').length,
    totalRevenue: clients.reduce((acc, c) => acc + c.total, 0),
  }), [clients]);

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

  const statusData = useMemo(() => {
    const map: any = {};
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

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: 'EGP' }).format(num);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return language === 'ar'
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

  const createClient = async () => {
    if (!form.username.trim() || !form.password.trim() || !form.project_title.trim() || !form.budget) {
      return alert(t('يرجى ملء جميع الحقول المطلوبة', 'Please fill all required fields'));
    }
    try {
      const res = await api.post('admin/clients/', {
        username: form.username,
        password: form.password,
        project_title: form.project_title,
        budget: Number(form.budget),
        phone: form.phone || '',
        address: form.address || '',
        start_date: form.start_date,
        expected_end_date: form.expected_end_date
      });
      setClients([res.data, ...clients]);
      setForm({ username: '', password: '', project_title: '', budget: '', phone: '', address: '', start_date: '', expected_end_date: '' });
      setModalCreate(false);
      setTab('clients');
      alert(t('تم إنشاء العميل بنجاح', 'Client created successfully'));
    } catch (err: any) {
      console.error('Error creating client:', err);
      if (err.response && err.response.data) {
        alert(t('فشل إنشاء العميل: ', 'Failed to create client: ') + JSON.stringify(err.response.data));
      } else {
        alert(t('فشل إنشاء العميل', 'Failed to create client'));
      }
    }
  };

  const updateClient = async (id: number, updates: Partial<Client>) => {
    try {
      const res = await api.patch(`admin/clients/${id}/`, updates);
      setClients(clients.map(c => c.id === id ? res.data : c));
    } catch (err) {
      console.error('Error updating client:', err);
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
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title={t('إجمالي العملاء', 'Total Clients')} value={stats.total} icon={<Users className="h-6 w-6 text-blue-600" />} />
              <StatCard title={t('مشاريع نشطة', 'Active Projects')} value={stats.active} icon={<Briefcase className="h-6 w-6 text-green-600" />} />
              <StatCard title={t('مشاريع مكتملة', 'Completed')} value={stats.completed} icon={<TrendingUp className="h-6 w-6 text-purple-600" />} />
              <StatCard title={t('إجمالي الإيرادات', 'Total Revenue')} value={formatCurrency(stats.totalRevenue)} icon={<DollarSign className="h-6 w-6 text-yellow-600" />} />
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
                  <h3 className="text-lg font-semibold mb-4">{t('إحصائيات سريعة', 'Quick Stats')}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('نسبة المكتمل', 'Completion Rate')}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('متوسط الإيرادات', 'Average Revenue')}</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {stats.total > 0 ? formatCurrency(stats.totalRevenue / stats.total) : formatCurrency(0)}
                      </span>
                    </div>
                  </div>
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
                  completed
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
        <ExpenseModal
          isOpen={!!modalExpense}
          onClose={() => setModalExpense(null)}
          clientId={modalExpense?.id || null}
          onCreateExpense={createExpense}
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
      </div>
    </div>
  );
}