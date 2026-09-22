import type { CreateApplicationInput, JobApplication } from '../features/applications/types';

const API_BASE_URL = 'http://localhost:3000/api';

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch(`${API_BASE_URL}/applications`);

  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }

  return response.json();
}

export async function createApplication(input: CreateApplicationInput): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...input,
      appliedAt: new Date(`${input.appliedAt}T00:00:00`).toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create application');
  }

  return response.json();
}

export async function updateApplication(
  applicationId: string,
  input: Partial<CreateApplicationInput>,
): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...input,
      ...(input.appliedAt
        ? {
            appliedAt: new Date(`${input.appliedAt}T00:00:00`).toISOString(),
          }
        : {}),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update application');
  }

  return response.json();
}

export async function deleteApplication(applicationId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete application');
  }
}
