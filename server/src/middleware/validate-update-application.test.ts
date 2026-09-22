import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { validateUpdateApplication } from './validate-update-application.js';

describe('validateUpdateApplication', () => {
  it('calls next for valid update data', () => {
    const req = {
      body: {
        status: 'Interview',
        notes: 'Technical round scheduled',
      },
    } as Request;

    const res = {} as Response;
    const next: NextFunction = vi.fn();

    validateUpdateApplication(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('returns 400 for invalid update data', () => {
    const req = {
      body: {
        status: 'InvalidStatus',
      },
    } as Request;

    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });

    const res = {
      status,
    } as unknown as Response;

    const next: NextFunction = vi.fn();

    validateUpdateApplication(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
