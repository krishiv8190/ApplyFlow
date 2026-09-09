import type { ApplicationStatus } from './types';

const statusClassNames: Record<ApplicationStatus, string> = {
  Applied: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
  Screening: 'border-violet-400/20 bg-violet-400/10 text-violet-200',
  OA: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  Interview: 'border-indigo-400/20 bg-indigo-400/10 text-indigo-200',
  Offer: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  Rejected: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
  Ghosted: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassNames[status]}`}
    >
      {status}
    </span>
  );
}
