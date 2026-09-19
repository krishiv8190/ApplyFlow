import { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { validateCreateApplication } from './validate.js';

describe('validateCreateApplication', () => {
  it('calls next for valid data', () => {
    const req = {
      body: {
        company: 'Google',
        role: 'Frontend Developer',
        source: 'Manual',
        status: 'Applied',
        appliedAt: '2026-09-10T00:00:00Z',
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateCreateApplication(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('returns 400 for invalid data', () => {
    const req = {
      body: {
        company: '',
        role: 'Frontend Developer',
        source: 'Manual',
        status: 'InvalidStatus',
        appliedAt: 'not-a-date',
      },
    } as Request;

    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });

    const res = {
      status,
    } as unknown as Response;

    const next = vi.fn();

    validateCreateApplication(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
