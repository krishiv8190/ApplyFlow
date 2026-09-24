import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ApplicationFilters, type StatusFilter } from './ApplicationFilters';
import { useApplications } from './ApplicationContext';
import { ApplicationTable } from './ApplicationTable';

export function ApplicationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const { applications } = useApplications();

  const normalizedSearch = search.trim().toLowerCase();
  const filteredApplications = applications.filter((application) => {
    const matchesSearch = [application.company, application.role, application.location].some(
      (value) => value?.toLowerCase().includes(normalizedSearch),
    );
    const matchesStatus = statusFilter === 'All' || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-300">APPLICATIONS</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Every opportunity, in one place
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
            Search your pipeline and keep the next step visible.
          </p>
        </div>
        <Link
          className="inline-flex w-fit items-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          to="/applications/new"
        >
          New application
        </Link>
      </header>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <ApplicationFilters
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            search={search}
            status={statusFilter}
          />
          <p className="mt-3 text-sm text-slate-400">
            {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
        <ApplicationTable applications={filteredApplications} />
      </section>
    </div>
  );
}
