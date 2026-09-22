import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ComingSoonPage } from './components/feedback/ComingSoonPage';
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

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route element={<DashboardPage />} path="/" />

        <Route element={<ApplicationsPage />} path="/applications" />

        <Route element={<ApplicationDetailsPage />} path="/applications/:id" />

        <Route element={<EditApplicationPage />} path="/applications/:id/edit" />

        <Route element={<CreateApplicationPage />} path="/applications/new" />

        <Route
          element={
            <ComingSoonPage description="Interview tracking is coming soon." title="Interviews" />
          }
          path="/interviews"
        />

        <Route
          element={<ComingSoonPage description="Settings are coming soon." title="Settings" />}
          path="/settings"
        />
      </Route>

      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  );
}
