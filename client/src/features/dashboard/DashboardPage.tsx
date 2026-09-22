import { Link } from 'react-router-dom';

import { useApplications } from '../applications/ApplicationContext';
import { StatusBadge } from '../applications/StatusBadge';
import { applicationStatuses, type ApplicationStatus } from '../applications/types';

const numberFormatter = new Intl.NumberFormat('en-IN');

function formatAppliedDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

export function DashboardPage() {
  const { applications } = useApplications();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const currentMonthLabel = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${currentMonth}-01T00:00:00`));

  const applicationsThisMonth = applications.filter((application) =>
    application.appliedAt.startsWith(currentMonth),
  ).length;

  const interviews = applications.filter(
    (application) => application.status === 'Interview',
  ).length;

  const offers = applications.filter((application) => application.status === 'Offer').length;

  const metrics = [
    {
      label: 'Applications',
      value: applications.length,
      detail: 'All time',
    },
    {
      label: 'This month',
      value: applicationsThisMonth,
      detail: currentMonthLabel,
    },
    {
      label: 'Interviews',
      value: interviews,
      detail: 'In progress',
    },
    {
      label: 'Offers',
      value: offers,
      detail: 'Worth celebrating',
    },
  ];

  const statusCounts = applicationStatuses.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status).length,
  }));

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-300">DASHBOARD</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your application pipeline
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
            A focused view of the opportunities currently moving forward.
          </p>
        </div>

        <Link
          className="inline-flex w-fit items-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          to="/applications/new"
        >
          New application
        </Link>
      </header>

      {/* Metrics */}
      <section
        aria-label="Application summary"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <article
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
            key={metric.label}
          >
            <p className="text-sm font-medium text-slate-400">{metric.label}</p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {numberFormatter.format(metric.value)}
            </p>

            <p className="mt-2 text-xs text-slate-500">{metric.detail}</p>
          </article>
        ))}
      </section>

      {/* Status breakdown */}
      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-white">Pipeline status</h2>

          <p className="mt-1 text-sm text-slate-400">
            How your applications are distributed across the pipeline.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {statusCounts.map(({ status, count }) => (
            <div
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3"
              key={status}
            >
              <StatusBadge status={status as ApplicationStatus} />

              <span className="text-lg font-semibold text-white">{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent applications */}
      <section className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-white">Recent applications</h2>

            <p className="mt-1 text-sm text-slate-400">
              Your five most recently added opportunities.
            </p>
          </div>

          <Link
            className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
            to="/applications"
          >
            View all
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-200">No applications yet</p>

            <p className="mt-2 text-sm text-slate-500">
              Add your first application to start building your pipeline.
            </p>

            <Link
              className="mt-5 inline-flex rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              to="/applications/new"
            >
              Add application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6" scope="col">
                    Company
                  </th>

                  <th className="px-5 py-3 font-medium" scope="col">
                    Status
                  </th>

                  <th className="px-5 py-3 font-medium" scope="col">
                    Applied
                  </th>

                  <th className="px-5 py-3 font-medium sm:px-6" scope="col">
                    Source
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {recentApplications.map((application) => (
                  <tr className="transition hover:bg-slate-800/50" key={application.id}>
                    <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                      <Link className="block" to={`/applications/${application.id}`}>
                        <p className="font-medium text-slate-100 transition hover:text-indigo-300">
                          {application.company}
                        </p>

                        <p className="mt-1 text-slate-400">{application.role}</p>
                      </Link>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                      {formatAppliedDate(application.appliedAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-400 sm:px-6">
                      {application.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
