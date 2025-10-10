import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Lock, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function LoginPage() {
  const { t } = useApp();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        window.location.hash = '#admin-dashboard';
      } else {
        window.location.hash = '#client-dashboard';
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-lg gold-gradient flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">EA</span>
          </div>
          <h1 className="text-3xl mb-2 text-[#1A1A1A] dark:text-white">
            {t('تسجيل الدخول', 'Login')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('الرجاء تسجيل الدخول للوصول إلى حسابك', 'Please login to access your account')}
          </p>
        </div>

        <Card className="luxury-shadow bg-white dark:bg-gray-800">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">
                  {t('اسم المستخدم', 'Username')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    required
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({ ...credentials, username: e.target.value })
                    }
                    placeholder={t('أدخل اسم المستخدم', 'Enter username')}
                    className="pl-10 rtl:pr-10 rtl:pl-4"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">
                  {t('كلمة المرور', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    required
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    placeholder={t('أدخل كلمة المرور', 'Enter password')}
                    className="pl-10 rtl:pr-10 rtl:pl-4"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" className="rounded" />
                  {t('تذكرني', 'Remember me')}
                </label>
                <a href="#" className="text-sm text-[#D4AF37] hover:text-[#B8941F]">
                  {t('نسيت كلمة المرور؟', 'Forgot password?')}
                </a>
              </div>

              <Button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  t('جارٍ تسجيل الدخول...', 'Logging in...')
                ) : (
                  <>
                    {t('دخول', 'Login')}
                    <ArrowRight className="mr-2 h-5 w-5 rtl:rotate-180" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('ليس لديك حساب؟', "Don't have an account?")}{' '}
                <a
                  href="#contact"
                  className="text-[#D4AF37] hover:text-[#B8941F]"
                >
                  {t('تواصل معنا', 'Contact us')}
                </a>
              </p>
            </div>

            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {t('للتجربة:', 'For demo:')}
                <br />
                {t('عميل:', 'Client:')} <strong>client / client</strong>
                <br />
                {t('مدير:', 'Admin:')} <strong>admin / admin</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
