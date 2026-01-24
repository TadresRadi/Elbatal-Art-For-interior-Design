import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { FileText } from 'lucide-react';
import type { Translate } from '../types';

type ExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientId: number | null;
  onCreateExpense: (data: any) => void;
  t: Translate;
};

export function ExpenseModal({ isOpen, onClose, clientId, onCreateExpense, t }: ExpenseModalProps) {
  if (!isOpen || !clientId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const billFile = (formData.get('bill') as File) || null;
    const expenseData = {
      client_id: clientId,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      status: formData.get('status') as string,
      bill: billFile,
    };

    onCreateExpense(expenseData);
    onClose();
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-mid max-w-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t('إضافة مصروف', 'Add Expense')}</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">{t('التاريخ', 'Date')}</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">{t('الوصف', 'Description')}</Label>
            <Input
              id="description"
              name="description"
              placeholder={t('أدخل وصف المصروف', 'Enter expense description')}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="amount">{t('المبلغ', 'Amount')}</Label>
            <Input
              id="amount"
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
            <Label htmlFor="status">{t('الحالة', 'Status')}</Label>
            <Select name="status" defaultValue="pending">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('اختر الحالة', 'Select status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">{t('مدفوع', 'Paid')}</SelectItem>
                <SelectItem value="pending">{t('معلق', 'Pending')}</SelectItem>
                <SelectItem value="upcoming">{t('قادم', 'Upcoming')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bill">{t('فاتورة/إيصال', 'Bill/Receipt')}</Label>
            <div className="mt-1">
              <input
                type="file"
                id="bill"
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
                onClick={() => document.getElementById('bill')?.click()}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                {t('اختر ملف', 'Choose File')}
              </Button>
              <p className="text-xs text-gray-500 mt-1" id="file-label">
                {t('PNG, JPG, PDF (حتى 10 ميجابايت)', 'PNG, JPG, PDF (up to 10MB)')}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {t('إضافة', 'Add')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t('إلغاء', 'Cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
