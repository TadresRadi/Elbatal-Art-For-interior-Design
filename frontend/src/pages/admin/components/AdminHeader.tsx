import { Button } from '../../../components/ui/button';
import { LogOut, Plus, Globe, Sun, Moon } from 'lucide-react';
import type { Translate } from '../types';

type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

type AdminHeaderProps = {
  t: Translate;
  onCreateClient: () => void;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export function AdminHeader({ t, onCreateClient, onLogout, language, setLanguage, theme, setTheme }: AdminHeaderProps) {
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b">
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white">
              {t('لوحة تحكم المشرف', 'Admin Dashboard')}
            </h1>
            <p className="text-gray-500">{t('مرحباً، مدير النظام', 'Welcome, Administrator')}</p>
          </div>
          <div className="flex gap-3">
            {/* Language Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
              title={t('تغيير اللغة', 'Change Language')}
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'AR'}
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center gap-2"
              title={t('تغيير المظهر', 'Toggle Theme')}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === 'light' ? t('داكن', 'Dark') : t('فاتح', 'Light')}
            </Button>

            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white" onClick={onCreateClient}>
              <Plus className="mr-2 h-4 w-4" /> {t('إنشاء حساب عميل', 'New Client')}
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('تسجيل الخروج', 'Logout')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
