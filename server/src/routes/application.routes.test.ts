import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  createApplicationMock,
  getApplicationsMock,
  getApplicationByIdMock,
  updateApplicationMock,
} = vi.hoisted(() => ({
  createApplicationMock: vi.fn(),
  getApplicationsMock: vi.fn(),
  getApplicationByIdMock: vi.fn(),
  updateApplicationMock: vi.fn(),
}));

vi.mock('../services/application.service.js', () => ({
  createApplication: createApplicationMock,
  getApplications: getApplicationsMock,
  getApplicationById: getApplicationByIdMock,
  updateApplication: updateApplicationMock,
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

describe('GET /api/applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEV_USER_ID = 'b74ed226-9d3c-4659-8bc7-1bafca691acc';
  });

  it('fetches applications for the user', async () => {
    const applications = [
      {
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
      },
    ];

    getApplicationsMock.mockResolvedValue(applications);

    const response = await request(app).get('/api/applications');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(applications);

    expect(getApplicationsMock).toHaveBeenCalledWith('b74ed226-9d3c-4659-8bc7-1bafca691acc');
  });
});

describe('GET /api/applications/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEV_USER_ID = 'b74ed226-9d3c-4659-8bc7-1bafca691acc';
  });

  it('returns an application', async () => {
    const application = {
      id: 'f6f7941f-f7ea-4454-838e-31a17a840144',
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

    getApplicationByIdMock.mockResolvedValue(application);

    const response = await request(app).get(
      '/api/applications/f6f7941f-f7ea-4454-838e-31a17a840144',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(application);

    expect(getApplicationByIdMock).toHaveBeenCalledWith(
      'f6f7941f-f7ea-4454-838e-31a17a840144',
      'b74ed226-9d3c-4659-8bc7-1bafca691acc',
    );
  });

  it('returns 404 when the application does not exist', async () => {
    getApplicationByIdMock.mockResolvedValue(undefined);

    const response = await request(app).get(
      '/api/applications/00000000-0000-0000-0000-000000000000',
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Application not found',
    });
  });

  it('returns 400 for an invalid application ID', async () => {
    const response = await request(app).get('/api/applications/not-a-uuid');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid application ID',
    });

    expect(getApplicationByIdMock).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/applications/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEV_USER_ID = 'b74ed226-9d3c-4659-8bc7-1bafca691acc';
  });

  it('updates an application', async () => {
    const updatedApplication = {
      id: 'f6f7941f-f7ea-4454-838e-31a17a840144',
      userId: 'b74ed226-9d3c-4659-8bc7-1bafca691acc',
      company: 'Google',
      role: 'Frontend Developer',
      location: 'Bangalore',
      source: 'Manual',
      status: 'Interview',
      appliedAt: '2026-09-10T00:00:00.000Z',
      url: 'https://example.com/job',
      notes: 'Technical round scheduled',
      sourceMessageId: null,
    };

    updateApplicationMock.mockResolvedValue(updatedApplication);

    const response = await request(app)
      .patch('/api/applications/f6f7941f-f7ea-4454-838e-31a17a840144')
      .send({
        status: 'Interview',
        notes: 'Technical round scheduled',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedApplication);

    expect(updateApplicationMock).toHaveBeenCalledWith(
      'f6f7941f-f7ea-4454-838e-31a17a840144',
      'b74ed226-9d3c-4659-8bc7-1bafca691acc',
      {
        status: 'Interview',
        notes: 'Technical round scheduled',
      },
    );
  });

  it('returns 400 for invalid update data', async () => {
    const response = await request(app)
      .patch('/api/applications/f6f7941f-f7ea-4454-838e-31a17a840144')
      .send({
        status: 'InvalidStatus',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Validation failed',
      }),
    );

    expect(updateApplicationMock).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid application ID', async () => {
    const response = await request(app).patch('/api/applications/not-a-uuid').send({
      status: 'Interview',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid application ID',
    });

    expect(updateApplicationMock).not.toHaveBeenCalled();
  });

  it('returns 404 when the application does not exist', async () => {
    updateApplicationMock.mockResolvedValue(undefined);

    const response = await request(app)
      .patch('/api/applications/00000000-0000-0000-0000-000000000000')
      .send({
        status: 'Interview',
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Application not found',
    });
  });
});
