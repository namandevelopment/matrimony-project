import React, { Suspense, useEffect } from 'react';
import { Routes as RouterRoutes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { screens } from './screenConfig';
import { AdminLayout } from '../components/AdminLayout';
import { getToken, getStoredUser, getSimulatedUser, getActiveRole } from '../storage';
import { LoaderOverlay } from '../customModals/LoaderOverlay';
import { canAccessRoute } from '../utils/rbac';
import { setNavigator } from '../navigation/navigationService';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const ContentFallback = (
  <LoaderOverlay
    isLoading={true}
    scope="content"
    message="Loading section..."
    subMessage="Fetching latest Sindhi Matrimony data"
  />
);

const LoginFallback = (
  <LoaderOverlay
    isLoading={true}
    scope="fullscreen"
    message="Loading Portal..."
    subMessage="Securing session handshake"
  />
);

const AccessDeniedView: React.FC<{ path: string; role: string }> = ({ path, role }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-xs">
      <ShieldAlert className="w-8 h-8" />
    </div>
    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider mb-2">
      Access Restricted (RBAC)
    </span>
    <h2 className="text-xl font-bold text-slate-900 mb-2">
      Unauthorized Module Access
    </h2>
    <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
      Your currently active role <strong className="text-slate-800">[{role}]</strong> does not have clearance to view this module (<code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">{path}</code>). Please contact your System Administrator to request elevated permissions.
    </p>
    <a
      href="/"
      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-xs"
    >
      Return to Allowed Dashboard
    </a>
  </div>
);

const RBACScreenGuard: React.FC<{ path: string; children: React.ReactNode }> = ({ path, children }) => {
  const user = getSimulatedUser() || getStoredUser() || { role: 'SUPER_ADMIN' };
  const effectiveRole = getActiveRole() || user.role || 'SUPER_ADMIN';
  const allowedSections = user.allowedSections;

  if (!canAccessRoute(effectiveRole, path, allowedSections)) {
    return <AccessDeniedView path={path} role={effectiveRole} />;
  }

  return <>{children}</>;
};

const Routes: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  const protectedScreens = screens.filter((s) => s.requiresAuth);
  const loginScreenConfig = screens.find((s) => s.name === 'LoginScreen');
  const LoginComponent = loginScreenConfig?.component;

  return (
    <RouterRoutes>
      <Route
        path="/login"
        element={
          LoginComponent ? (
            <Suspense fallback={LoginFallback}>
              <LoginComponent />
            </Suspense>
          ) : null
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {protectedScreens.map((screen) => {
          const Component = screen.component;
          return (
            <Route
              key={screen.name}
              path={screen.path === '/' ? '' : screen.path.replace('/', '')}
              element={
                <Suspense fallback={ContentFallback}>
                  <RBACScreenGuard path={screen.path}>
                    <Component />
                  </RBACScreenGuard>
                </Suspense>
              }
            />
          );
        })}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default Routes;
