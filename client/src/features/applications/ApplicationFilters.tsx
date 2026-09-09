import { applicationStatuses, type ApplicationStatus } from './types';

export type StatusFilter = ApplicationStatus | 'All';

interface ApplicationFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  search: string;
  status: StatusFilter;
}

export function ApplicationFilters({
  onSearchChange,
  onStatusChange,
  search,
  status,
}: ApplicationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <label className="sr-only" htmlFor="application-search">
          Search applications
        </label>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
          id="application-search"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search company, role, or location"
          type="search"
          value={search}
        />
      </div>

      <label
        className="flex items-center gap-2 text-sm font-medium text-slate-400"
        htmlFor="status-filter"
      >
        Status
        <select
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
          id="status-filter"
          onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
          value={status}
        >
          <option value="All">All statuses</option>
          {applicationStatuses.map((applicationStatus) => (
            <option key={applicationStatus} value={applicationStatus}>
              {applicationStatus}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
