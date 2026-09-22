import { describe, expect, it } from 'vitest';

import { updateApplicationSchema } from './update-application.schema.js';

describe('updateApplicationSchema', () => {
  it('accepts a status-only update', () => {
    const result = updateApplicationSchema.safeParse({
      status: 'Interview',
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty data', () => {
    const result = updateApplicationSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('rejects invalid data', () => {
    const result = updateApplicationSchema.safeParse({
      company: '',
      role: 'Frontend Developer',
      source: 'Manual',
      status: 'InvalidStatus',
      appliedAt: 'not-a-date',
    });

    expect(result.success).toBe(false);
  });
});
