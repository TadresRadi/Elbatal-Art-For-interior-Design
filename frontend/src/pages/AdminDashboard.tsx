import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  LogOut,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Search,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#D4AF37', '#B8941F', '#F4E4B8', '#C9A961'];

export function AdminDashboard() {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalClients: 45,
    activeProjects: 12,
    completedProjects: 33,
    totalRevenue: 2500000,
    monthlyRevenue: 350000,
  };

  const projectsData = [
    { name: language === 'ar' ? 'يناير' : 'Jan', projects: 4 },
    { name: language === 'ar' ? 'فبراير' : 'Feb', projects: 3 },
    { name: language === 'ar' ? 'مارس' : 'Mar', projects: 5 },
    { name: language === 'ar' ? 'أبريل' : 'Apr', projects: 4 },
    { name: language === 'ar' ? 'مايو' : 'May', projects: 6 },
    { name: language === 'ar' ? 'يونيو' : 'Jun', projects: 5 },
  ];

  const statusData = [
    {
      name: language === 'ar' ? 'جاري العمل' : 'In Progress',
      value: 12,
    },
    {
      name: language === 'ar' ? 'مكتمل' : 'Completed',
      value: 33,
    },
    {
      name: language === 'ar' ? 'معلق' : 'Pending',
      value: 5,
    },
  ];

  const clients = [
    {
      id: 1,
      name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
      project: { ar: 'فيلا - القاهرة الجديدة', en: 'Villa - New Cairo' },
      progress: 75,
      status: 'active',
      budget: 150000,
    },
    {
      id: 2,
      name: { ar: 'سارة أحمد', en: 'Sara Ahmed' },
      project: { ar: 'شقة - المعادي', en: 'Apartment - Maadi' },
      progress: 40,
      status: 'active',
      budget: 80000,
    },
    {
      id: 3,
      name: { ar: 'محمود حسن', en: 'Mahmoud Hassan' },
      project: { ar: 'مكتب - التجمع', en: 'Office - Assembly' },
      progress: 90,
      status: 'active',
      budget: 120000,
    },
    {
      id: 4,
      name: { ar: 'فاطمة علي', en: 'Fatma Ali' },
      project: { ar: 'فيلا - الشيخ زايد', en: 'Villa - Sheikh Zayed' },
      progress: 100,
      status: 'completed',
      budget: 200000,
    },
    {
      id: 5,
      name: { ar: 'خالد أحمد', en: 'Khaled Ahmed' },
      project: { ar: 'شقة - 6 أكتوبر', en: 'Apartment - 6 October' },
      progress: 25,
      status: 'active',
      budget: 70000,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl text-[#1A1A1A] dark:text-white">
                {t('لوحة تحكم المدير', 'Admin Dashboard')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('مرحباً، مدير النظام', 'Welcome, Administrator')}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.hash = '#home')}
            >
              <LogOut className="mr-2 h-5 w-5" />
              {t('خروج', 'Logout')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t('نظرة عامة', 'Overview')}</TabsTrigger>
            <TabsTrigger value="clients">{t('العملاء', 'Clients')}</TabsTrigger>
            <TabsTrigger value="chat">{t('المحادثات', 'Messages')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('إجمالي العملاء', 'Total Clients')}
                      </p>
                      <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
                        {stats.totalClients}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('مشاريع نشطة', 'Active Projects')}
                      </p>
                      <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
                        {stats.activeProjects}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('مشاريع مكتملة', 'Completed')}
                      </p>
                      <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
                        {stats.completedProjects}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('الإيرادات الشهرية', 'Monthly Revenue')}
                      </p>
                      <h3 className="text-xl text-[#1A1A1A] dark:text-white">
                        {formatCurrency(stats.monthlyRevenue)}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('إجمالي الإيرادات', 'Total Revenue')}
                      </p>
                      <h3 className="text-xl text-[#1A1A1A] dark:text-white">
                        {formatCurrency(stats.totalRevenue)}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl mb-6 text-[#1A1A1A] dark:text-white">
                    {t('المشاريع حسب الشهر', 'Projects by Month')}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="projects" fill="#D4AF37" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl mb-6 text-[#1A1A1A] dark:text-white">
                    {t('حالة المشاريع', 'Project Status')}
                  </h3>
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
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-[#1A1A1A] dark:text-white">
                    {t('إدارة العملاء', 'Client Management')}
                  </h3>
                  <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
                    <Plus className="mr-2 h-5 w-5" />
                    {t('إضافة عميل', 'Add Client')}
                  </Button>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={t('بحث عن عميل...', 'Search for client...')}
                      className="pl-10 rtl:pr-10 rtl:pl-4"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('الاسم', 'Name')}</TableHead>
                        <TableHead>{t('المشروع', 'Project')}</TableHead>
                        <TableHead>{t('التقدم', 'Progress')}</TableHead>
                        <TableHead>{t('الميزانية', 'Budget')}</TableHead>
                        <TableHead>{t('الحالة', 'Status')}</TableHead>
                        <TableHead>{t('الإجراءات', 'Actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>{client.name[language]}</TableCell>
                          <TableCell>{client.project[language]}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-[#D4AF37] h-2 rounded-full"
                                  style={{ width: `${client.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{client.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(client.budget)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                client.status === 'active'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }
                            >
                              {client.status === 'active'
                                ? t('نشط', 'Active')
                                : t('مكتمل', 'Completed')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl mb-6 text-[#1A1A1A] dark:text-white">
                  {t('إدارة المحادثات', 'Message Management')}
                </h3>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>
                    {t(
                      'اختر عميلاً من القائمة لبدء المحادثة',
                      'Select a client from the list to start chatting'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
