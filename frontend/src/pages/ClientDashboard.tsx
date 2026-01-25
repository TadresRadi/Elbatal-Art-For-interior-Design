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
  TableFooter,
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
  FileText,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Textarea } from '../components/ui/textarea';
import api from '../lib/api';

export function ClientDashboard() {
  const { t, language, setLanguage, theme, setTheme } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [postDiscussionExpenses, setPostDiscussionExpenses] = useState<any[]>([]);
  const [postDiscussionPayments, setPostDiscussionPayments] = useState<any[]>([]);
  const [discussionCompleted, setDiscussionCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await api.get('client/dashboard/');
        
        if (dashboardRes.data.project) {
          setProjectData(dashboardRes.data.project);
          // Set discussion completed status from project data
          if (dashboardRes.data.project.discussion_completed) {
            setDiscussionCompleted(true);
          }
        }
        
        // Fetch expenses
        try {
          const expensesRes = await api.get('expenses/');
          setExpenses(expensesRes.data);
        } catch (err) {
          console.error('Error loading expenses:', err);
        }
        
        // Fetch payments (cash receipts)
        try {
          const paymentsRes = await api.get('client/payments/');
          setPayments(paymentsRes.data);
        } catch (err: any) {
          console.error('Error loading payments:', err);
        }
        
        if (dashboardRes.data.expenses) {
          setExpenses(dashboardRes.data.expenses);
        } else {
          // No expenses data found
        }

        // Get client's own messages
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.client_id) {
          const messagesRes = await api.get(`messages/?client_id=${user.client_id}`);
          setMessages(messagesRes.data);
        }
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

  const totalPaid = payments.reduce((sum, payment) => {
    const amount = parseFloat(String(payment.amount)) || 0;
    return sum + amount;
  }, 0);

  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = parseFloat(String(expense.amount)) || 0;
    return sum + amount;
  }, 0);

