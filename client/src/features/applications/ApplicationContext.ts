import { createContext, useContext } from 'react';

import type { CreateApplicationInput, JobApplication } from './types';

interface ApplicationContextValue {
  addApplication: (input: CreateApplicationInput) => Promise<void>;
  editApplication: (applicationId: string, input: Partial<CreateApplicationInput>) => Promise<void>;
  removeApplication: (applicationId: string) => Promise<void>;
  loadApplications: () => Promise<void>;
  applications: JobApplication[];
}

export const ApplicationContext = createContext<ApplicationContextValue | null>(null);

export function useApplications() {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider.');
  }

  return context;
}
