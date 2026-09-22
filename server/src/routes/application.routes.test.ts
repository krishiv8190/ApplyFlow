import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';

const {
  createApplicationMock,
  deleteApplicationMock,
  getApplicationsMock,
  getApplicationByIdMock,
  updateApplicationMock,
} = vi.hoisted(() => ({
  createApplicationMock: vi.fn(),
  deleteApplicationMock: vi.fn(),
  getApplicationsMock: vi.fn(),
  getApplicationByIdMock: vi.fn(),
  updateApplicationMock: vi.fn(),
}));

vi.mock('../services/application.service.js', () => ({
  createApplication: createApplicationMock,
  deleteApplication: deleteApplicationMock,
  getApplications: getApplicationsMock,
  getApplicationById: getApplicationByIdMock,
  updateApplication: updateApplicationMock,
}));

import app from '../app.js';

const TEST_USER_ID = 'b74ed226-9d3c-4659-8bc7-1bafca691acc';
const TEST_JWT_SECRET = 'test-secret';

function createTestToken() {
  return jwt.sign(
    {
      userId: TEST_USER_ID,
    },
    TEST_JWT_SECRET,
  );
}

describe('POST /api/applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  it('creates an application', async () => {
    const createdApplication = {
      id: 'application-123',
      userId: TEST_USER_ID,
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

    const response = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
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
      userId: TEST_USER_ID,
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
    const response = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
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
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  it('fetches applications for the user', async () => {
    const applications = [
      {
        id: 'application-123',
        userId: TEST_USER_ID,
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

    const response = await request(app)
      .get('/api/applications')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(applications);

    expect(getApplicationsMock).toHaveBeenCalledWith(TEST_USER_ID);
  });
});

describe('GET /api/applications/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  it('returns an application', async () => {
    const application = {
      id: 'f6f7941f-f7ea-4454-838e-31a17a840144',
      userId: TEST_USER_ID,
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

    const response = await request(app)
      .get('/api/applications/f6f7941f-f7ea-4454-838e-31a17a840144')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(application);

    expect(getApplicationByIdMock).toHaveBeenCalledWith(
      'f6f7941f-f7ea-4454-838e-31a17a840144',
      TEST_USER_ID,
    );
  });

  it('returns 404 when the application does not exist', async () => {
    getApplicationByIdMock.mockResolvedValue(undefined);

    const response = await request(app)
      .get('/api/applications/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Application not found',
    });
  });

  it('returns 400 for an invalid application ID', async () => {
    const response = await request(app)
      .get('/api/applications/not-a-uuid')
      .set('Authorization', `Bearer ${createTestToken()}`);

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
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  it('updates an application', async () => {
    const updatedApplication = {
      id: 'f6f7941f-f7ea-4454-838e-31a17a840144',
      userId: TEST_USER_ID,
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
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
        status: 'Interview',
        notes: 'Technical round scheduled',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedApplication);

    expect(updateApplicationMock).toHaveBeenCalledWith(
      'f6f7941f-f7ea-4454-838e-31a17a840144',
      TEST_USER_ID,
      {
        status: 'Interview',
        notes: 'Technical round scheduled',
      },
    );
  });

  it('returns 400 for invalid update data', async () => {
    const response = await request(app)
      .patch('/api/applications/f6f7941f-f7ea-4454-838e-31a17a840144')
      .set('Authorization', `Bearer ${createTestToken()}`)
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
    const response = await request(app)
      .patch('/api/applications/not-a-uuid')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
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
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
        status: 'Interview',
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Application not found',
    });
  });
});

describe('DELETE /api/applications/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  it('deletes an application', async () => {
    const deletedApplication = {
      id: 'f6f7941f-f7ea-4454-838e-31a17a840144',
      userId: TEST_USER_ID,
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

    deleteApplicationMock.mockResolvedValue(deletedApplication);

    const response = await request(app)
      .delete('/api/applications/f6f7941f-f7ea-4454-838e-31a17a840144')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Application deleted successfully',
      application: deletedApplication,
    });

    expect(deleteApplicationMock).toHaveBeenCalledWith(
      'f6f7941f-f7ea-4454-838e-31a17a840144',
      TEST_USER_ID,
    );
  });

  it('returns 400 for an invalid application ID', async () => {
    const response = await request(app)
      .delete('/api/applications/not-a-uuid')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid application ID',
    });

    expect(deleteApplicationMock).not.toHaveBeenCalled();
  });

  it('returns 404 when the application does not exist', async () => {
    deleteApplicationMock.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/api/applications/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Application not found',
    });
  });
});
