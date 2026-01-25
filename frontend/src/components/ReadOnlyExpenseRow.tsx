import { TableCell, TableRow } from './ui/table';
import { FileText } from 'lucide-react';

interface ReadOnlyExpenseRowProps {
  expense: any;
  formatCurrency: (value: number) => string;
  t: (ar: string, en: string) => string;
}

export function ReadOnlyExpenseRow({ expense, formatCurrency, t }: ReadOnlyExpenseRowProps) {
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
        </div>
      </TableCell>
      <TableCell>
        <span className="text-gray-400 text-sm">
          {t('للقراءة فقط', 'Read-only')}
        </span>
      </TableCell>
    </TableRow>
  );
}
