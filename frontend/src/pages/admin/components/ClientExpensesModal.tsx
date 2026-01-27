import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { FileText, DollarSign, X, Plus, Printer } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '../../../components/ui/table';
import type { Translate } from '../types';
import type { Expense } from '../types';
import api from '../../../lib/api';
import { 
  showExpenseSuccessAlert, 
  showExpenseErrorAlert, 
  showPaymentSuccessAlert,
  showPaymentErrorAlert,
  showDeleteConfirmationDialog,
  showRequiredFieldAlert
} from '../../../utils/simpleAlerts';

type ClientExpensesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  client: { id: number; name: string; username: string } | null;
  t: Translate;
};

export function ClientExpensesModal({ isOpen, onClose, client, t }: ClientExpensesModalProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const cashReceiptFormRef = useRef<HTMLFormElement>(null);
  const expenseFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen && client) {
      loadExpenses();
    }
  }, [isOpen, client]);

  const loadExpenses = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const res = await api.get(`admin/expenses/?client_id=${client.id}`);
      setExpenses(res.data);
    } catch (err) {
      // Error handled by API service
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (expenseData: any) => {
    try {
      const formData = new FormData();
      formData.append('client_id', expenseData.client_id.toString());
      formData.append('date', expenseData.date);
      formData.append('description', expenseData.description);
      formData.append('amount', expenseData.amount.toString());
      formData.append('status', expenseData.status);
      if (expenseData.bill) {
        formData.append('bill', expenseData.bill);
      }

      await api.post('expenses/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      await showExpenseSuccessAlert('created');
      loadExpenses(); // Reload expenses
    } catch (err) {
      await showExpenseErrorAlert('create', err instanceof Error ? err.message : undefined);
    }
  };

  const handleCreateCashReceipt = async (cashReceiptData: any) => {
    try {
      const response = await api.post('admin/cash-receipts/', cashReceiptData);
      await showPaymentSuccessAlert('created');
      return response.data;
    } catch (err) {
      await showPaymentErrorAlert('create', err instanceof Error ? err.message : undefined);
      throw err;
    }
  };

  const handleUpdateExpense = async (id: number, field: string, value: string | number | File) => {
    try {
      const formData = new FormData();
      if (field === 'bill' && value instanceof File) {
        formData.append('bill', value);
      } else {
        formData.append(field, value.toString());
      }

      const res = await api.patch(`admin/expenses/${id}/`, formData, {
        headers: field === 'bill' ? { 'Content-Type': 'multipart/form-data' } : {},
      });

      setExpenses(prev => prev.map(e => e.id === id ? res.data : e));
      setEditingId(null);
    } catch (err) {
      await showExpenseErrorAlert('update', err instanceof Error ? err.message : undefined);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    const result = await showDeleteConfirmationDialog('expense');
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`admin/expenses/${id}/`);
      setExpenses(prev => prev.filter(e => e.id !== id));
      await showExpenseSuccessAlert('deleted');
    } catch (err) {
      await showExpenseErrorAlert('delete', err instanceof Error ? err.message : undefined);
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

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const handleConfirmPrint = () => {
    window.print();
    setShowPrintPreview(false);
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-medium max-w-6xl max-h-[90vh] rounded-lg p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-[#1A1A1A] dark:text-white">
            {t('إدارة المصروفات', 'Manage Expenses')} - {client.name || client.username}
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
              {t('إضافة مصروف', 'Add Expenses')}
            </TabsTrigger>
            <TabsTrigger value="cash-receipt" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('إيصال نقدية', 'Cash Receipt')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-4">
            <div className="max-w-md mx-auto">
              <h4 className="text-lg font-semibold mb-4 text-center">
                {t('إضافة مصروف جديد', 'Add New Expense')}
              </h4>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <form ref={expenseFormRef} onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget as HTMLFormElement);
                    
                    const expenseData: any = {
                      client_id: client?.id,
                      date: formData.get('date') as string,
                      description: formData.get('description') as string,
                      amount: parseFloat(formData.get('amount') as string),
                      status: formData.get('status') as string,
                    };
                    
                    // Handle file upload
                    const billFile = (formData.get('bill') as File) || null;
                    if (billFile) {
                      expenseData.bill = billFile;
                    }
                    
                    await handleCreateExpense(expenseData);
                    expenseFormRef.current?.reset();
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="expense-date">{t('التاريخ', 'Date')}</Label>
                      <Input
                        id="expense-date"
                        name="date"
                        type="date"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expense-description">{t('الوصف', 'Description')}</Label>
                      <Input
                        id="expense-description"
                        name="description"
                        placeholder={t('أدخل وصف المصروف', 'Enter expense description')}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expense-amount">{t('المبلغ', 'Amount')}</Label>
                      <Input
                        id="expense-amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expense-status">{t('الحالة', 'Status')}</Label>
                      <Select name="status" defaultValue="pending">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={t('اختر الحالة', 'Select status')} />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black border shadow-lg min-w-[220px]">
                          <SelectItem value="paid">{t('مدفوع', 'Paid')}</SelectItem>
                          <SelectItem value="pending">{t('معلق', 'Pending')}</SelectItem>
                          <SelectItem value="upcoming">{t('قادم', 'Upcoming')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="expense-bill">{t('فاتورة/إيصال', 'Bill/Receipt')}</Label>
                      <div className="mt-1">
                        <input
                          type="file"
                          id="expense-bill"
                          name="bill"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const label = e.currentTarget.nextElementSibling as HTMLElement;
                              label.textContent = file.name;
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('expense-bill')?.click()}
                          className="w-full"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {t('اختر ملف', 'Choose File')}
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('PNG, JPG, PDF (حتى 10 ميجابايت)', 'PNG, JPG, PDF (up to 10MB)')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F]">
                        {t('إضافة', 'Add')}
                      </Button>
                      <Button type="button" variant="outline" className="flex-1">
                        {t('إلغاء', 'Cancel')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cash-receipt" className="mt-4">
            <div className="max-w-md mx-auto">
              <h4 className="text-lg font-semibold mb-4 text-center">
                {t('إضافة إيصال نقدية', 'Add Cash Receipt')}
              </h4>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <form ref={cashReceiptFormRef} onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget as HTMLFormElement);
                    const cashReceiptData = {
                      client_id: client?.id,
                      date: formData.get('date') as string,
                      amount: parseFloat(formData.get('amount') as string),
                    };
                    
                    await handleCreateCashReceipt(cashReceiptData);
                    cashReceiptFormRef.current?.reset();
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="cash-date">{t('التاريخ', 'Date')}</Label>
                      <Input
                        id="cash-date"
                        name="date"
                        type="date"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cash-amount">{t('المبلغ', 'Amount')}</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="cash-amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('إضافة', 'Add')}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          if (cashReceiptFormRef.current) {
                            cashReceiptFormRef.current.reset();
                          }
                        }}
                      >
                        {t('إلغاء', 'Cancel')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg p-6 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t('معاينة الطباعة', 'Print Preview')}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPrintPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border rounded-lg p-6 bg-white" id="print-content">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  {t('فاتورة المصروفات', 'Expenses Invoice')}
                </h2>
                <p className="text-gray-600">
                  {client.name || client.username}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date().toLocaleDateString('ar-EG')}
                </p>
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
                            <span className="text-blue-600">
                              {t('مرفق', 'Attached')}
                            </span>
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

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>{t('تم إنشاء هذه الفاتورة بواسطة نظام إدارة المشاريع', 'Generated by Project Management System')}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowPrintPreview(false)}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button onClick={handleConfirmPrint}>
                <Printer className="h-4 w-4 mr-2" />
                {t('طباعة', 'Print')}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
