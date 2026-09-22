import { Navigate, Route, Routes } from 'react-router-dom';

import { ComingSoonPage } from './components/feedback/ComingSoonPage';
import { AppShell } from './components/layout/AppShell';
import { ApplicationsPage } from './features/applications/ApplicationsPage';
import { ApplicationProvider } from './features/applications/ApplicationProvider';
import { CreateApplicationPage } from './features/applications/CreateApplicationPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ApplicationDetailsPage } from './features/applications/ApplicationDetailsPage';
import { EditApplicationPage } from './features/applications/EditApplicationPage';
function App() {
  return (
    <ApplicationProvider>
      <AppShell>
        <Routes>
          <Route element={<DashboardPage />} path="/" />
          <Route element={<ApplicationsPage />} path="/applications" />
          <Route element={<EditApplicationPage />} path="/applications/:id/edit" />
          <Route element={<ApplicationDetailsPage />} path="/applications/:id" />
          <Route element={<CreateApplicationPage />} path="/applications/new" />
          <Route
            element={
              <ComingSoonPage
                description="Track every interview round, meeting time, and outcome as your process progresses."
                title="Interviews"
              />
            }
            path="/interviews"
          />
          <Route
            element={
              <ComingSoonPage
                description="Connection preferences, Gmail sync controls, and account settings will live here."
                title="Settings"
              />
            }
            path="/settings"
          />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </AppShell>
    </ApplicationProvider>
  );
}

export default App;
