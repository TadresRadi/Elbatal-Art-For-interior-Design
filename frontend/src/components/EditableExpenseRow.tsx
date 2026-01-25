import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TableCell, TableRow } from './ui/table';
import { Check, X, Edit, Trash2, FileText } from 'lucide-react';

interface EditableExpenseRowProps {
  expense: any;
  onUpdate: (id: number, field: string, value: any) => void;
  onDelete: (id: number) => void;
  formatCurrency: (value: number) => string;
  t: (ar: string, en: string) => string;
}

export function EditableExpenseRow({ expense, onUpdate, onDelete, formatCurrency, t }: EditableExpenseRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: expense.date,
    description: expense.description,
    amount: expense.amount,
    status: expense.status
  });

  const handleSave = () => {
    onUpdate(expense.id, 'update', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      status: expense.status
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(t('هل أنت متأكد من حذف هذا المصروف؟', 'Are you sure you want to delete this expense?'))) {
      onDelete(expense.id);
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
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
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
          <Select value={editData.status} onValueChange={(value) => setEditData({ ...editData, status: value })}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">{t('معلق', 'Pending')}</SelectItem>
              <SelectItem value="paid">{t('مدفوع', 'Paid')}</SelectItem>
              <SelectItem value="upcoming">{t('قادم', 'Upcoming')}</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="flex gap-1">
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
