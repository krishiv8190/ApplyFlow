import { Link } from 'react-router-dom';

import { StatusBadge } from './StatusBadge';
import type { JobApplication } from './types';

interface ApplicationDetailsViewProps {
  application: JobApplication;
  onDelete: () => void;
  onEdit: () => void;
}

function formatAppliedDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function ApplicationDetailsView({ application, onDelete, onEdit }: ApplicationDetailsViewProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        className="inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
        to="/applications"
      >
        ← Back to applications
      </Link>

      <header className="mt-6 flex flex-col gap-6 border-b border-slate-800 pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-indigo-300">APPLICATION DETAILS</p>
            <StatusBadge status={application.status} />
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {application.company}
          </h1>
          <p className="mt-2 text-lg text-slate-300">{application.role}</p>
          <p className="mt-1 text-sm text-slate-500">{application.location}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            onClick={onEdit}
            type="button"
          >
            Edit application
          </button>
          <button
            className="rounded-lg border border-rose-400/30 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/10 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            onClick={onDelete}
            type="button"
          >
            Delete
          </button>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailCard label="Applied" value={formatAppliedDate(application.appliedAt)} />
        <DetailCard label="Source" value={application.source} />
        <DetailCard label="Current status" value={application.status} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="font-semibold text-white">Notes</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">
            {application.notes || 'No notes have been added for this application yet.'}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="font-semibold text-white">Job posting</h2>
          {application.jobUrl ? (
            <a
              className="mt-3 inline-flex text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
              href={application.jobUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open job link ↗
            </a>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-400">No job URL saved.</p>
          )}
        </article>
      </section>
    </div>
  );
}

interface DetailCardProps {
  label: string;
  value: string;
}

function DetailCard({ label, value }: DetailCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-3 font-medium text-slate-100">{value}</p>
    </article>
  );
}
