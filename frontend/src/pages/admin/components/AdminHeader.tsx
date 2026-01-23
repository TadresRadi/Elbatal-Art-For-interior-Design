import { Button } from '../../../components/ui/button';
import { LogOut, Plus, Moon, Sun, Globe } from 'lucide-react';
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
  return (
    <div className="bg-white dark:bg-gray-800 border-b">
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-4">
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
        
        {/* Navigation and Controls - Under Main Actions */}
        <div className="flex justify-between items-center">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
              {t('الرئيسية', 'Home')}
            </a>
            <a href="#works" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
              {t('أعمالنا', 'Our Works')}
            </a>
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
              {t('من نحن', 'About Us')}
            </a>
            <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
              {t('خدماتنا', 'Services')}
            </a>
            <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
              {t('تواصل معنا', 'Contact Us')}
            </a>
          </nav>
          
          {/* Language and Theme Toggle - Matching Header Design */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              <Globe className="h-5 w-5" />
              <span className="ml-1 text-xs">{language === 'ar' ? 'EN' : 'AR'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
