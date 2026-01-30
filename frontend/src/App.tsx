import { useEffect, useState } from 'react';
import { AppProvider } from './lib/context';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WorksPage } from './pages/WorksPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { CreateYourOwnDesignWithAIPage } from './pages/CreateYourOwnDesignWithAIPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Initial check on app load - only redirect from login if explicitly coming from logout
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const hash = window.location.hash.slice(1) || 'home';
    
    // Don't auto-redirect from login page - allow users to access login page to logout or switch accounts
    // Only redirect if user explicitly tries to access dashboard without authentication
    
    // Check if user is trying to access dashboard pages without authentication
    if (hash === 'admin-dashboard' || hash === 'client-dashboard') {
      if (!user) {
        window.location.replace('#login');
        return;
      }
      if (hash === 'admin-dashboard' && user.role !== 'admin') {
        if (user.role === 'client') {
          window.location.replace('#client-dashboard');
        } else {
          window.location.replace('#login');
        }
        return;
      }
      
      if (hash === 'client-dashboard' && user.role !== 'client') {
        // User is not client, redirect to appropriate dashboard or login
        if (user.role === 'admin') {
          window.location.replace('#admin-dashboard');
        } else {
          window.location.replace('#login');
        }
        return;
      }
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      
      // Don't auto-redirect from login page - allow users to access login page to logout or switch accounts
      // Only redirect if user explicitly tries to access dashboard without authentication
      
      // Check if user is trying to access dashboard pages without authentication
      if (hash === 'admin-dashboard' || hash === 'client-dashboard') {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user) {
          // No user found, redirect to login
          window.location.replace('#login');
          return;
        }
        
        // Check role-specific access
        if (hash === 'admin-dashboard' && user.role !== 'admin') {
          // User is not admin, redirect to appropriate dashboard or login
          if (user.role === 'client') {
            window.location.replace('#client-dashboard');
          } else {
            window.location.replace('#login');
          }
          return;
        }
        
        if (hash === 'client-dashboard' && user.role !== 'client') {
          // User is not client, redirect to appropriate dashboard or login
          if (user.role === 'admin') {
            window.location.replace('#admin-dashboard');
          } else {
            window.location.replace('#login');
          }
          return;
        }
      }
      
      setCurrentPage(hash);
      window.scrollTo(0, 0);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'works':
        return <WorksPage />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'news':
        return <NewsPage />;
      case 'contact':
        return <ContactPage />;
      case 'create-ai-design':
        return <CreateYourOwnDesignWithAIPage />;
      case 'login':
        return <LoginPage />;
      case 'client-dashboard':
        return <ClientDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  const isDashboard =
    currentPage === 'client-dashboard' ||
    currentPage === 'admin-dashboard' ||
    currentPage === 'login';

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Header />}
      <main className="flex-1">{renderPage()}</main>
      {!isDashboard && <Footer />}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
