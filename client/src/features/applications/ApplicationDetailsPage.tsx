import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApplications } from './ApplicationContext';
import { ApplicationDetailsView } from './ApplicationDetailsView';

export function ApplicationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { applications, removeApplication } = useApplications();
  const application = applications.find((application) => application.id === id);

  if (!application) {
    return (
      <div className="mx-auto max-w-5xl">
        <Link
          className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
          to="/applications"
        >
          ← Back to applications
        </Link>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-8">
          <h1 className="text-xl font-semibold text-white">Application not found</h1>
          <p className="mt-2 text-sm text-slate-400">
            The application may have been deleted or the URL may be invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ApplicationDetailsView
      application={application}
      onDelete={async () => {
        const confirmed = window.confirm(
          `Are you sure you want to delete the application for ${application.company}?`,
        );

        if (!confirmed) {
          return;
        }

        await removeApplication(application.id);
        navigate('/applications');
      }}
      onEdit={() => {
        navigate(`/applications/${application.id}/edit`);
      }}
    />
  );
}
