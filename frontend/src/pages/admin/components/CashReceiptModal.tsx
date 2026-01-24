import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { DollarSign } from 'lucide-react';
import type { Translate } from '../types';

type CashReceiptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientId: number | null;
  onCreateCashReceipt: (data: any) => void;
  t: Translate;
};

export function CashReceiptModal({ isOpen, onClose, clientId, onCreateCashReceipt, t }: CashReceiptModalProps) {
  if (!isOpen || !clientId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const cashReceiptData = {
      client_id: clientId,
      date: formData.get('date') as string,
      amount: parseFloat(formData.get('amount') as string),
    };

    onCreateCashReceipt(cashReceiptData);
    onClose();
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t('إيصال نقدية', 'Cash Receipt')}</h3>
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
            <Label htmlFor="amount">{t('المبلغ', 'Amount')}</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
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
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
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
