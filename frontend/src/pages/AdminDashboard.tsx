import { useApp } from '../lib/context';
import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { AdminHeader } from './admin/components/AdminHeader';
import { StatCard } from './admin/components/StatCard';
import { ClientsTable } from './admin/components/ClientsTable';
import { ChatModal } from './admin/components/ChatModal';
import { CreateClientModal } from './admin/components/CreateClientModal';
import type { Client, CreateClientForm } from './admin/types';

export function AdminDashboard() {
  const { t, language } = useApp();
  const [tab, setTab] = useState('overview');

  const [clients, setClients] = useState<Client[]>([]);
  const [deleted, setDeleted] = useState<Client[]>([]);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<Client | null>(null);
  const [modalChat, setModalChat] = useState<Client | null>(null);

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
    setModalEdit(client);
    setEditForm({
      name: client.name,
      username: client.username,
      password: client.password || '',
      paid: client.paid.toString(),
      paidAt: client.paidAt || '',
      invoice: client.invoice || '',
      progress: client.progress.toString(),
      notes: client.notes || '',
      total: client.total.toString(),
    });
  };

  const handleOpenChat = (client: Client) => {
    setModalChat(client);
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

      console.log('Sending message with data:', {
        client: modalChat.id,
        content: message,
        hasFile: !!selectedFile,
      });

      const response = await api.post('messages/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Message sent successfully:', response.data);

      setMessage('');
      setSelectedFile(null);

      try {
        const res = await api.get(`messages/?client_id=${modalChat.id}`);
        console.log('Messages after refresh:', res.data);
        setModalChat(prev => prev ? { ...prev, messages: res.data } : null);
      } catch (err) {
        console.error('Error refreshing messages:', err);
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);

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
      console.log('Creating test message for client:', modalChat.id);
      const response = await api.post('messages/', {
        client: modalChat.id,
        content: `Test message from admin at ${new Date().toLocaleString()}`,
      });

      console.log('Test message created:', response.data);

      const res = await api.get(`messages/?client_id=${modalChat.id}`);
      console.log('Messages after test creation:', res.data);
      setModalChat(prev => prev ? { ...prev, messages: res.data } : null);
    } catch (err: any) {
      console.error('Error creating test message:', err);
      console.error('Error response:', err.response);
      alert('Failed to create test message');
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
        console.log('=== CHAT LOADING DEBUG ===');
        console.log('Loading chat for client:', modalChat.id);
        console.log('Client object:', modalChat);

        const res = await api.get(`messages/?client_id=${modalChat.id}`);
        console.log('Raw API response:', res);
        console.log('Response data:', res.data);
        console.log('Response data type:', typeof res.data);
        console.log('Is array?', Array.isArray(res.data));
        console.log('Number of messages:', res.data?.length || 0);

        if (res.data && res.data.length > 0) {
          console.log('First message:', res.data[0]);
          console.log('All message IDs:', res.data.map((m: any) => m.id));
        }

        // Ensure messages is always an array
        const messages = Array.isArray(res.data) ? res.data : [];
        console.log('Final messages array:', messages);

        setModalChat(prev => {
          console.log('Previous modalChat:', prev);
          const updated = prev ? { ...prev, messages: messages } : null;
          console.log('Updated modalChat:', updated);
          return updated;
        });

        // Auto-scroll to bottom after loading
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 100);
      } catch (err: any) {
        console.error('=== CHAT LOAD ERROR ===');
        console.error('Error:', err);
        console.error('Error response:', err.response);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);

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

  const deleteClient = async (id: number) => {
    if (!window.confirm(t('هل أنت متأكد من حذف العميل', 'Delete client'))) return;
    try {
      await api.delete(`admin/clients/${id}/`);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">

      <AdminHeader
        t={t}
        onCreateClient={() => setModalCreate(true)}
        onLogout={handleLogout}
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
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardContent className="p-6">
                <ClientsTable
                  list={clients.filter(c => c.status === 'active')}
                  t={t}
                  formatCurrency={formatCurrency}
                  onEdit={handleEditClient}
                  onOpenChat={handleOpenChat}
                  onComplete={handleCompleteClient}
                  onDelete={deleteClient}
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
                  onOpenChat={handleOpenChat}
                  onComplete={handleCompleteClient}
                  onDelete={deleteClient}
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
        <CreateClientModal
          isOpen={modalCreate}
          onClose={() => setModalCreate(false)}
          form={form}
          setForm={setForm}
          onCreateClient={createClient}
          t={t}
        />
      </div>
    </div>
  );
}