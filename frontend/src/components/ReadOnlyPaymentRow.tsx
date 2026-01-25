import { TableCell, TableRow } from './ui/table';

interface ReadOnlyPaymentRowProps {
  payment: any;
  formatCurrency: (value: number) => string;
  t: (ar: string, en: string) => string;
}

export function ReadOnlyPaymentRow({ payment, formatCurrency, t }: ReadOnlyPaymentRowProps) {
  return (
    <TableRow>
      <TableCell>{payment.date}</TableCell>
      <TableCell>{formatCurrency(parseFloat(String(payment.amount)) || 0)}</TableCell>
      <TableCell>{t('إيصال نقدية', 'Cash Receipt')}</TableCell>
      <TableCell>
        <span className="text-gray-400 text-sm">
          {t('للقراءة فقط', 'Read-only')}
        </span>
      </TableCell>
    </TableRow>
  );
}
