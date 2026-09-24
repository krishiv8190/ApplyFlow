import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import { useAuth } from './features/auth/useAuth';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ApplicationDetailsPage } from './features/applications/ApplicationDetailsPage';
import { ApplicationProvider } from './features/applications/ApplicationProvider';
import { ApplicationsPage } from './features/applications/ApplicationsPage';
import { CreateApplicationPage } from './features/applications/CreateApplicationPage';
import { EditApplicationPage } from './features/applications/EditApplicationPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { LandingPage } from './features/landing/LandingPage';
import { SettingsPage } from './features/settings/SettingsPage';

function ProtectedLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return (
    <ApplicationProvider>
      <AppShell />
    </ApplicationProvider>
  );
}

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'ApplyFlow',
      '/dashboard': 'ApplyFlow - Dashboard',
      '/applications': 'ApplyFlow - Applications',
      '/settings': 'ApplyFlow - Settings',
    };

    if (location.pathname === '/applications/new') {
      document.title = 'ApplyFlow - New Application';
      return;
    }

    if (location.pathname.endsWith('/edit')) {
      document.title = 'ApplyFlow - Edit Application';
      return;
    }

    if (location.pathname.startsWith('/applications/')) {
      document.title = 'ApplyFlow - Application';
      return;
    }

    document.title = titles[location.pathname] ?? 'ApplyFlow';
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <PageTitle />

      <Routes>
        {/* Public routes */}
        <Route element={<LandingPage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<DashboardPage />} path="/dashboard" />

          <Route element={<ApplicationsPage />} path="/applications" />

          <Route element={<ApplicationDetailsPage />} path="/applications/:id" />

          <Route element={<EditApplicationPage />} path="/applications/:id/edit" />

          <Route element={<CreateApplicationPage />} path="/applications/new" />

          <Route element={<SettingsPage />} path="/settings" />
        </Route>

        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </>
  );
}
