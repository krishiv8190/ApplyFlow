import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useApplications } from './ApplicationContext';
import { applicationSources, applicationStatuses } from './types';

const applicationFormSchema = z.object({
  company: z.string().trim().min(2, 'Enter a company name.'),
  role: z.string().trim().min(2, 'Enter a role title.'),
  location: z.string().trim().min(2, 'Enter a location or Remote.'),
  source: z.enum(applicationSources),
  status: z.enum(applicationStatuses),
  appliedAt: z.string().min(1, 'Choose the application date.'),
  url: z.union([z.string().url('Enter a valid URL.'), z.literal('')]),
  notes: z.string().max(1_000, 'Notes must be 1,000 characters or fewer.'),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const inputClassName =
  'mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20';

export function EditApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const { applications, editApplication } = useApplications();
  const navigate = useNavigate();

  const application = applications.find((existingApplication) => existingApplication.id === id);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ApplicationFormValues>({
    defaultValues: application
      ? {
          company: application.company,
          role: application.role,
          location: application.location,
          source: application.source,
          status: application.status,
          appliedAt: application.appliedAt.slice(0, 10),
          url: application.url ?? '',
          notes: application.notes ?? '',
        }
      : undefined,
    resolver: zodResolver(applicationFormSchema),
  });

  if (!application) {
    return (
      <div className="mx-auto max-w-3xl">
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

  async function onSubmit(values: ApplicationFormValues) {
    if (!application) {
      return;
    }

    await editApplication(application.id, {
      ...values,
      url: values.url || undefined,
      notes: values.notes || undefined,
    });

    navigate(`/applications/${application.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="border-b border-slate-800 pb-8">
        <p className="text-sm font-medium text-indigo-300">APPLICATIONS</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Edit application
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
          Update the details for {application.company}.
        </p>
      </header>

      <form
        className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField error={errors.company?.message} label="Company" name="company">
            <input
              {...register('company')}
              autoComplete="organization"
              className={inputClassName}
              id="company"
              placeholder="e.g. Vercel"
            />
          </FormField>

          <FormField error={errors.role?.message} label="Role" name="role">
            <input
              {...register('role')}
              className={inputClassName}
              id="role"
              placeholder="e.g. Frontend Engineer"
            />
          </FormField>

          <FormField error={errors.location?.message} label="Location" name="location">
            <input
              {...register('location')}
              className={inputClassName}
              id="location"
              placeholder="e.g. Remote or Bengaluru, India"
            />
          </FormField>

          <FormField error={errors.source?.message} label="Source" name="source">
            <select {...register('source')} className={inputClassName} id="source">
              {applicationSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </FormField>

          <FormField error={errors.appliedAt?.message} label="Applied date" name="appliedAt">
            <input
              {...register('appliedAt')}
              className={inputClassName}
              id="appliedAt"
              type="date"
            />
          </FormField>

          <FormField error={errors.status?.message} label="Status" name="status">
            <select {...register('status')} className={inputClassName} id="status">
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="mt-5">
          <FormField error={errors.url?.message} label="Job URL (optional)" name="url">
            <input
              {...register('url')}
              className={inputClassName}
              id="url"
              placeholder="https://company.com/careers/..."
              type="url"
            />
          </FormField>
        </div>

        <div className="mt-5">
          <FormField error={errors.notes?.message} label="Notes (optional)" name="notes">
            <textarea
              {...register('notes')}
              className={inputClassName}
              id="notes"
              placeholder="Recruiter name, referral context, or a useful reminder."
              rows={4}
            />
          </FormField>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 pt-5">
          <Link
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            to={`/applications/${application.id}`}
          >
            Cancel
          </Link>

          <button
            className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  label: string;
  name: string;
}

function FormField({ children, error, label, name }: FormFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-200" htmlFor={name}>
        {label}
      </label>

      {children}

      {error ? (
        <p className="mt-1.5 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
