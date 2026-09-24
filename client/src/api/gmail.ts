const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
export interface GmailStatus {
  connected: boolean;
  email: string | null;
}

export async function getGmailStatus(): Promise<GmailStatus> {
  const token = localStorage.getItem('applyflow_token');

  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/gmail/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to get Gmail status');
  }

  return data;
}

export async function getGmailAuthorizationUrl(): Promise<string> {
  const token = localStorage.getItem('applyflow_token');

  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/gmail/connect`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to start Gmail connection');
  }

  return data.authorizationUrl;
}

export interface GmailSyncResult {
  messageId: string;
  action: 'created' | 'updated' | 'skipped';
  applicationId: string;
}

export async function syncGmailApplications(): Promise<GmailSyncResult[]> {
  const token = localStorage.getItem('applyflow_token');

  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/gmail/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to sync Gmail applications');
  }

  return data.results;
}
