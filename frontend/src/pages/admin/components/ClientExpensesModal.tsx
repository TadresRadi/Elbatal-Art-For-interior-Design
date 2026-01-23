import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
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
import { FileText, Save, X, Edit, Trash2, Printer, Eye } from 'lucide-react';
import type { Translate, Expense } from '../types';
import api from '../../../lib/api';

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
      console.log('Loaded expenses:', res.data);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
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
      console.error('Error updating expense:', err);
      alert(t('فشل تحديث المصروف', 'Failed to update expense'));
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm(t('هل أنت متأكد من حذف هذا المصروف؟', 'Are you sure you want to delete this expense?'))) return;
    try {
      await api.delete(`admin/expenses/${id}/`);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert(t('فشل حذف المصروف', 'Failed to delete expense'));
    }
  };

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      console.log('Invalid amount for formatting:', amount);
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
    console.log('Adding to total:', amount, 'from expense:', expense);
    return sum + amount;
  }, 0);
  
  console.log('Final total amount:', totalAmount);

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
      <div className="bg-white dark:bg-gray-800 w-full max-w-6xl max-h-[90vh] rounded-lg p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-[#1A1A1A] dark:text-white">
            {t('جدول المصروفات', 'Expenses Table')} - {client.name || client.username}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {t('طباعة', 'Print')}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
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
                      <TableHead>{t('إجراءات', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        {editingId === expense.id ? (
                          <>
                            <TableCell>
                              <Input
                                type="date"
                                value={expense.date}
                                onChange={(e) => handleUpdateExpense(expense.id, 'date', e.target.value)}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={expense.description}
                                onChange={(e) => handleUpdateExpense(expense.id, 'description', e.target.value)}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={expense.amount}
                                onChange={(e) => handleUpdateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={expense.status}
                                onValueChange={(value: string) => handleUpdateExpense(expense.id, 'status', value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="paid">{t('مدفوع', 'Paid')}</SelectItem>
                                  <SelectItem value="pending">{t('معلق', 'Pending')}</SelectItem>
                                  <SelectItem value="upcoming">{t('قادم', 'Upcoming')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUpdateExpense(expense.id, 'bill', file);
                                }}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => setEditingId(null)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(String(expense.amount)) || 0)}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  expense.status === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : expense.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
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
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(expense.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
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
                      <TableCell colSpan={3}></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
                {expenses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {t('لا توجد مصاريف', 'No expenses found')}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
                              expense.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : expense.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
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
  );
}
