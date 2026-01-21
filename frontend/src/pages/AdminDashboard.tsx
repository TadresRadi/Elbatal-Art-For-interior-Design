import { useApp } from '../lib/context';
import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

import {
  LogOut, Users, Briefcase, DollarSign, TrendingUp, MessageSquare,
  Edit, Trash2, Plus, CheckCircle, FileText, Calendar, Percent,
  CreditCard, AlertCircle
} from 'lucide-react';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#D4AF37', '#B8941F', '#F4E4B8', '#C9A961'];

type ChatMessage = {
  id: number;
  content: string;
  sender: 'admin' | 'client';
  timestamp: string;
};

type Client = {
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

export function AdminDashboard() {
  const { t, language } = useApp();
  const [tab, setTab] = useState('overview');

  const [clients, setClients] = useState<Client[]>([]);
  const [deleted, setDeleted] = useState<Client[]>([]);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<Client | null>(null);
  const [modalChat, setModalChat] = useState<Client | null>(null);

  const [form, setForm] = useState({
    username: '', password: '', project_title: '', budget: '', phone: '', address: ''
  });

  const [editForm, setEditForm] = useState({
    name: '', username: '', password: '',
    paid: '', paidAt: '', invoice: '',
    progress: '', notes: '', total: ''
  });

  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

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

  // -------------------- CREATE CLIENT --------------------
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
      setForm({ username: '', password: '', project_title: '', budget: '', phone: '', address: '' });
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

  // -------------------- UPDATE / DELETE / MESSAGE --------------------
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

  useEffect(() => {
    const loadChat = async () => {
      if (!modalChat) return alert("العميل غير محدد");;

      try {
        const res = await api.get(`messages/?client_id=${modalChat.id}`);
        setModalChat(prev =>
          prev ? { ...prev, messages: res.data } : null
        );
      } catch (err) {
        console.error('Chat load error:', err);
      }
    };

    loadChat();
  }, [modalChat?.id]);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [modalChat?.messages]);

  // -------------------- RENDER TABLE --------------------
  const renderTable = (list: Client[], options: { completed?: boolean, deleted?: boolean } = {}) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('الاسم', 'Name')}</TableHead>
          <TableHead>{t('التكلفة الكلية', 'Total Cost')}</TableHead>
          <TableHead>{t('المدفوع', 'Paid')}</TableHead>
          <TableHead>{t('نسبة الإنجاز', 'Progress')}</TableHead>
          <TableHead>{t('الحالة', 'Status')}</TableHead>
          <TableHead>{t('الإجراءات', 'Actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map(c => (
          <TableRow key={c.id}>
            <TableCell>{c.name || c.username}</TableCell>
            <TableCell>{formatCurrency(c.total)}</TableCell>
            <TableCell>{formatCurrency(c.paid)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <span>{c.progress}%</span>
              </div>
            </TableCell>
            <TableCell><Badge>{c.status === 'active' ? t('نشط', 'Active') : c.status === 'completed' ? t('مكتمل', 'Completed') : t('معلق', 'Pending')}</Badge></TableCell>
            <TableCell className="flex gap-1">
              {!options.deleted && <>
                <Button variant="ghost" size="icon" onClick={() => {
                  setModalEdit(c); setEditForm({
                    name: c.name, username: c.username, password: c.password || '',
                    paid: c.paid.toString(), paidAt: c.paidAt || '', invoice: c.invoice || '',
                    progress: c.progress.toString(), notes: c.notes || '', total: c.total.toString()
                  })
                }} title={t('تعديل العميل', 'Edit Client')}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setModalChat(c)} title={t('فتح الشات', 'Open Chat')}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
                {!options.completed && <Button variant="ghost" size="icon"
                  onClick={async () => {
                    try {
                      await api.post(`admin/clients/${c.id}/complete/`);
                      setClients(clients.map(cl => cl.id === c.id ? { ...cl, status: 'completed', progress: 100 } : cl));
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  title={t('تم الإكمال', 'Mark as Completed')}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </Button>}
                <Button variant="ghost" size="icon" onClick={() => deleteClient(c.id)} title={t('حذف العميل', 'Delete Client')}><Trash2 className="h-4 w-4 text-red-600" /></Button>
              </>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl">{t('لوحة تحكم المدير', 'Admin Dashboard')}</h1>
            <p className="text-gray-500">{t('مرحباً، مدير النظام', 'Welcome, Administrator')}</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white" onClick={() => setModalCreate(true)}>
              <Plus className="mr-2 h-4 w-4" /> {t('إنشاء حساب عميل', 'New Client')}
            </Button>
            <Button variant="outline" onClick={() => { localStorage.clear(); window.location.href = '/#login'; }}>
              <LogOut className="mr-2 h-4 w-4" /> {t('خروج', 'Logout')}
            </Button>
          </div>
        </div>
      </div>

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
                {renderTable(clients.filter(c => c.status === 'active'))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="p-6">
                {renderTable(clients.filter(c => c.status === 'completed'), { completed: true })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {modalChat && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg p-4 flex flex-col">

              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="font-bold">
                  {t('محادثة مع', 'Chat with')} {modalChat.username}
                </h3>
                <Button size="sm" variant="ghost" onClick={() => setModalChat(null)}>✕</Button>
              </div>

              <div ref={chatRef} className="flex-1 overflow-y-auto space-y-2 mb-3">
                {modalChat.messages?.map(m => (
                  <div
                    key={m.id}
                    className={`p-2 rounded-lg max-w-[75%] ${m.sender === 'admin'
                        ? 'bg-yellow-200 ml-auto text-right'
                        : 'bg-gray-200 mr-auto'
                      }`}
                  >
                    <p>{m.content}</p>
                    <small className="text-xs text-gray-500">
                      {new Date(m.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t('اكتب رسالة...', 'Type message...')}
                />
<Button onClick={async () => {
  if (!modalChat) return alert("العميل غير محدد");

  try {
    await api.post('messages/', {
      content: message,       // النص اللي هيتبعت
      client_id: modalChat.id // هنا المهم
    });
    setMessage(''); // امسح الصندوق بعد الإرسال
    // ممكن تحدث الرسائل مباشرة بعد الإرسال
    const newMessage = message; // احفظ القيمة أولاً
    setMessage('');
    setModalChat(prev => prev ? { ...prev, messages: [...(prev.messages || []), { id: Date.now(), sender: 'admin', content: newMessage, timestamp: new Date().toISOString() }] } : null);
  } catch (err) {
    console.error('Error sending message:', err);
    alert('حدث خطأ أثناء إرسال الرسالة');
  }
}}>
  إرسال
</Button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* -------------------- Modal Create Client -------------------- */}
      {modalCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl mb-4">{t('إنشاء عميل جديد', 'Create New Client')}</h2>
            <div className="space-y-3">
              <Input placeholder={t('اسم المشروع', 'Project Title')} value={form.project_title} onChange={(e) => setForm({ ...form, project_title: e.target.value })} />
              <Input placeholder={t('اسم المستخدم', 'Username')} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              <Input type="password" placeholder={t('كلمة المرور', 'Password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Input type="number" placeholder={t('الميزانية', 'Budget')} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
              <Input placeholder={t('الهاتف (اختياري)', 'Phone (Optional)')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder={t('العنوان (اختياري)', 'Address (Optional)')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input type="date" placeholder="Start Date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              <Input type="date" placeholder="Expected End Date" value={form.expected_end_date} onChange={(e) => setForm({ ...form, expected_end_date: e.target.value })} />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setModalCreate(false)}>{t('إلغاء', 'Cancel')}</Button>
                <Button onClick={createClient} className="bg-[#D4AF37] text-white">{t('إنشاء', 'Create')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}