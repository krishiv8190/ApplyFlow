import type { ApplicationSource } from './types';

interface SourceBadgeProps {
  source: ApplicationSource;
}

const sourceStyles: Record<ApplicationSource, string> = {
  Gmail: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
  Manual: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
  Referral: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  LinkedIn: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
};

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${sourceStyles[source]}`}
    >
      {source}
    </span>
  );
}