const handleSendMessage = async () => {
  if (!message.trim()) return;

  try {
    // Get user info to extract client_id
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const res = await api.post('messages/', {
      content: message,
      client: user?.client_id  // Changed from client_id to client
    });

    setMessages([...messages, res.data]);
    setMessage('');
  } catch (error: any) {
    console.error('Error:', error);
    console.error('Error response:', error.response);
    console.error('Error data:', error.response?.data);
    alert(t('فشل إرسال الرسالة', 'Failed to send message'));
  }
};

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      {/* Client Dashboard Header with Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl text-[#1A1A1A] dark:text-white">
                {t('لوحة تحكم العميل', 'Client Dashboard')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {projectData
                  ? language === 'ar' 
                    ? `مرحباً، ${projectData.client_username || projectData.client_name || projectData.user?.username || ''}`
                    : `Welcome, ${projectData.client_username || projectData.client_name || projectData.user?.username || ''}`
                  : t('مرحباً', 'Welcome')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-8">
                <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
                  {t('الرئيسية', 'Home')}
                </a>
                <a href="#works" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
                  {t('أعمالنا', 'Our Works')}
                </a>
                <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
                  {t('من نحن', 'About Us')}
                </a>
                <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
                  {t('خدماتنا', 'Services')}
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
                  {t('تواصل معنا', 'Contact Us')}
                </a>
              </nav>
              
              {/* Language and Theme Toggle - Matching Header Design */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                >
                  <Globe className="h-5 w-5" />
                  <span className="ml-1 text-xs">{language === 'ar' ? 'EN' : 'AR'}</span>
                </Button>

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
                        {projectData.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {projectData.client_address} - {t('Phone', 'رقم الهاتف')}: {projectData.client_phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {t('البداية:', 'Start:')} {projectData.start_date ? formatDate(projectData.start_date) : t('غير محدد', 'Not set')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {t('الانتهاء المتوقع:', 'Expected End:')} {projectData.expected_end_date ? formatDate(projectData.expected_end_date) : t('غير محدد', 'Not set')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
                  {projectData.status === 'active' ? t('نشط', 'Active') : projectData.status === 'completed' ? t('مكتمل', 'Completed') : projectData.status}
                </div>
              </div>
            ) : (
              <p>{t('جاري تحميل بيانات المشروع...', 'Loading project data...')}</p>
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
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 mb-3">
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
                    {formatCurrency(totalPaid - totalExpenses)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <div className="lg:col-span-2 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className={`text-xl ${discussionCompleted ? 'text-green-600' : 'text-[#1A1A1A]'} dark:text-white`}>
                    {t('جدول المصروفات', 'Expenses Table')}
                    {discussionCompleted && (
                      <span className="text-sm text-green-600 ml-2">
                        ({t('تم النقاش', 'Discussion Completed')})
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('التاريخ', 'Date')}</TableHead>
                      <TableHead>{t('الوصف', 'Description')}</TableHead>
                      <TableHead>{t('المبلغ', 'Amount')}</TableHead>
                      <TableHead>{t('الحالة', 'Status')}</TableHead>
                      <TableHead>{t('فاتورة', 'Bill')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              expense.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'text-white'
                            }`}
                          >
                            {t(expense.status, expense.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {expense.bill_url ? (
                            <a
                              href={expense.bill_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              {t('عرض', 'View')}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {expenses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          {t('لا توجد مصروفات مسجلة', 'No expenses recorded')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="font-semibold">
                        {t('الإجمالي', 'Total')}
                      </TableCell>
                      <TableCell className="font-semibold text-lg">
                        {formatCurrency(expenses.reduce((sum: number, exp: any) => sum + (parseFloat(String(exp.amount)) || 0), 0))}
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              {discussionCompleted && (
                <div className="mt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">
                      {t('مصروفات جديدة بعد النقاش', 'New Expenses After Discussion')}
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('التاريخ', 'Date')}</TableHead>
                            <TableHead>{t('الوصف', 'Description')}</TableHead>
                            <TableHead>{t('المبلغ', 'Amount')}</TableHead>
                            <TableHead>{t('الحالة', 'Status')}</TableHead>
                            <TableHead>{t('فاتورة', 'Bill')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {postDiscussionExpenses.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                {t('لا توجد مصروفات جديدة بعد النقاش', 'No new expenses after discussion')}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={2} className="font-semibold">
                              {t('إجمالي المصروفات الجديدة', 'New Expenses Total')}
                            </TableCell>
                            <TableCell className="font-semibold text-lg text-blue-600">
                              {formatCurrency(postDiscussionExpenses.reduce((sum: number, exp: any) => sum + (parseFloat(String(exp.amount)) || 0), 0))}
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl mb-4 text-[#1A1A1A] dark:text-white">
                {t('جدول المدفوعات', 'Payments Table')}
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('التاريخ', 'Date')}</TableHead>
                      <TableHead>{t('المبلغ', 'Amount')}</TableHead>
                      <TableHead>{t('الوصف', 'Description')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>{t('إيصال نقدية', 'Cash Receipt')}</TableCell>
                      </TableRow>
                    ))}
                    {payments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                          {t('لا توجد مدفوعات مسجلة', 'No payments recorded')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-semibold">
                        {t('الإجمالي', 'Total')}
                      </TableCell>
                      <TableCell className="font-semibold text-lg text-green-600">
                        {formatCurrency(totalPaid)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        <div className="h-[600px] flex flex-col">
          <Card className="bg-white dark:bg-gray-800 flex-1 flex flex-col overflow-hidden">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <MessageSquare className="h-6 w-6 text-[#D4AF37]" />
                <h3 className="text-xl text-[#1A1A1A] dark:text-white">
                  {t('المحادثة', 'Chat')}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4" style={{ maxHeight: 'calc(100% - 180px)' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'client' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg break-words ${
                        msg.sender === 'client'
                          ? 'bg-[#D4AF37] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                      {msg.file_url && (
                        <div className="mt-2">
                          {msg.file_url.match(new RegExp('\\.(jpg|jpeg|png|gif)$', 'i')) ? (
                            <img
                              src={msg.file_url}
                              alt="Attachment"
                              className="max-w-full h-auto rounded-lg cursor-pointer"
                              onClick={() => window.open(msg.file_url, '_blank')}
                            />
                          ) : msg.file_url.match(new RegExp('\\.pdf$', 'i')) ? (
                            <a
                              href={msg.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
                            >
                              📄 {t('عرض PDF', 'View PDF')}
                            </a>
                          ) : (
                            <a
                              href={msg.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
                            >
                              📎 {t('عرض الملف', 'View File')}
                            </a>
                          )}
                        </div>
                      )}
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
