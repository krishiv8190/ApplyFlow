import { type PropsWithChildren, useReducer } from 'react';

import { ApplicationContext } from './ApplicationContext';
import { mockApplications } from './mockApplications';
import type { CreateApplicationInput, JobApplication } from './types';

interface ApplicationState {
  applications: JobApplication[];
}

type ApplicationAction = {
  type: 'applicationAdded';
  application: JobApplication;
};

function applicationReducer(state: ApplicationState, action: ApplicationAction): ApplicationState {
  switch (action.type) {
    case 'applicationAdded':
      return {
        applications: [action.application, ...state.applications],
      };
  }
}

export function ApplicationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(applicationReducer, {
    applications: mockApplications,
  });

  function addApplication(input: CreateApplicationInput) {
    dispatch({
      type: 'applicationAdded',
      application: {
        ...input,
        id: crypto.randomUUID(),
      },
    });
  }

  return (
    <ApplicationContext.Provider value={{ addApplication, applications: state.applications }}>
      {children}
    </ApplicationContext.Provider>
  );
}
