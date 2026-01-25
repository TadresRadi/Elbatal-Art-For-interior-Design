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
  const [discussionCompleted, setDiscussionCompleted] = useState(false);
  const [expensesDiscussionCompleted, setExpensesDiscussionCompleted] = useState(false);
  const [paymentsDiscussionCompleted, setPaymentsDiscussionCompleted] = useState(false);
  const [expensesCollapsed, setExpensesCollapsed] = useState(false);
  const [paymentsCollapsed, setPaymentsCollapsed] = useState(false);
  const [originalExpenses, setOriginalExpenses] = useState<Expense[]>([]);
  const [originalPayments, setOriginalPayments] = useState<any[]>([]);

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
      
      // Set discussion states based on client data
      if (clientData.discussion_completed) {
        setDiscussionCompleted(true);
        setExpensesDiscussionCompleted(true);
        setPaymentsDiscussionCompleted(true);
      }
      
      // Load expenses
      const expensesRes = await api.get(`admin/expenses/?client_id=${client.id}`);
      const expensesData = expensesRes.data;
      
      // Load payments
      const paymentsRes = await api.get(`admin/payments/?client_id=${client.id}`);
      const paymentsData = paymentsRes.data;
      
      // Store original data and set current state
      setOriginalExpenses(expensesData);
      setOriginalPayments(paymentsData);
      
      // If discussion is completed, show collapsed state
      if (clientData.discussion_completed) {
        setExpensesCollapsed(true);
        setPaymentsCollapsed(true);
        setExpenses([]); // Empty current expenses for new entries
        setPayments([]); // Empty current payments for new entries
      } else {
        setExpenses(expensesData);
        setPayments(paymentsData);
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
    
    if (!window.confirm(t('هل أنت متأكد من إكمال النقاش مع العميل؟', 'Are you sure you want to complete the discussion with the client?'))) {
      return;
    }

    try {
      // Mark discussion as completed in the database
      await api.patch(`admin/clients/${client.id}/`, { 
        discussion_completed: true,
        discussion_completed_at: new Date().toISOString()
      });
      
      if (type === 'expenses') {
        setExpensesDiscussionCompleted(true);
        setExpensesCollapsed(true);
        // Store current expenses as original and clear current
        setOriginalExpenses([...expenses]);
        setExpenses([]); // Show empty table for new entries
      } else {
        setPaymentsDiscussionCompleted(true);
        setPaymentsCollapsed(true);
        // Store current payments as original and clear current
        setOriginalPayments([...payments]);
        setPayments([]); // Show empty table for new entries
      }
      
      alert(t('تم إكمال النقاش مع العميل بنجاح', 'Discussion completed with client successfully'));
    } catch (err) {
      console.error('Error completing discussion:', err);
      alert(t('فشل إكمال النقاش', 'Failed to complete discussion'));
    }
  };

  const handleToggleExpenses = () => {
    if (expensesCollapsed) {
      // Show original data
      setExpenses([...originalExpenses]);
      setExpensesCollapsed(false);
    } else {
      // Collapse and show empty
      setOriginalExpenses([...expenses]);
      setExpenses([]);
      setExpensesCollapsed(true);
    }
  };

  const handleTogglePayments = () => {
    if (paymentsCollapsed) {
      // Show original data
      setPayments([...originalPayments]);
      setPaymentsCollapsed(false);
    } else {
      // Collapse and show empty
      setOriginalPayments([...payments]);
      setPayments([]);
      setPaymentsCollapsed(true);
    }
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
            {/* Original Expenses Table - Collapsed */}
            {expensesDiscussionCompleted && (
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 
                      className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-gray-600"
                      onClick={handleToggleExpenses}
                    >
                      {t('المصروفات الأصلية', 'Original Expenses')}
                      {expensesCollapsed && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({t('مطوي', 'Collapsed')})
                        </span>
                      )}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleExpenses}
                      className="text-gray-600 border-gray-600"
                    >
                      {expensesCollapsed ? t('توسيع', 'Expand') : t('طي', 'Collapse')}
                    </Button>
                  </div>
                  {!expensesCollapsed && (
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
                          {originalExpenses.map((expense) => (
                            <EditableExpenseRow
                              key={expense.id}
                              expense={expense}
                              onUpdate={handleUpdateExpense}
                              onDelete={handleDeleteExpense}
                              formatCurrency={formatCurrency}
                              t={t}
                            />
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={2} className="font-semibold">
                              {t('إجمالي المصروفات الأصلية', 'Original Expenses Total')}
                            </TableCell>
                            <TableCell className="font-semibold text-lg text-gray-600">
                              {formatCurrency(originalExpenses.reduce((sum, exp) => sum + (parseFloat(String(exp.amount)) || 0), 0))}
                            </TableCell>
                            <TableCell colSpan={3}></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  )}
                </div>
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
              {!expensesDiscussionCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompleteDiscussion('expenses')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  {t('إكمال النقاش مع العميل', 'Discussion Completed with Client')}
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePrint('expenses')}>
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
            {/* Original Payments Table - Collapsed */}
            {paymentsDiscussionCompleted && (
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 
                      className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-gray-600"
                      onClick={handleTogglePayments}
                    >
                      {t('المدفوعات الأصلية', 'Original Payments')}
                      {paymentsCollapsed && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({t('مطوي', 'Collapsed')})
                        </span>
                      )}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePayments}
                      className="text-gray-600 border-gray-600"
                    >
                      {paymentsCollapsed ? t('توسيع', 'Expand') : t('طي', 'Collapse')}
                    </Button>
                  </div>
                  {!paymentsCollapsed && (
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
                          {originalPayments.map((payment) => (
                            <EditablePaymentRow
                              key={payment.id}
                              payment={payment}
                              onUpdate={handleUpdatePayment}
                              onDelete={handleDeletePayment}
                              formatCurrency={formatCurrency}
                              t={t}
                            />
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell className="font-semibold">
                              {t('إجمالي المدفوعات الأصلية', 'Original Payments Total')}
                            </TableCell>
                            <TableCell className="font-semibold text-lg text-gray-600">
                              {formatCurrency(originalPayments.reduce((sum, pay) => sum + (parseFloat(String(pay.amount)) || 0), 0))}
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  )}
                </div>
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
              {!paymentsDiscussionCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompleteDiscussion('payments')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  {t('إكمال النقاش مع العميل', 'Discussion Completed with Client')}
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePrint('payments')}>
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
