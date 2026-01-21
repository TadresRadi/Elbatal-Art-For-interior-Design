import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
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
  Home,
  Clock,
  DollarSign,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Textarea } from '../components/ui/textarea';
import api from '../lib/api';

export function ClientDashboard() {
  const { t, language } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await api.get('projects/');
        console.log('PROJECT RESPONSE:', projectRes.data);
        setProjectData(projectRes.data[0] || null);

        const expensesRes = await api.get('expenses/');
        setExpenses(expensesRes.data);

        const messagesRes = await api.get('messages/');
        setMessages(messagesRes.data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          alert('Session expired, please login again.');
          window.location.hash = '#home';
        }
      }
    };

    fetchData();
  }, []);

  const totalPaid = expenses
    .filter((e) => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

const handleSendMessage = async () => {
  if (!message.trim()) return;

  try {
    const res = await api.post('messages/', {
      content:  message
    });

    setMessages([... messages, res.data]);
    setMessage('');
  } catch (error: any) {
    console.error('Error:', error);
    alert(t('فشل إرسال الرسالة', 'Failed to send message'));
  }
};

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
          {t('لوحة تحكم العميل', 'Client Dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
{projectData
  ? t('مرحباً، {{name}}', `Welcome, ${projectData.client_username || projectData.client_name || projectData.user?.username }`)
  : t('مرحباً', 'Welcome')}
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
        {/* Project Overview */}
        <Card className="mb-8 bg-white dark:bg-gray-800 luxury-shadow">
          <CardContent className="p-6">
            {projectData ? (
              <div className="flex items-start justify-between mb-6">
                <div>
<div className="flex items-center gap-3 mb-2">
  <Home className="h-6 w-6 text-[#D4AF37]" />
  <div>
    <h2 className="text-xl text-[#1A1A1A] dark:text-white">
      {projectData.title} {/* اسم المشروع */}
    </h2>
    {/* هنا حطينا العنوان والهاتف جنب بعض */}
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {projectData.client_address} - {t('Phone', 'رقم الهاتف')}: {projectData.client_phone}
    </p>
  </div>
</div>
<div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
  <div className="flex items-center gap-2">
    <Clock className="h-4 w-4" />
<span>
  {t('البداية:', 'Start:')} {projectData.start_date || t('غير محدد','Not set')}
</span>
  </div>
  <div className="flex items-center gap-2">
    <Clock className="h-4 w-4" />
<span>
  {t('الانتهاء المتوقع:', 'Expected End:')} {projectData.expected_end_date || t('غير محدد','Not set')}
</span>
  </div>
</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
                  {projectData.status}
                </div>
              </div>
            ) : (
              <p>Loading project data...</p>
            )}

            {projectData && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t('نسبة الإنجاز', 'Progress')}
                  </span>
                  <span className="text-2xl text-[#D4AF37]">
                    {projectData.progress}%
                  </span>
                </div>
                <Progress value={projectData.progress} className="h-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(
                    'المشروع يسير وفقاً للجدول الزمني المحدد',
                    'The project is on schedule'
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('إجمالي التكلفة', 'Total Cost')}
                  </p>
                  <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
                    {formatCurrency(totalExpenses)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('المدفوع', 'Paid')}
                  </p>
                  <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
                    {formatCurrency(totalPaid)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('المتبقي', 'Remaining')}
                  </p>
                  <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
                    {formatCurrency(totalExpenses - totalPaid)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

         {projectData && (
  <Card className="bg-white dark:bg-gray-800">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t('الميزانية', 'Budget')}
          </p>
          <h3 className="text-2xl text-[#1A1A1A] dark:text-white">
            {formatCurrency(parseFloat(projectData.client_budget || '0'))}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </CardContent>
  </Card>
)} 
        </div>

        {/* Expenses Table */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl mb-4 text-[#1A1A1A] dark:text-white">
                {t('جدول المصروفات', 'Expenses Table')}
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('التاريخ', 'Date')}</TableHead>
                      <TableHead>{t('الوصف', 'Description')}</TableHead>
                      <TableHead>{t('المبلغ', 'Amount')}</TableHead>
                      <TableHead>{t('الحالة', 'Status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              expense.status === 'paid'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : expense.status === 'pending'
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {expense.status === 'paid'
                              ? t('مدفوع', 'Paid')
                              : expense.status === 'pending'
                              ? t('معلق', 'Pending')
                              : t('قادم', 'Upcoming')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        <div>
          <Card className="bg-white dark:bg-gray-800 h-[600px] flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <MessageSquare className="h-6 w-6 text-[#D4AF37]" />
                <h3 className="text-xl text-[#1A1A1A] dark:text-white">
                  {t('المحادثة', 'Chat')}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'client' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'client'
                          ? 'bg-[#D4AF37] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'client'
                            ? 'text-white/70'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('اكتب رسالتك...', 'Type your message...')}
                  className="flex-1 min-h-[60px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
