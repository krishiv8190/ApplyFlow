import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <Sidebar />

      <main className="min-w-0 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
        <Outlet />
      </main>
    </div>
  );
}
