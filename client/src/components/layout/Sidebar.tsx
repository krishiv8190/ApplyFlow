import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../features/theme/useTheme';
import { useAuth } from '../../features/auth/useAuth';

const navigationItems = [
  { label: 'Dashboard', to: '/', end: true },
  { label: 'Applications', to: '/applications', end: false },
  { label: 'Settings', to: '/settings', end: false },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="border-b border-slate-800 bg-slate-950 px-6 py-5 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:flex lg:flex-col lg:border-r lg:border-b-0 lg:px-5 lg:py-7">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between lg:block">
        <NavLink
          aria-label="ApplyFlow dashboard"
          className="inline-flex items-center"
          to="/dashboard"
        >
          <img
            alt="ApplyFlow"
            className="h-9 w-auto"
            src={theme === 'dark' ? '/applyflow-logo-dark.svg' : '/applyflow-logo.svg'}
          />{' '}
        </NavLink>

        <nav aria-label="Primary navigation" className="mt-0 lg:mt-10">
          <ul className="flex items-center gap-1 overflow-x-auto lg:flex-col lg:items-stretch">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`
                  }
                  end={item.end}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-5 w-full max-w-5xl border-t border-slate-800 pt-4 lg:mt-auto lg:pt-5">
        {user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </p>

            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        )}

        <button
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
          onClick={handleLogout}
          type="button"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
