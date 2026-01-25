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
import { EditableExpenseRow } from '../../../components/EditableExpenseRow';
import { EditablePaymentRow } from '../../../components/EditablePaymentRow';
import { ReadOnlyExpenseRow } from '../../../components/ReadOnlyExpenseRow';
import { ReadOnlyPaymentRow } from '../../../components/ReadOnlyPaymentRow';
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
  const [printOriginal, setPrintOriginal] = useState(false);
  const [discussionCompleted, setDiscussionCompleted] = useState(false);
  const [expensesDiscussionCompleted, setExpensesDiscussionCompleted] = useState(false);
  const [paymentsDiscussionCompleted, setPaymentsDiscussionCompleted] = useState(false);
  const [expensesDiscussionCompletedAt, setExpensesDiscussionCompletedAt] = useState<string | null>(null);
  const [paymentsDiscussionCompletedAt, setPaymentsDiscussionCompletedAt] = useState<string | null>(null);
  const [expensesCollapsed, setExpensesCollapsed] = useState(false);
  const [paymentsCollapsed, setPaymentsCollapsed] = useState(false);
  const [originalExpenses, setOriginalExpenses] = useState<Expense[]>([]);
  const [originalPayments, setOriginalPayments] = useState<any[]>([]);
  const [expenseVersions, setExpenseVersions] = useState<any[]>([]);
  const [paymentVersions, setPaymentVersions] = useState<any[]>([]);
  const [expensesVersionCount, setExpensesVersionCount] = useState(0);
  const [paymentsVersionCount, setPaymentsVersionCount] = useState(0);
  const [collapsedVersions, setCollapsedVersions] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (isOpen && client) {
      loadData();
    }
  }, [isOpen, client]);

  const loadData = async () => {
    if (!client) return;
    setLoading(true);
    
    try {
      // Load client data to check discussion status
      const clientRes = await api.get(`admin/clients/${client.id}/`);
      const clientData = clientRes.data;
      
      // Debug: Log the client data to see what fields are returned
      console.log('Client data from API:', clientData);
      console.log('expenses_discussion_completed:', clientData.expenses_discussion_completed);
      console.log('payments_discussion_completed:', clientData.payments_discussion_completed);
      console.log('expenses_discussion_completed_at:', clientData.expenses_discussion_completed_at);
      console.log('payments_discussion_completed_at:', clientData.payments_discussion_completed_at);
      
      // Set separate discussion states based on client data
      setExpensesDiscussionCompleted(clientData.expenses_discussion_completed || false);
      setPaymentsDiscussionCompleted(clientData.payments_discussion_completed || false);
      setExpensesDiscussionCompletedAt(clientData.expenses_discussion_completed_at || null);
      setPaymentsDiscussionCompletedAt(clientData.payments_discussion_completed_at || null);
      setExpensesVersionCount(clientData.expenses_version_count || 0);
      setPaymentsVersionCount(clientData.payments_version_count || 0);
      
      // Load expense versions
      const expenseVersionsRes = await api.get(`admin/expense-versions/?client_id=${client.id}`);
      const expenseVersionsData = expenseVersionsRes.data;
      setExpenseVersions(expenseVersionsData);
      
      // Load payment versions
      const paymentVersionsRes = await api.get(`admin/payment-versions/?client_id=${client.id}`);
      const paymentVersionsData = paymentVersionsRes.data;
      setPaymentVersions(paymentVersionsData);
      
      // Load all expenses
      const expensesRes = await api.get(`admin/expenses/?client_id=${client.id}`);
      const allExpenses = expensesRes.data;
      
      // Load all payments
      const paymentsRes = await api.get(`admin/payments/?client_id=${client.id}`);
      const allPayments = paymentsRes.data;
      
      // Filter expenses based on last discussion completion time
      let preDiscussionExpenses: Expense[] = [];
      let postDiscussionExpenses: Expense[] = [];
      
      if (clientData.expenses_discussion_completed_at && expenseVersionsData.length > 0) {
        // Get the latest version
        const latestVersion = expenseVersionsData[expenseVersionsData.length - 1];
        const discussionTime = new Date(latestVersion.discussion_completed_at);
        
        preDiscussionExpenses = allExpenses.filter((expense: Expense) => {
          if (!expense.created_at) return false;
          const expenseTime = new Date(expense.created_at);
          return expenseTime <= discussionTime;
        });
        
        postDiscussionExpenses = allExpenses.filter((expense: Expense) => {
          if (!expense.created_at) return true; // Treat as post-discussion if no created_at
          const expenseTime = new Date(expense.created_at);
          return expenseTime > discussionTime;
        });
      } else {
        // No discussion completed yet, all expenses are current
        preDiscussionExpenses = [];
        postDiscussionExpenses = allExpenses;
      }
      
      // Filter payments based on last discussion completion time
      let preDiscussionPayments: any[] = [];
      let postDiscussionPayments: any[] = [];
      
      if (clientData.payments_discussion_completed_at && paymentVersionsData.length > 0) {
        // Get the latest version
        const latestVersion = paymentVersionsData[paymentVersionsData.length - 1];
        const discussionTime = new Date(latestVersion.discussion_completed_at);
        
        preDiscussionPayments = allPayments.filter((payment: any) => {
          if (!payment.created_at) return false;
          const paymentTime = new Date(payment.created_at);
          return paymentTime <= discussionTime;
        });
        
        postDiscussionPayments = allPayments.filter((payment: any) => {
          if (!payment.created_at) return true; // Treat as post-discussion if no created_at
          const paymentTime = new Date(payment.created_at);
          return paymentTime > discussionTime;
        });
      } else {
        // No discussion completed yet, all payments are current
        preDiscussionPayments = [];
        postDiscussionPayments = allPayments;
      }
      
      // Store original data and set current state
      setOriginalExpenses(preDiscussionExpenses);
      setOriginalPayments(preDiscussionPayments);
      
      // If discussion is completed, show collapsed state and post-discussion data
      if (clientData.expenses_discussion_completed) {
        setExpensesCollapsed(true);
        setExpenses(postDiscussionExpenses); // Show post-discussion expenses
      } else {
        setExpenses(postDiscussionExpenses);
      }
      
      if (clientData.payments_discussion_completed) {
        setPaymentsCollapsed(true);
        setPayments(postDiscussionPayments); // Show post-discussion payments
      } else {
        setPayments(postDiscussionPayments);
      }
      
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

  const handlePrintOriginal = (type: 'expenses' | 'payments') => {
    setPrintType(type);
    setPrintOriginal(true);
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
              <title>${printOriginal 
                ? (printType === 'expenses' 
                  ? t('فاتورة المصروفات الأصلية', 'Original Expenses Invoice') 
                  : t('تقرير المدفوعات الأصلية', 'Original Payments Report'))
                : (printType === 'expenses' 
                  ? t('فاتورة المصروفات', 'Expenses Invoice') 
                  : t('تقرير المدفوعات', 'Payments Report'))
              }</title>
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
    setPrintOriginal(false);
  };

  const handleUpdateExpense = async (id: number, field: string, data: any) => {
    try {
      const res = await api.patch(`admin/expenses/${id}/`, data);
      setExpenses(expenses.map(exp => exp.id === id ? res.data : exp));
      alert(t('تم تحديث المصروف بنجاح', 'Expense updated successfully'));
    } catch (err) {
      console.error('Error updating expense:', err);
      alert(t('فشل تحديث المصروف', 'Failed to update expense'));
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await api.delete(`admin/expenses/${id}/`);
      setExpenses(expenses.filter(exp => exp.id !== id));
      alert(t('تم حذف المصروف بنجاح', 'Expense deleted successfully'));
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert(t('فشل حذف المصروف', 'Failed to delete expense'));
    }
  };

  const handleUpdatePayment = async (id: number, field: string, data: any) => {
    try {
      const res = await api.patch(`admin/payments/${id}/`, data);
      setPayments(payments.map(pay => pay.id === id ? res.data : pay));
      alert(t('تم تحديث الدفعة بنجاح', 'Payment updated successfully'));
    } catch (err) {
      console.error('Error updating payment:', err);
      alert(t('فشل تحديث الدفعة', 'Failed to update payment'));
    }
  };

  const handleDeletePayment = async (id: number) => {
    try {
      await api.delete(`admin/payments/${id}/`);
      setPayments(payments.filter(pay => pay.id !== id));
      alert(t('تم حذف الدفعة بنجاح', 'Payment deleted successfully'));
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert(t('فشل حذف الدفعة', 'Failed to delete payment'));
    }
  };

  const handleAddExpense = () => {
    // This would open a modal to add a new expense
    // For now, we'll just show an alert
    alert(t('إضافة مصروف جديد', 'Add new expense'));
  };

  const handleAddPayment = () => {
    // This would open a modal to add a new payment
    // For now, we'll just show an alert
    alert(t('إضافة دفعة جديدة', 'Add new payment'));
  };

  const handleCompleteDiscussion = async (type: 'expenses' | 'payments') => {
    if (!client) return;
    
    const confirmMessage = type === 'expenses' 
      ? t('هل أنت متأكد من إكمال نقاش المصروفات مع العميل؟', 'Are you sure you want to complete the expenses discussion with the client?')
      : t('هل أنت متأكد من إكمال نقاش المدفوعات مع العميل؟', 'Are you sure you want to complete the payments discussion with the client?');
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const currentTime = new Date().toISOString();
      
      if (type === 'expenses') {
        // Create new expense version
        await api.post(`admin/expense-versions/create-version/`, { client_id: client.id });
        
        // Update expenses discussion state
        setExpensesDiscussionCompleted(true);
        setExpensesDiscussionCompletedAt(currentTime);
        setExpensesCollapsed(true);
        setExpensesVersionCount(prev => prev + 1);
        
        // Store current expenses as original and clear current for new entries
        setOriginalExpenses([...expenses]);
        setExpenses([]); // Show empty table for new entries
        
      } else {
        // Create new payment version
        await api.post(`admin/payment-versions/create-version/`, { client_id: client.id });
        
        // Update payments discussion state
        setPaymentsDiscussionCompleted(true);
        setPaymentsDiscussionCompletedAt(currentTime);
        setPaymentsCollapsed(true);
        setPaymentsVersionCount(prev => prev + 1);
        
        // Store current payments as original and clear current for new entries
        setOriginalPayments([...payments]);
        setPayments([]); // Show empty table for new entries
      }
      
      // Reload data to get the updated versions
      await loadData();
      
      const successMessage = type === 'expenses'
        ? t('تم إكمال نقاش المصروفات مع العميل بنجاح', 'Expenses discussion completed with client successfully')
        : t('تم إكمال نقاش المدفوعات مع العميل بنجاح', 'Payments discussion completed with client successfully');
      
      alert(successMessage);
    } catch (err) {
      console.error('Error completing discussion:', err);
      alert(t('فشل إكمال النقاش', 'Failed to complete discussion'));
    }
  };

  const handleToggleExpenses = () => {
    setExpensesCollapsed(!expensesCollapsed);
  };

  const handleTogglePayments = () => {
    setPaymentsCollapsed(!paymentsCollapsed);
  };

  const handleToggleVersion = (versionKey: string) => {
    setCollapsedVersions(prev => ({
      ...prev,
      [versionKey]: !prev[versionKey]
    }));
  };

  const handlePrintVersion = (type: 'expenses' | 'payments', version: any) => {
    setPrintType(type);
    setPrintOriginal(true);
    // Store the specific version data for printing
    if (type === 'expenses') {
      setOriginalExpenses(version.expenses_data);
    } else {
      setOriginalPayments(version.payments_data);
    }
    setShowPrintPreview(true);
  };

  const handlePrintCurrent = (type: 'expenses' | 'payments') => {
    setPrintType(type);
    setPrintOriginal(false); // Always print current data for new tables
    setShowPrintPreview(true);
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
            {/* Expense Versions - Individual Tables */}
            {expensesDiscussionCompleted && expenseVersions.length > 0 && (
              <div className="space-y-4 mb-6">
                {expenseVersions.map((version, index) => {
                  const versionKey = `expenses_${version.id}`;
                  const isVersionCollapsed = collapsedVersions[versionKey] !== false; // Default to collapsed
                  return (
                    <div key={version.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 
                          className="text-md font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-600"
                          onClick={() => handleToggleVersion(versionKey)}
                        >
                          {t('المصروفات', 'Expenses')} {version.version_number}
                          {isVersionCollapsed && (
                            <span className="text-sm text-gray-500 ml-2">
                              ({t('مطوي', 'Collapsed')})
                            </span>
                          )}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(version.discussion_completed_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintVersion('expenses', version)}
                              className="text-blue-600 border-blue-600"
                            >
                              <Printer className="h-3 w-3 mr-1" />
                              {t('طباعة', 'Print')}
                            </Button>
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
                                <TableHead>{t('الإجراءات', 'Actions')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {version.expenses_data.map((expense: any) => (
                                <ReadOnlyExpenseRow
                                  key={expense.id}
                                  expense={expense}
                                  formatCurrency={formatCurrency}
                                  t={t}
                                />
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
                                <TableCell colSpan={3}></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* New Empty Expenses Table */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {expensesDiscussionCompleted 
                  ? t('مصروفات جديدة بعد النقاش', 'New Expenses After Discussion')
                  : t('سجل المصروفات', 'Expenses Record')
                }
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompleteDiscussion('expenses')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  {t('إكمال النقاش مع العميل', 'Discussion Completed with Client')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrintCurrent('expenses')}>
                  <Printer className="h-4 w-4 mr-2" />
                  {t('طباعة', 'Print')}
                </Button>
              </div>
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
                          <TableHead>{t('الإجراءات', 'Actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((expense) => (
                          <EditableExpenseRow
                            key={expense.id}
                            expense={expense}
                            onUpdate={handleUpdateExpense}
                            onDelete={handleDeleteExpense}
                            formatCurrency={formatCurrency}
                            t={t}
                          />
                        ))}
                        {expenses.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                              {expensesDiscussionCompleted 
                                ? t('لا توجد مصروفات جديدة بعد النقاش', 'No new expenses after discussion')
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
                            {formatCurrency(expenses.reduce((sum, exp) => sum + (parseFloat(String(exp.amount)) || 0), 0))}
                          </TableCell>
                          <TableCell colSpan={3}></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            {/* Payment Versions - Individual Tables */}
            {paymentsDiscussionCompleted && paymentVersions.length > 0 && (
              <div className="space-y-4 mb-6">
                {paymentVersions.map((version, index) => {
                  const versionKey = `payments_${version.id}`;
                  const isVersionCollapsed = collapsedVersions[versionKey] !== false; // Default to collapsed
                  return (
                    <div key={version.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 
                          className="text-md font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-600"
                          onClick={() => handleToggleVersion(versionKey)}
                        >
                          {t('المدفوعات', 'Payments')} {version.version_number}
                          {isVersionCollapsed && (
                            <span className="text-sm text-gray-500 ml-2">
                              ({t('مطوي', 'Collapsed')})
                            </span>
                          )}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(version.discussion_completed_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintVersion('payments', version)}
                              className="text-blue-600 border-blue-600"
                            >
                              <Printer className="h-3 w-3 mr-1" />
                              {t('طباعة', 'Print')}
                            </Button>
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
                                <TableHead>{t('الإجراءات', 'Actions')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {version.payments_data.map((payment: any) => (
                                <ReadOnlyPaymentRow
                                  key={payment.id}
                                  payment={payment}
                                  formatCurrency={formatCurrency}
                                  t={t}
                                />
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell className="font-semibold">
                                  {t('إجمالي المدفوعات', 'Payments Total')} {version.version_number}
                                </TableCell>
                                <TableCell className="font-semibold text-lg text-gray-600">
                                  {formatCurrency(version.payments_data.reduce((sum: number, pay: any) => sum + (parseFloat(String(pay.amount)) || 0), 0))}
                                </TableCell>
                                <TableCell colSpan={2}></TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* New Empty Payments Table */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {paymentsDiscussionCompleted 
                  ? t('مدفوعات جديدة بعد النقاش', 'New Payments After Discussion')
                  : t('سجل المدفوعات', 'Payments Record')
                }
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompleteDiscussion('payments')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  {t('إكمال النقاش مع العميل', 'Discussion Completed with Client')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrintCurrent('payments')}>
                  <Printer className="h-4 w-4 mr-2" />
                  {t('طباعة', 'Print')}
                </Button>
              </div>
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
                          <TableHead>{t('الإجراءات', 'Actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <EditablePaymentRow
                            key={payment.id}
                            payment={payment}
                            onUpdate={handleUpdatePayment}
                            onDelete={handleDeletePayment}
                            formatCurrency={formatCurrency}
                            t={t}
                          />
                        ))}
                        {payments.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                              {paymentsDiscussionCompleted 
                                ? t('لا توجد مدفوعات جديدة بعد النقاش', 'No new payments after discussion')
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
                            {formatCurrency(payments.reduce((sum, pay) => sum + (parseFloat(String(pay.amount)) || 0), 0))}
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
                    {printOriginal 
                      ? (printType === 'expenses' 
                        ? t('فاتورة المصروفات الأصلية', 'Original Expenses Invoice') 
                        : t('تقرير المدفوعات الأصلية', 'Original Payments Report'))
                      : (printType === 'expenses' 
                        ? t('فاتورة المصروفات', 'Expenses Invoice') 
                        : t('تقرير المدفوعات', 'Payments Report'))
                    }
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
                        {(printOriginal ? originalExpenses : expenses).map((expense) => (
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
                            {formatCurrency((printOriginal ? originalExpenses : expenses).reduce((sum, exp) => sum + (parseFloat(String(exp.amount)) || 0), 0))}
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
                        {(printOriginal ? originalPayments : payments).map((payment) => (
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
                            {formatCurrency((printOriginal ? originalPayments : payments).reduce((sum, pay) => sum + (parseFloat(String(pay.amount)) || 0), 0))}
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
