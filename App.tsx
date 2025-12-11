
import React, { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import Layout from './components/Layout.tsx';
import CompanyView from './components/CompanyView.tsx';
import { AppProvider } from './state/AppContext.tsx';
import LoginPage from './components/auth/LoginPage.tsx';
import { UserRole } from './types.ts';
// FIX: Changed the default import for `PublicPageView` to a named import.
import { PublicPageView } from './components/public/PublicPageView.tsx';
import { LanguageProvider, useLanguage } from './i18n/index.tsx';
// FIX: Switched from v5 react-router-dom imports (Switch, Redirect) to v6 (Routes, Navigate).
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme.tsx';
import BranchDetailView from './components/branch/BranchDetailView.tsx';
import NotificationArea from './components/common/NotificationArea.tsx';
import MobileViews from './components/mobile/MobileViews.tsx';
import { AuthProvider, useAuth } from './state/AuthContext.tsx';
import { SystemProvider } from './state/SystemContext.tsx';
import { InventoryProvider } from './state/InventoryContext.tsx';
import { SalesProvider } from './state/SalesContext.tsx';
import { OperationsProvider } from './state/OperationsContext.tsx';

const MainAppRoutes: React.FC = () => {
    // FIX: Get auth state from useAuth hook
    const { authState } = useAuth();
    const { currentUser } = authState;
    const location = useLocation();

    // Redirect non-super-admins from dashboard to their company page
    if (currentUser && currentUser.role !== UserRole.SUPER_ADMIN && currentUser.companyId && location.pathname === '/') {
        return <Navigate to={`/company/${currentUser.companyId}`} replace />;
    }
    
    // Prevent non-admins from accessing other companies' pages
    const companyIdMatch = location.pathname.match(/\/company\/([^/]+)/);
    if(currentUser && currentUser.role !== UserRole.SUPER_ADMIN && companyIdMatch) {
      const requestedCompanyId = companyIdMatch[1];
      if (currentUser.companyId !== requestedCompanyId) {
        return <Navigate to={`/company/${currentUser.companyId}`} replace />;
      }
    }

    return (
        // FIX: Updated react-router-dom v5 Switch to v6 Routes and Route props.
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/company/:companyId/branch/:branchId" element={<BranchDetailView />} />
            <Route path="/company/:id" element={<CompanyView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const AppContent: React.FC = () => {
    // FIX: Get auth state from useAuth hook
    const { authState } = useAuth();
    const { currentUser } = authState;
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        document.title = t('common.appTitle');
    }, [t]);

     useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderMainContent = () => {
        if (!currentUser) {
            return <Navigate to="/login" replace />;
        }
        if (isMobile && currentUser.role !== UserRole.SUPER_ADMIN) {
            return <MobileViews />;
        }
        return (
            <Layout>
                <MainAppRoutes />
            </Layout>
        );
    };

    return (
        
        <>
            <NotificationArea />
            <Routes>
                <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/public/:slug" element={<PublicPageView />} />
                <Route path="/*" element={renderMainContent()} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <SystemProvider>
        <InventoryProvider>
          <SalesProvider>
            <OperationsProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <LanguageProvider>
                            <HashRouter>
                            <AppContent />
                            </HashRouter>
                        </LanguageProvider>
                    </ThemeProvider>
                </AuthProvider>
            </OperationsProvider>
          </SalesProvider>
        </InventoryProvider>
      </SystemProvider>
    </AppProvider>
  );
};

export default App;
