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
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { ROUTES, DASHBOARD_ROUTES } from './constants';

type PageType = 
  | typeof ROUTES.HOME
  | typeof ROUTES.WORKS
  | typeof ROUTES.ABOUT
  | typeof ROUTES.SERVICES
  | typeof ROUTES.NEWS
  | typeof ROUTES.CONTACT
  | typeof ROUTES.LOGIN
  | typeof ROUTES.CLIENT_DASHBOARD
  | typeof ROUTES.ADMIN_DASHBOARD;

/**
 * Main application content component with routing logic
 */
function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>(ROUTES.HOME);

  useEffect(() => {
    const handleHashChange = (): void => {
      const hash = window.location.hash.slice(1) || ROUTES.HOME;
      setCurrentPage(hash as PageType);
      window.scrollTo(0, 0);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return (): void => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  /**
   * Render the appropriate page based on current route
   */
  const renderPage = (): React.ReactElement => {
    switch (currentPage) {
      case ROUTES.HOME:
        return <HomePage />;
      case ROUTES.WORKS:
        return <WorksPage />;
      case ROUTES.ABOUT:
        return <AboutPage />;
      case ROUTES.SERVICES:
        return <ServicesPage />;
      case ROUTES.NEWS:
        return <NewsPage />;
      case ROUTES.CONTACT:
        return <ContactPage />;
      case ROUTES.LOGIN:
        return <LoginPage />;
      case ROUTES.CLIENT_DASHBOARD:
        return <ClientDashboard />;
      case ROUTES.ADMIN_DASHBOARD:
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  /**
   * Check if current page is a dashboard (no header/footer)
   */
  const isDashboard = DASHBOARD_ROUTES.includes(currentPage as string);

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Header />}
      <main className="flex-1">{renderPage()}</main>
      {!isDashboard && <Footer />}
      <Toaster />
    </div>
  );
}

/**
 * Main App component with context provider
 */
export default function App(): React.ReactElement {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
