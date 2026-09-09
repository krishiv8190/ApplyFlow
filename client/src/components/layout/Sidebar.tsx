import { NavLink } from 'react-router-dom';

const navigationItems = [
  { label: 'Dashboard', to: '/', end: true },
  { label: 'Applications', to: '/applications', end: false },
  { label: 'Interviews', to: '/interviews', end: false },
  { label: 'Settings', to: '/settings', end: false },
];

export function Sidebar() {
  return (
    <aside className="border-b border-slate-800 bg-slate-950 px-6 py-5 lg:min-h-screen lg:border-r lg:border-b-0 lg:px-5 lg:py-7">
      <div className="mx-auto flex max-w-5xl items-center justify-between lg:block">
        <NavLink
          className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white"
          to="/"
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-lg bg-indigo-500 text-sm font-bold shadow-lg shadow-indigo-950"
          >
            A
          </span>
          ApplyFlow
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
    </aside>
  );
}
