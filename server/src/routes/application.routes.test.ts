import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createApplicationMock } = vi.hoisted(() => ({
  createApplicationMock: vi.fn(),
}));

vi.mock('../services/application.service.js', () => ({
  createApplication: createApplicationMock,
}));

import app from '../app.js';

describe('POST /api/applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEV_USER_ID = 'b74ed226-9d3c-4659-8bc7-1bafca691acc';
  });

  it('creates an application', async () => {
    const createdApplication = {
      id: 'application-123',
      userId: 'b74ed226-9d3c-4659-8bc7-1bafca691acc',
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Applied',
      appliedAt: '2026-09-10T00:00:00.000Z',
      url: 'https://example.com/job',
      notes: 'Applied through careers page',
      sourceMessageId: null,
    };

    createApplicationMock.mockResolvedValue(createdApplication);

    const response = await request(app).post('/api/applications').send({
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Applied',
      appliedAt: '2026-09-10T00:00:00Z',
      url: 'https://example.com/job',
      notes: 'Applied through careers page',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdApplication);

    expect(createApplicationMock).toHaveBeenCalledWith({
      userId: 'b74ed226-9d3c-4659-8bc7-1bafca691acc',
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Applied',
      appliedAt: '2026-09-10T00:00:00Z',
      url: 'https://example.com/job',
      notes: 'Applied through careers page',
    });
  });

  it('returns 400 for invalid data', async () => {
    const response = await request(app).post('/api/applications').send({
      company: '',
      role: 'Frontend Developer',
      source: 'Manual',
      status: 'InvalidStatus',
      appliedAt: 'not-a-date',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Validation failed',
      }),
    );

    expect(createApplicationMock).not.toHaveBeenCalled();
  });
});
