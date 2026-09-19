import { describe, expect, it } from 'vitest';
import { createApplicationSchema } from './application.schema.js';

describe('createApplicationSchema', () => {
  it('accepts a valid application', () => {
    const result = createApplicationSchema.safeParse({
      company: 'Google',
      role: 'Frontend Developer',
      source: 'Manual',
      status: 'Applied',
      appliedAt: '2026-09-10T00:00:00Z',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid application data', () => {
    const result = createApplicationSchema.safeParse({
      company: '',
      role: 'Frontend Developer',
      source: 'Manual',
      status: 'InvalidStatus',
      appliedAt: 'not-a-date',
    });

    expect(result.success).toBe(false);
  });
});
