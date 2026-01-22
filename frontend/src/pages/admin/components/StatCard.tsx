import { Card, CardContent } from '../../../components/ui/card';
import type { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
};

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
