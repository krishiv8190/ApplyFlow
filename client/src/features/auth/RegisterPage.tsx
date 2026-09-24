import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/useAuth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
      });

      navigate('/login');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create account. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-10">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <Link className="flex items-center" to="/">
            <img alt="ApplyFlow" className="h-8 w-auto" src="/applyflow-logo-dark.svg" />
          </Link>

          <Link className="text-sm font-medium text-slate-400 transition hover:text-white" to="/">
            Back to home
          </Link>
        </header>

        {/* Main */}
        <main className="flex flex-1 items-center py-10 lg:py-14">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Branding / value proposition */}
            <section className="hidden lg:block">
              <div className="max-w-xl">
                <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
                  Start your ApplyFlow journey
                </div>

                <h1 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                  Take control of your{' '}
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    job search.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                  Create your ApplyFlow account and keep your applications, Gmail updates, interview
                  stages, and offers organized in one place.
                </p>

                <div className="mt-8 space-y-4">
                  <Feature text="Keep every application organized" />
                  <Feature text="Automatically sync job-related Gmail messages" />
                  <Feature text="Track your progress from Applied to Offer" />
                </div>
              </div>
            </section>

            {/* Register card */}
            <section className="mx-auto w-full max-w-md lg:ml-auto">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur">
                {/* Mobile branding */}
                <div className="mb-8 lg:hidden">
                  <div className="mb-5 flex items-center">
                    <img alt="ApplyFlow" className="h-8 w-auto" src="/applyflow-logo-dark.svg" />
                  </div>
                </div>

                <div className="mb-8">
                  <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Create your account
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Start organizing your job search with ApplyFlow.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-slate-200"
                        htmlFor="firstName"
                      >
                        First name
                      </label>

                      <input
                        autoComplete="given-name"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        id="firstName"
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="John"
                        required
                        type="text"
                        value={firstName}
                      />
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-sm font-medium text-slate-200"
                        htmlFor="lastName"
                      >
                        Last name
                      </label>

                      <input
                        autoComplete="family-name"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        id="lastName"
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Doe"
                        required
                        type="text"
                        value={lastName}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-slate-200"
                      htmlFor="email"
                    >
                      Email
                    </label>

                    <input
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      id="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-slate-200"
                      htmlFor="password"
                    >
                      Password
                    </label>

                    <input
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      id="password"
                      minLength={8}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      required
                      type="password"
                      value={password}
                    />

                    <p className="mt-2 text-xs text-slate-500">Minimum 8 characters.</p>
                  </div>

                  <button
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-xs text-slate-600">OR</span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                <p className="text-center text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link
                    className="font-medium text-indigo-400 transition hover:text-indigo-300"
                    to="/login"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-slate-600">
                Your job search, organized in one place.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs text-indigo-400">
        ✓
      </span>

      <span>{text}</span>
    </div>
  );
}
