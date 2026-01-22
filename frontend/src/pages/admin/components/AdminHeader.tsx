import { Button } from '../../../components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import type { Translate } from '../types';

type AdminHeaderProps = {
  t: Translate;
  onCreateClient: () => void;
  onLogout: () => void;
};

export function AdminHeader({ t, onCreateClient, onLogout }: AdminHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl">{t('لوحة تحكم المدير', 'Admin Dashboard')}</h1>
          <p className="text-gray-500">{t('مرحباً، مدير النظام', 'Welcome, Administrator')}</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white" onClick={onCreateClient}>
            <Plus className="mr-2 h-4 w-4" /> {t('إنشاء حساب عميل', 'New Client')}
          </Button>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> {t('خروج', 'Logout')}
          </Button>
        </div>
      </div>
    </div>
  );
}
