import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Lock, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import LogoUrl from '../assets/logo.jpg';
import api from '../lib/api';

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT parsing error:', e);
    return null;
  }
};

export function LoginPage() {
  const { t } = useApp();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await api.post('auth/login/', {
      username: credentials.username,
      password: credentials.password,
    });

    const accessToken = response.data.access;
    localStorage.setItem('accessToken', accessToken);

    // 🔹 دلوقتي نجيب بيانات المستخدم من auth/me/
    const meResponse = await api.get('auth/me/');
    const user = meResponse.data;

    localStorage.setItem('user', JSON.stringify(user));

    // 🔹 نحدد الـ dashboard بناءً على role
    if (user.role === 'admin') {
      window.location.hash = '#admin-dashboard';
    } else if (user.role === 'client') {
      window.location.hash = '#client-dashboard';
    } else {
      alert('Role not recognized');
    }

  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={LogoUrl} className="mx-auto mb-4" width={32} />
          <h1 className="text-3xl mb-2 text-[#1A1A1A] dark:text-white">
            {t('تسجيل الدخول', 'Login')}
          </h1>
        </div>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <Input
                placeholder="Username"
                value={credentials.username}
                onChange={(e)=>setCredentials({...credentials,username:e.target.value})}
              />

              <Input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e)=>setCredentials({...credentials,password:e.target.value})}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}