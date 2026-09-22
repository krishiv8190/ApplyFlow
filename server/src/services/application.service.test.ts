import { beforeEach, describe, expect, it, vi } from 'vitest';

const { insertMock, updateMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock('../db.js', () => ({
  db: {
    insert: insertMock,
    update: updateMock,
  },
}));

import { applications } from '../db/schema.js';
import { createApplication, updateApplication } from './application.service.js';

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

describe('updateApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates and returns an application', async () => {
    const updatedApplication = {
      id: 'application-123',
      userId: 'user-123',
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Interview',
      appliedAt: new Date('2026-09-10T00:00:00Z'),
      url: 'https://example.com/job',
      notes: 'Technical round scheduled',
      sourceMessageId: null,
    };

    const returningMock = vi.fn().mockResolvedValue([updatedApplication]);

    const setMock = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: returningMock,
      }),
    });

    updateMock.mockReturnValue({
      set: setMock,
    });

    const result = await updateApplication('application-123', 'user-123', {
      status: 'Interview',
      notes: 'Technical round scheduled',
    });

    expect(updateMock).toHaveBeenCalledWith(applications);

    expect(setMock).toHaveBeenCalledWith({
      status: 'Interview',
      notes: 'Technical round scheduled',
      appliedAt: undefined,
    });

    expect(returningMock).toHaveBeenCalledOnce();
    expect(result).toEqual(updatedApplication);
  });
});
