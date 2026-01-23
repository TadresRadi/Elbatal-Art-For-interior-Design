import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { CheckCircle, Edit, MessageSquare, Trash2 } from 'lucide-react';
import type { Client, Translate } from '../types';

type ClientsTableProps = {
  list: Client[];
  t: Translate;
  formatCurrency: (value: number) => string;
  onEdit: (client: Client) => void;
  onManageExpenses: (client: Client) => void;
  onOpenChat: (client: Client) => void;
  onComplete: (clientId: number) => void;
  onDelete: (clientId: number) => void;
  completed?: boolean;
  deleted?: boolean;
};

export function ClientsTable({
  list,
  t,
  formatCurrency,
  onEdit,
  onManageExpenses,
  onOpenChat,
  onComplete,
  onDelete,
  completed,
  deleted,
}: ClientsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('الاسم', 'Name')}</TableHead>
          <TableHead>{t('التكلفة الكلية', 'Total Cost')}</TableHead>
          <TableHead>{t('المدفوع', 'Paid')}</TableHead>
          <TableHead>{t('نسبة الإنجاز', 'Progress')}</TableHead>
          <TableHead>{t('الحالة', 'Status')}</TableHead>
          <TableHead>{t('الإجراءات', 'Actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => onEdit(c)}
              >
                {c.name || c.username}
              </Button>
            </TableCell>
            <TableCell>{formatCurrency(c.total)}</TableCell>
            <TableCell>{formatCurrency(c.paid)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <span>{c.progress}%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge>
                {c.status === 'active'
                  ? t('نشط', 'Active')
                  : c.status === 'completed'
                  ? t('مكتمل', 'Completed')
                  : t('معلق', 'Pending')}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-1">
              {!deleted && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onManageExpenses(c)}
                    title={t('إدارة المصاريف', 'Manage Expenses')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChat(c)}
                    title={t('فتح الشات', 'Open Chat')}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  {!completed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onComplete(c.id)}
                      title={t('تم الإكمال', 'Mark as Completed')}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(c.id)}
                    title={t('حذف العميل', 'Delete Client')}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
