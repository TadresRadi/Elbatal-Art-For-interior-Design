import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { FileText, Save, X, Plus, Trash2 } from 'lucide-react';
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

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-lg p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {t('مصاريف', 'Expenses')} - {client.name || client.username}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">{t('جاري التحميل...', 'Loading...')}</div>
        ) : (
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('لا توجد مصاريف', 'No expenses found')}
              </div>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="border rounded-lg p-4 space-y-3">
                  {editingId === expense.id ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>{t('التاريخ', 'Date')}</Label>
                        <Input
                          type="date"
                          defaultValue={expense.date}
                          onBlur={(e) => handleUpdateExpense(expense.id, 'date', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>{t('المبلغ', 'Amount')}</Label>
                        <Input
                          type="number"
                          defaultValue={expense.amount}
                          onBlur={(e) => handleUpdateExpense(expense.id, 'amount', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>{t('الوصف', 'Description')}</Label>
                        <Input
                          defaultValue={expense.description}
                          onBlur={(e) => handleUpdateExpense(expense.id, 'description', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>{t('الحالة', 'Status')}</Label>
                        <Select
                          defaultValue={expense.status}
                          onValueChange={(value: string) => handleUpdateExpense(expense.id, 'status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">{t('مدفوع', 'Paid')}</SelectItem>
                            <SelectItem value="pending">{t('معلق', 'Pending')}</SelectItem>
                            <SelectItem value="upcoming">{t('قادم', 'Upcoming')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t('فاتورة', 'Bill')}</Label>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpdateExpense(expense.id, 'bill', file);
                          }}
                        />
                        {expense.bill_url && (
                          <a
                            href={expense.bill_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm mt-1 block"
                          >
                            {t('عرض الفاتورة الحالية', 'View Current Bill')}
                          </a>
                        )}
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <Button onClick={() => setEditingId(null)} variant="outline">
                          {t('إلغاء', 'Cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">{t('التاريخ', 'Date')}</span>
                            <p className="font-medium">{expense.date}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">{t('المبلغ', 'Amount')}</span>
                            <p className="font-medium">{expense.amount}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">{t('الحالة', 'Status')}</span>
                            <p className="font-medium">{t(expense.status, expense.status)}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">{t('الوصف', 'Description')}</span>
                          <p className="font-medium">{expense.description}</p>
                        </div>
                        {expense.bill_url && (
                          <div className="mt-2">
                            <a
                              href={expense.bill_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 text-sm flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              {t('عرض الفاتورة', 'View Bill')}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(expense.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
