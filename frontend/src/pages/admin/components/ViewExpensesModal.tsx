import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '../../../components/ui/table';
import { Card, CardContent } from '../../../components/ui/card';
import { FileText, X, Printer, DollarSign, Eye, Plus } from 'lucide-react';
import type { Translate, Expense } from '../types';
import api from '../../../lib/api';

type ViewExpensesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  client: { id: number; name: string; username: string } | null;
  t: Translate;
};

export function ViewExpensesModal({ isOpen, onClose, client, t }: ViewExpensesModalProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printType, setPrintType] = useState<'expenses' | 'payments'>('expenses');

  useEffect(() => {
    if (isOpen && client) {
      loadData();
    }
  }, [isOpen, client]);

  const loadData = async () => {
    if (!client) return;
    setLoading(true);
    try {
      // Load expenses
      const expensesRes = await api.get(`admin/expenses/?client_id=${client.id}`);
      setExpenses(expensesRes.data);
      
      // Load payments (cash receipts)
      const paymentsRes = await api.get(`admin/payments/?client_id=${client.id}`);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const res = await api.get(`admin/expenses/?client_id=${client.id}`);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const res = await api.get(`admin/payments/?client_id=${client.id}`);
      setPayments(res.data);
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'EGP 0.00';
    }
    const formatted = new Intl.NumberFormat('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `EGP ${formatted}`;
  };

  const totalAmount = expenses.reduce((sum, expense) => {
    const amount = parseFloat(String(expense.amount)) || 0;
    return sum + amount;
  }, 0);

  const totalPayments = payments.reduce((sum, payment) => {
    const amount = parseFloat(String(payment.amount)) || 0;
    return sum + amount;
  }, 0);

  const handlePrint = (type: 'expenses' | 'payments') => {
    setPrintType(type);
    setShowPrintPreview(true);
  };

  const handleConfirmPrint = () => {
    const printContent = document.getElementById('print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${printType === 'expenses' ? t('فاتورة المصروفات', 'Expenses Invoice') : t('تقرير المدفوعات', 'Payments Report')}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .header { text-align: center; margin-bottom: 30px; }
                .total { font-weight: bold; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
    setShowPrintPreview(false);
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-lg p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-[#1A1A1A] dark:text-white">
            {t('سجل العميل', 'Client Records')} - {client.name || client.username}
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('المصروفات', 'Expenses')}
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('المدفوعات', 'Payments')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">{t('سجل المصروفات', 'Expenses Record')}</h4>
              <Button variant="outline" size="sm" onClick={() => handlePrint('expenses')}>
                <Printer className="h-4 w-4 mr-2" />
                {t('طباعة', 'Print')}
              </Button>
            </div>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">{t('جاري التحميل...', 'Loading...')}</div>
                ) : (
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
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(String(expense.amount)) || 0)}</TableCell>
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
                            {t('الإجمالي', 'Total')}
                          </TableCell>
                          <TableCell className="font-semibold text-lg">
                            {formatCurrency(totalAmount)}
                          </TableCell>
                          <TableCell colSpan={2}></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">{t('سجل المدفوعات', 'Payments Record')}</h4>
              <Button variant="outline" size="sm" onClick={() => handlePrint('payments')}>
                <Printer className="h-4 w-4 mr-2" />
                {t('طباعة', 'Print')}
              </Button>
            </div>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">{t('جاري التحميل...', 'Loading...')}</div>
                ) : (
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
                            <TableCell>{payment.date}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              {formatCurrency(parseFloat(String(payment.amount)) || 0)}
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
                            {formatCurrency(totalPayments)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Print Preview Modal */}
        {showPrintPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg p-6 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {printType === 'expenses' ? t('معاينة طباعة المصروفات', 'Expenses Print Preview') : t('معاينة طباعة المدفوعات', 'Payments Print Preview')}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPrintPreview(false)}>
                    {t('إلغاء', 'Cancel')}
                  </Button>
                  <Button onClick={handleConfirmPrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    {t('طباعة', 'Print')}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-white" id="print-content">
                <div className="header text-center mb-6">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                    {printType === 'expenses' ? t('فاتورة المصروفات', 'Expenses Invoice') : t('تقرير المدفوعات', 'Payments Report')}
                  </h2>
                  <p className="text-gray-600">
                    {client.name || client.username}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date().toLocaleDateString('ar-EG')}
                  </p>
                </div>

                {printType === 'expenses' ? (
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
                            <TableCell>{formatCurrency(parseFloat(String(expense.amount)) || 0)}</TableCell>
                            <TableCell>{t(expense.status, expense.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-semibold">
                            {t('الإجمالي', 'Total')}
                          </TableCell>
                          <TableCell className="font-semibold text-lg">
                            {formatCurrency(totalAmount)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                ) : (
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
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(String(payment.amount)) || 0)}</TableCell>
                            <TableCell>{t('إيصال نقدية', 'Cash Receipt')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell className="font-semibold">
                            {t('الإجمالي', 'Total')}
                          </TableCell>
                          <TableCell className="font-semibold text-lg">
                            {formatCurrency(totalPayments)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                )}

                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>{t('تم إنشاء هذا التقرير بواسطة نظام إدارة المشاريع', 'Generated by Project Management System')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
