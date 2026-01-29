import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useState } from 'react';
import LogoUrl from '../assets/logo.jpg';

export function Header() {
  const { language, setLanguage, theme, setTheme, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('الرئيسية', 'Home'), href: '#home' },
    { name: t('خدماتنا', 'Services'), href: '#services' },
    { name: t('أعمالنا', 'Works'), href: '#works' },
    { name: t('تصميم بالذكاء الاصطناعي', 'AI Design'), href: '#create-ai-design' },
    { name: t('الجديد', "What's New"), href: '#news' },
    { name: t('تواصل معنا', 'Contact'), href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#home" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center overflow-hidden p-0 shadow-none border-0">
                {/* image imported by Vite */}
                <img
                  src={LogoUrl}
                  alt="Elbatal Art Logo"
                  className="w-8 h-8 object-contain block rounded-lg"
                  width={32}
                  height={32}
                />
              </div>
              <div className={`${language === 'ar' ? 'mr-3' : 'ml-3'}`}>
                <h1 className="text-[#1A1A1A] dark:text-white">
                  {t('شركة البطل ارت', 'Elbatal Art Company')}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('للتشطيبات الفاخرة', 'Luxury Finishings')}
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between flex-1 mx-8">
            <div className="flex items-center space-x-8 rtl:space-x-reverse">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
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

            <Button
              className="hidden sm:flex bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              onClick={() => (window.location.hash = '#login')}
            >
              {t('دخول العميل', 'Client Login')}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Button
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white w-full"
                onClick={() => {
                  window.location.hash = '#login';
                  setMobileMenuOpen(false);
                }}
              >
                {t('دخول العميل', 'Client Login')}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}