import { beforeEach, describe, expect, it, vi } from 'vitest';

const { insertMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
}));

vi.mock('../db.js', () => ({
  db: {
    insert: insertMock,
  },
}));

import { applications } from '../db/schema.js';
import { createApplication } from './application.service.js';

describe('createApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates and returns an application', async () => {
    const createdApplication = {
      id: 'application-123',
      userId: 'user-123',
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Applied',
      appliedAt: new Date('2026-09-10T00:00:00Z'),
      url: 'https://example.com/job',
      notes: 'Applied through careers page',
      sourceMessageId: null,
    };

    const returningMock = vi.fn().mockResolvedValue([createdApplication]);
    const valuesMock = vi.fn().mockReturnValue({
      returning: returningMock,
    });

    insertMock.mockReturnValue({
      values: valuesMock,
    });

    const result = await createApplication({
      userId: 'user-123',
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Applied',
      appliedAt: '2026-09-10T00:00:00Z',
      url: 'https://example.com/job',
      notes: 'Applied through careers page',
    });

    expect(insertMock).toHaveBeenCalledWith(applications);

    expect(valuesMock).toHaveBeenCalledWith({
      userId: 'user-123',
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Applied',
      appliedAt: new Date('2026-09-10T00:00:00Z'),
      url: 'https://example.com/job',
      notes: 'Applied through careers page',
    });

    expect(returningMock).toHaveBeenCalledOnce();
    expect(result).toEqual(createdApplication);
  });
});
