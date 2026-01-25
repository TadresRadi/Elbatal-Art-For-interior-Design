import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TableCell, TableRow } from './ui/table';
import { Check, X, Edit, Trash2 } from 'lucide-react';

interface EditablePaymentRowProps {
  payment: any;
  onUpdate: (id: number, field: string, value: any) => void;
  onDelete: (id: number) => void;
  formatCurrency: (value: number) => string;
  t: (ar: string, en: string) => string;
}

export function EditablePaymentRow({ payment, onUpdate, onDelete, formatCurrency, t }: EditablePaymentRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: payment.date,
    amount: payment.amount,
    description: payment.description || t('إيصال نقدية', 'Cash Receipt')
  });

  const handleSave = () => {
    onUpdate(payment.id, 'update', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      date: payment.date,
      amount: payment.amount,
      description: payment.description || t('إيصال نقدية', 'Cash Receipt')
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(t('هل أنت متأكد من حذف هذه الدفعة؟', 'Are you sure you want to delete this payment?'))) {
      onDelete(payment.id);
    }
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="date"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            value={editData.amount}
            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="text-sm"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSave} className="h-7 w-7 p-0">
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-7 w-7 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{payment.date}</TableCell>
      <TableCell className="font-semibold text-green-600">
        {formatCurrency(parseFloat(String(payment.amount)) || 0)}
      </TableCell>
      <TableCell>{t('إيصال نقدية', 'Cash Receipt')}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-7 w-7 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDelete} className="h-7 w-7 p-0 text-red-500">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
