import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Landing } from './pages/Landing';
import { Docs } from './pages/Docs';
import { Login } from './pages/Login';
import { WorkerArea } from './pages/WorkerArea';
import { SupervisorDashboard } from './pages/SupervisorDashboard';
import { Onboarding } from './pages/Onboarding';
import { Billing } from './pages/Billing';
import { NotFound } from './pages/NotFound';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { ROUTES } from './constants/routes';
import { useGlobalUserSync } from './hooks/useGlobalUserSync';
import { USER_ROLE, type UserRole } from './constants/enums';
import { TOKENS } from './constants/tokens';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    if (user.role === USER_ROLE.New || user.role === USER_ROLE.PendingAccess) return <Navigate to={ROUTES.ONBOARDING} replace />;
    return <Navigate to={user.role === USER_ROLE.Supervisor ? ROUTES.DASHBOARD : ROUTES.WORKER} replace />;
  }
  
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  if (isAuthenticated) {
    if (user?.role === USER_ROLE.New || user?.role === USER_ROLE.PendingAccess) return <Navigate to={ROUTES.ONBOARDING} replace />;
    return <Navigate to={user?.role === USER_ROLE.Supervisor ? ROUTES.DASHBOARD : ROUTES.WORKER} replace />;
  }
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <Landing /> },
  { path: ROUTES.DOCS, element: <Docs /> },
  { path: ROUTES.LOGIN, element: <AuthRoute><Login /></AuthRoute> },
  { 
    path: ROUTES.WORKER, 
    element: <ProtectedRoute allowedRoles={[USER_ROLE.Worker]}><WorkerArea /></ProtectedRoute> 
  },
  { 
    path: ROUTES.DASHBOARD, 
    element: <ProtectedRoute allowedRoles={[USER_ROLE.Supervisor]}><SupervisorDashboard /></ProtectedRoute> 
  },
  { 
    path: ROUTES.BILLING, 
    element: <ProtectedRoute allowedRoles={[USER_ROLE.Supervisor]}><Billing /></ProtectedRoute> 
  },
  { 
    path: ROUTES.ONBOARDING, 
    element: <ProtectedRoute allowedRoles={[USER_ROLE.New, USER_ROLE.PendingAccess]}><Onboarding /></ProtectedRoute> 
  },
  { path: '*', element: <NotFound /> }
]);

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const theme = useThemeStore((state) => state.theme);
  const initTheme = useThemeStore((state) => state.initTheme);

  useGlobalUserSync();



  useEffect(() => {
    initialize();
    initTheme();
  }, [initialize, initTheme]);



  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={TOKENS.ICON_SIZES.XXXL} />
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-center" 
        richColors 
        theme={theme} 
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-main)',
            borderRadius: '1rem',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
            padding: '0.875rem 1.125rem',
            fontFamily: 'inherit'
          },
          className: 'text-sm font-bold tracking-wide',
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
