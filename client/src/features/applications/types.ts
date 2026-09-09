export const applicationStatuses = [
  'Applied',
  'Screening',
  'OA',
  'Interview',
  'Offer',
  'Rejected',
  'Ghosted',
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const applicationSources = ['Gmail', 'Manual', 'Referral', 'LinkedIn'] as const;

export type ApplicationSource = (typeof applicationSources)[number];

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  appliedAt: string;
  source: ApplicationSource;
  jobUrl?: string;
  notes?: string;
}

export type CreateApplicationInput = Omit<JobApplication, 'id'>;
