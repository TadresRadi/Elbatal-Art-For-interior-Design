import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Avatar } from '../components/ui/avatar';
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
import { useState } from 'react';
import { Textarea } from '../components/ui/textarea';

export function ClientDashboard() {
  const { t, language } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'admin',
      text: {
        ar: 'مرحباً! كيف يمكننا مساعدتك اليوم؟',
        en: 'Hello! How can we help you today?',
      },
      time: '10:30 AM',
    },
    {
      id: 2,
      from: 'client',
      text: {
        ar: 'أريد الاستفسار عن تقدم المشروع',
        en: 'I want to inquire about the project progress',
      },
      time: '10:35 AM',
    },
    {
      id: 3,
      from: 'admin',
      text: {
        ar: 'المشروع يسير بشكل ممتاز، تم إنجاز 75% من الأعمال',
        en: 'The project is going excellently, 75% of the work has been completed',
      },
      time: '10:40 AM',
    },
  ]);

  const projectData = {
    name: { ar: 'تشطيب فيلا - القاهرة الجديدة', en: 'Villa Finishing - New Cairo' },
    progress: 75,
    startDate: '2025-08-01',
    expectedEnd: '2025-11-30',
    status: { ar: 'جاري العمل', en: 'In Progress' },
  };

  const expenses = [
    {
      id: 1,
      date: '2025-10-01',
      description: { ar: 'دفعة مقدمة', en: 'Advance Payment' },
      amount: 50000,
      status: 'paid',
    },
    {
      id: 2,
      date: '2025-09-01',
      description: { ar: 'أعمال السباكة', en: 'Plumbing Works' },
      amount: 15000,
      status: 'paid',
    },
    {
      id: 3,
      date: '2025-09-15',
      description: { ar: 'الأعمال الكهربائية', en: 'Electrical Works' },
      amount: 20000,
      status: 'paid',
    },
    {
      id: 4,
      date: '2025-10-05',
      description: { ar: 'أعمال الدهانات', en: 'Painting Works' },
      amount: 12000,
      status: 'pending',
    },
    {
      id: 5,
      date: '2025-10-20',
      description: { ar: 'الأرضيات', en: 'Flooring' },
      amount: 25000,
      status: 'upcoming',
    },
  ];

  const totalPaid = expenses
    .filter((e) => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          from: 'client',
          text: { ar: message, en: message },
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setMessage('');
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
                {t('مرحباً، أحمد محمد', 'Welcome, Ahmed Mohamed')}
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
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Home className="h-6 w-6 text-[#D4AF37]" />
                  <h2 className="text-xl text-[#1A1A1A] dark:text-white">
                    {projectData.name[language]}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {t('البداية:', 'Start:')} {projectData.startDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {t('الانتهاء المتوقع:', 'Expected End:')} {projectData.expectedEnd}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">
                {projectData.status[language]}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  {t('نسبة الإنجاز', 'Progress')}
                </span>
                <span className="text-2xl text-[#D4AF37]">{projectData.progress}%</span>
              </div>
              <Progress value={projectData.progress} className="h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t(
                  'المشروع يسير وفقاً للجدول الزمني المحدد',
                  'The project is on schedule'
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                          <TableCell>{expense.description[language]}</TableCell>
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
                        msg.from === 'client' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.from === 'client'
                            ? 'bg-[#D4AF37] text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{msg.text[language]}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.from === 'client'
                              ? 'text-white/70'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {msg.time}
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
    </div>
  );
}
