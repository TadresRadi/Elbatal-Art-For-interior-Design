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
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Textarea } from '../components/ui/textarea';
import api from '../lib/api';

export function ClientDashboard() {
  const { t, language, setLanguage, theme, setTheme } = useApp();
  
  // IMMEDIATE AUTHENTICATION CHECK - Runs before any rendering
  // Only check if we're not on the login page
  if (window.location.hash !== '#login') {
    const accessToken = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!accessToken || !user || user.role !== 'client') {
      // Redirect immediately without rendering anything
      window.location.replace('#login');
      return null;
    }
  }
  
  // Check if user is authenticated and is client
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      window.location.replace('#login');
      return;
    }
    
    if (user.role !== 'client') {
      window.location.replace('#login');
      return;
    }
  }, []);

  // Additional check for browser history navigation
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      // If no tokens or user, redirect to login immediately
      if (!accessToken || !user || user.role !== 'client') {
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

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint if available
      await api.post('logout/');
    } catch (err) {
      // Continue with logout even if backend call fails
      console.error('Logout API call failed:', err);
    } finally {
      // Clear all authentication data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.clear();
      
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
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [postDiscussionExpenses, setPostDiscussionExpenses] = useState<any[]>([]);
  const [postDiscussionPayments, setPostDiscussionPayments] = useState<any[]>([]);
  const [discussionCompleted, setDiscussionCompleted] = useState(false);
  
  // Version state variables
  const [expenseVersions, setExpenseVersions] = useState<any[]>([]);
  const [paymentVersions, setPaymentVersions] = useState<any[]>([]);
  const [expensesDiscussionCompleted, setExpensesDiscussionCompleted] = useState(false);
  const [paymentsDiscussionCompleted, setPaymentsDiscussionCompleted] = useState(false);
  const [expensesDiscussionCompletedAt, setExpensesDiscussionCompletedAt] = useState<string | null>(null);
  const [paymentsDiscussionCompletedAt, setPaymentsDiscussionCompletedAt] = useState<string | null>(null);
  const [collapsedVersions, setCollapsedVersions] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await api.get('client/dashboard/');
        
        if (dashboardRes.data.project) {
          setProjectData(dashboardRes.data.project);
          // Set separate discussion completed states
          setExpensesDiscussionCompleted(dashboardRes.data.project.expenses_discussion_completed || false);
          setPaymentsDiscussionCompleted(dashboardRes.data.project.payments_discussion_completed || false);
          setExpensesDiscussionCompletedAt(dashboardRes.data.project.expenses_discussion_completed_at || null);
          setPaymentsDiscussionCompletedAt(dashboardRes.data.project.payments_discussion_completed_at || null);
        }
        
        // Get user info for client_id
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const clientId = user.client_id;
        
        if (clientId) {
          // Load expense versions using client endpoints
          try {
            const expenseVersionsRes = await api.get(`client/expense-versions/`);
            const expenseVersionsData = expenseVersionsRes.data;
            setExpenseVersions(expenseVersionsData);
            
            // Load payment versions using client endpoints
            const paymentVersionsRes = await api.get(`client/payment-versions/`);
            const paymentVersionsData = paymentVersionsRes.data;
            setPaymentVersions(paymentVersionsData);
            
            // Fetch current expenses (all expenses for the current/new table)
            const expensesRes = await api.get('expenses/');
            const allExpenses = expensesRes.data;
            
            // Fetch current payments (cash receipts)
            const paymentsRes = await api.get('client/payments/');
            const allPayments = paymentsRes.data;
            
            // For client side: 
            // - If discussion completed, show versioned tables (old data) + current table (new data ONLY)
            // - If not completed, show current table (all data)
            
            if (dashboardRes.data.project?.expenses_discussion_completed) {
              // Get the latest expense version to determine what's "old"
              const latestExpenseVersion = expenseVersionsData[expenseVersionsData.length - 1];
              if (latestExpenseVersion) {
                // The versioned data is already stored in the version, so current table should only show new items
                // Filter expenses created AFTER the latest discussion completion
                const discussionDate = new Date(latestExpenseVersion.discussion_completed_at);
                const newExpenses = allExpenses.filter((exp: any) => {
                  const expDate = new Date(exp.created_at);
                  return expDate > discussionDate; // Use > instead of >= to be more precise
                });
                
                setPostDiscussionExpenses(newExpenses);
                setExpenses([]); // Clear old expenses since they're in versions
              } else {
                setExpenses(allExpenses);
                setPostDiscussionExpenses([]);
              }
            } else {
              setExpenses(allExpenses);
              setPostDiscussionExpenses([]);
            }
            
            if (dashboardRes.data.project?.payments_discussion_completed) {
              // Get the latest payment version to determine what's "old"
              const latestPaymentVersion = paymentVersionsData[paymentVersionsData.length - 1];
              if (latestPaymentVersion) {
                // The versioned data is already stored in the version, so current table should only show new items
                // Filter payments created AFTER the latest discussion completion
                const discussionDate = new Date(latestPaymentVersion.discussion_completed_at);
                const newPayments = allPayments.filter((pay: any) => {
                  const payDate = new Date(pay.created_at);
                  return payDate > discussionDate; // Use > instead of >= to be more precise
                });
                
                setPostDiscussionPayments(newPayments);
                setPayments([]); // Clear old payments since they're in versions
              } else {
                setPayments(allPayments);
                setPostDiscussionPayments([]);
              }
            } else {
              setPayments(allPayments);
              setPostDiscussionPayments([]);
            }
          } catch (err) {
            // Error handling is done by the API service
          }
        }

        // Get client's own messages
        if (user.client_id) {
          const messagesRes = await api.get(`messages/?client=${user.client_id}`);
          setMessages(messagesRes.data);
        }
      } catch (error: any) {
    // Error handling is done by the API service
    if (error.response?.status === 401) {
      alert('Session expired, please login again.');
      window.location.hash = '#home';
    }
  }
    };

    fetchData();
    
    // Set up polling to check for new versions every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const totalPaid = payments.reduce((sum: any, payment: any) => {
    const amount = parseFloat(String(payment.amount)) || 0;
    return sum + amount;
  }, 0);

  const totalPostDiscussionPayments = postDiscussionPayments.reduce((sum: any, payment: any) => {
    const amount = parseFloat(String(payment.amount)) || 0;
    return sum + amount;
  }, 0);

  // Calculate total payments from all payment versions
  const totalPaymentVersions = paymentVersions.reduce((sum: any, version: any) => {
    const versionTotal = version.payments_data?.reduce((versionSum: number, pay: any) => {
      return versionSum + (parseFloat(String(pay.amount)) || 0);
    }, 0) || 0;
    return sum + versionTotal;
  }, 0);

  // Total paid includes all payments from all tables
  const totalPaidAll = totalPaid + totalPostDiscussionPayments + totalPaymentVersions;

  const totalExpenses = expenses.reduce((sum: any, expense: any) => {
    const amount = parseFloat(String(expense.amount)) || 0;
    return sum + amount;
  }, 0);

  const totalPostDiscussionExpenses = postDiscussionExpenses.reduce((sum: any, expense: any) => {
    const amount = parseFloat(String(expense.amount)) || 0;
    return sum + amount;
  }, 0);

  // Calculate total expenses from all expense versions
  const totalExpenseVersions = expenseVersions.reduce((sum: any, version: any) => {
    const versionTotal = version.expenses_data?.reduce((versionSum: number, exp: any) => {
      return versionSum + (parseFloat(String(exp.amount)) || 0);
    }, 0) || 0;
    return sum + versionTotal;
  }, 0);

  // Total cost includes all expenses from all tables
  const totalCost = totalExpenses + totalPostDiscussionExpenses + totalExpenseVersions;

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
      // Error handling is done by the API service
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

  const handleToggleVersion = (versionKey: string) => {
    setCollapsedVersions(prev => ({
      ...prev,
      [versionKey]: !prev[versionKey]
    }));
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
                  onClick={handleLogout}
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
                    {formatCurrency(totalCost)}
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
                    {formatCurrency(totalPaidAll)}
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
                    {formatCurrency(totalPaidAll - totalCost)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Section */}
        <div className="lg:col-span-2 mb-8">
          {/* Expense Versions - Individual Tables */}
          {expensesDiscussionCompleted && expenseVersions.length > 0 && (
            <div className="space-y-4 mb-6">
              {expenseVersions.map((version, index) => {
                const versionKey = `expenses_${version.id}`;
                const isVersionCollapsed = collapsedVersions[versionKey] !== false; // Default to collapsed
                return (
                  <Card key={version.id} className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 
                          className="text-md font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-600"
                          onClick={() => handleToggleVersion(versionKey)}
                        >
                          {t('المصروفات', 'Expenses')} {version.version_number}
                          <span className="text-sm text-green-600 ml-2">
                            ({t('النقاش مكتمل', 'Discussion Completed')})
                          </span>
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(version.discussion_completed_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleVersion(versionKey)}
                              className="text-gray-600 border-gray-600"
                            >
                              {isVersionCollapsed ? t('توسيع', 'Expand') : t('طي', 'Collapse')}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {!isVersionCollapsed && (
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
                              {version.expenses_data.map((expense: any) => (
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
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={2} className="font-semibold">
                                  {t('إجمالي المصروفات', 'Expenses Total')} {version.version_number}
                                </TableCell>
                                <TableCell className="font-semibold text-lg text-gray-600">
                                  {formatCurrency(version.expenses_data.reduce((sum: number, exp: any) => sum + (parseFloat(String(exp.amount)) || 0), 0))}
                                </TableCell>
                                <TableCell colSpan={2}></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Current/New Expenses Table */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className={`text-xl ${expensesDiscussionCompleted ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'} dark:text-white`}>
                    {expensesDiscussionCompleted 
                      ? t('مصروفات جديدة', 'New Expenses')
                      : t('جدول المصروفات', 'Expenses Table')
                    }
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
                    {(expensesDiscussionCompleted ? postDiscussionExpenses : expenses).map((expense) => (
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
                    {(expensesDiscussionCompleted ? postDiscussionExpenses : expenses).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          {expensesDiscussionCompleted 
                            ? t('لا توجد مصروفات جديدة', 'No new expenses')
                            : t('لا توجد مصروفات مسجلة', 'No expenses recorded')
                          }
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
                        {formatCurrency((expensesDiscussionCompleted ? postDiscussionExpenses : expenses).reduce((sum: number, exp: any) => sum + (parseFloat(String(exp.amount)) || 0), 0))}
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Section */}
        <div className="lg:col-span-2">
          {/* Payment Versions - Individual Tables */}
          {paymentsDiscussionCompleted && paymentVersions.length > 0 && (
            <div className="space-y-4 mb-6">
              {paymentVersions.map((version, index) => {
                const versionKey = `payments_${version.id}`;
                const isVersionCollapsed = collapsedVersions[versionKey] !== false; // Default to collapsed
                return (
                  <Card key={version.id} className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 
                          className="text-md font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-600"
                          onClick={() => handleToggleVersion(versionKey)}
                        >
                          {t('المدفوعات', 'Payments')} {version.version_number}
                          <span className="text-sm text-green-600 ml-2">
                            ({t('النقاش مكتمل', 'Discussion Completed')})
                          </span>
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(version.discussion_completed_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleVersion(versionKey)}
                              className="text-gray-600 border-gray-600"
                            >
                              {isVersionCollapsed ? t('توسيع', 'Expand') : t('طي', 'Collapse')}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {!isVersionCollapsed && (
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
                              {version.payments_data.map((payment: any) => (
                                <TableRow key={payment.id}>
                                  <TableCell>{formatDate(payment.date)}</TableCell>
                                  <TableCell className="font-semibold text-green-600">
                                    {formatCurrency(payment.amount)}
                                  </TableCell>
                                  <TableCell>{t('إيصال نقدية', 'Cash Receipt')}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell className="font-semibold">
                                  {t('إجمالي المدفوعات', 'Payments Total')} {version.version_number}
                                </TableCell>
                                <TableCell className="font-semibold text-lg text-green-600">
                                  {formatCurrency(version.payments_data.reduce((sum: number, pay: any) => sum + (parseFloat(String(pay.amount)) || 0), 0))}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Current/New Payments Table */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl ${paymentsDiscussionCompleted ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'} dark:text-white`}>
                  {paymentsDiscussionCompleted 
                    ? t('مدفوعات جديدة', 'New Payments')
                    : t('جدول المدفوعات', 'Payments Table')
                  }
                </h3>
              </div>
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
                    {(paymentsDiscussionCompleted ? postDiscussionPayments : payments).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>{t('إيصال نقدية', 'Cash Receipt')}</TableCell>
                      </TableRow>
                    ))}
                    {(paymentsDiscussionCompleted ? postDiscussionPayments : payments).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                          {paymentsDiscussionCompleted 
                            ? t('لا توجد مدفوعات جديدة', 'No new payments')
                            : t('لا توجد مدفوعات مسجلة', 'No payments recorded')
                          }
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
                        {formatCurrency((paymentsDiscussionCompleted ? postDiscussionPayments : payments).reduce((sum: number, pay: any) => sum + (parseFloat(String(pay.amount)) || 0), 0))}
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
