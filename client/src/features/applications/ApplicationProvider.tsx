import { type PropsWithChildren, useEffect, useReducer } from 'react';

import { createApplication, getApplications, updateApplication } from '../../api/applications';
import { ApplicationContext } from './ApplicationContext';
import type { CreateApplicationInput, JobApplication } from './types';

interface ApplicationState {
  applications: JobApplication[];
}

type ApplicationAction =
  | {
      type: 'applicationAdded';
      application: JobApplication;
    }
  | {
      type: 'applicationsLoaded';
      applications: JobApplication[];
    }
  | {
      type: 'applicationUpdated';
      application: JobApplication;
    };
function applicationReducer(state: ApplicationState, action: ApplicationAction): ApplicationState {
  switch (action.type) {
    case 'applicationAdded':
      return {
        applications: [action.application, ...state.applications],
      };

    case 'applicationsLoaded':
      return {
        applications: action.applications,
      };
    case 'applicationUpdated':
      return {
        applications: state.applications.map((existingApplication) =>
          existingApplication.id === action.application.id
            ? action.application
            : existingApplication,
        ),
      };
  }
}

export function ApplicationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(applicationReducer, {
    applications: [],
  });

  useEffect(() => {
    async function loadApplications() {
      const applications = await getApplications();

      dispatch({
        type: 'applicationsLoaded',
        applications,
      });
    }

    loadApplications();
  }, []);

  async function addApplication(input: CreateApplicationInput) {
    const application = await createApplication(input);

    dispatch({
      type: 'applicationAdded',
      application,
    });
  }

  async function editApplication(applicationId: string, input: Partial<CreateApplicationInput>) {
    const application = await updateApplication(applicationId, input);

    dispatch({
      type: 'applicationUpdated',
      application,
    });
  }
  return (
    <ApplicationContext.Provider
      value={{
        addApplication,
        editApplication,
        applications: state.applications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
