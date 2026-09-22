import { Link } from 'react-router-dom';

import { StatusBadge } from './StatusBadge';
import type { JobApplication } from './types';

interface ApplicationTableProps {
  applications: JobApplication[];
}

function formatAppliedDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-medium text-slate-200">No applications found</p>
        <p className="mt-2 text-sm text-slate-400">Try changing your search or status filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium sm:px-6" scope="col">
              Company
            </th>
            <th className="px-5 py-3 font-medium" scope="col">
              Status
            </th>
            <th className="px-5 py-3 font-medium" scope="col">
              Applied
            </th>
            <th className="px-5 py-3 font-medium sm:px-6" scope="col">
              Source
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {applications.map((application) => (
            <tr className="transition hover:bg-slate-800/50" key={application.id}>
              <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                <Link className="block" to={`/applications/${application.id}`}>
                  <p className="font-medium text-slate-100 transition hover:text-indigo-300">
                    {application.company}
                  </p>
                  <p className="mt-1 text-slate-400">{application.role}</p>
                  <p className="mt-1 text-xs text-slate-500">{application.location}</p>
                </Link>
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <StatusBadge status={application.status} />
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                {formatAppliedDate(application.appliedAt)}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-slate-400 sm:px-6">
                {application.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
