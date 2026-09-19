import { z } from 'zod';

export const createApplicationSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  source: z.enum(['Gmail', 'Manual', 'Referral', 'LinkedIn']),
  status: z.enum(['Applied', 'Screening', 'OA', 'Interview', 'Offer', 'Rejected', 'Ghosted']),
  appliedAt: z.string().datetime(),
  url: z.string().url().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
});
