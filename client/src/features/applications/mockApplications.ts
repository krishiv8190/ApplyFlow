import type { JobApplication } from './types';

export const mockApplications: JobApplication[] = [
  {
    id: 'application-1',
    company: 'Vercel',
    role: 'Frontend Engineer',
    location: 'Remote',
    status: 'Interview',
    appliedAt: '2026-09-06',
    source: 'LinkedIn',
  },
  {
    id: 'application-2',
    company: 'Linear',
    role: 'Product Engineer',
    location: 'Remote',
    status: 'Applied',
    appliedAt: '2026-09-04',
    source: 'Gmail',
  },
  {
    id: 'application-3',
    company: 'Figma',
    role: 'Software Engineer, Frontend',
    location: 'Bengaluru, India',
    status: 'Screening',
    appliedAt: '2026-09-01',
    source: 'Referral',
  },
  {
    id: 'application-4',
    company: 'Notion',
    role: 'Frontend Developer',
    location: 'Remote',
    status: 'Rejected',
    appliedAt: '2026-08-27',
    source: 'Manual',
  },
  {
    id: 'application-5',
    company: 'Stripe',
    role: 'Software Engineer',
    location: 'Bengaluru, India',
    status: 'Offer',
    appliedAt: '2026-08-21',
    source: 'Gmail',
  },
];
