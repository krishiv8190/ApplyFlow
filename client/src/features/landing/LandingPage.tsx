import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-[-200px] top-[400px] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-slate-800/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link className="flex items-center" to="/">
            <img alt="ApplyFlow" className="h-8 w-auto" src="/applyflow-logo-dark.svg" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              className="hidden px-4 py-2 text-sm font-medium text-slate-400 transition hover:text-white sm:block"
              to="/login"
            >
              Sign in
            </Link>

            <Link
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-600 hover:bg-slate-800"
              to="/register"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8 lg:pb-20 lg:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Hero copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Your job search, organized.
              </div>

              <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Stop losing track of your{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  job applications.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                ApplyFlow brings your applications, Gmail updates, interview stages, and offers
                together in one simple workspace.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                  to="/register"
                >
                  Start tracking for free
                </Link>

                <Link
                  className="rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                  to="/login"
                >
                  Sign in
                </Link>
              </div>

              {/* Trust points */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <FeaturePoint text="Application tracking" />
                <FeaturePoint text="Gmail integration" />
                <FeaturePoint text="Progress tracking" />
              </div>
            </div>

            {/* Product preview */}
            <ProductPreview />
          </div>
        </section>

        {/* Feature section */}
        <section className="border-t border-slate-800/70">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Everything in one place
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built around the way you actually search for jobs.
              </h2>

              <p className="mt-4 text-slate-400">
                Keep the important details together instead of spreading your job search across
                spreadsheets, emails, and bookmarks.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <FeatureCard
                number="01"
                title="Track applications"
                description="Store companies, roles, locations, statuses, links, notes, and application dates in one place."
              />

              <FeatureCard
                number="02"
                title="Sync Gmail"
                description="Connect your Gmail account and let ApplyFlow identify relevant application and recruiting emails."
              />

              <FeatureCard
                number="03"
                title="See your progress"
                description="Move from Applied to OA, Interview, Offer, Rejected, or other stages while keeping the full history together."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-800/70">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to organize your job search?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Stop switching between spreadsheets and inboxes. Keep your applications in one place
              with ApplyFlow.
            </p>

            <Link
              className="mt-8 inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
              to="/register"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <img alt="ApplyFlow" className="h-7 w-auto" src="/applyflow-logo-dark.svg" />

          <span>Built for a better job search.</span>
        </div>
      </footer>
    </div>
  );
}

function FeaturePoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 text-xs text-indigo-400">
        ✓
      </span>

      <span>{text}</span>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-3xl bg-indigo-600/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
        {/* Window header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          </div>

          <span className="text-xs text-slate-500">ApplyFlow</span>
        </div>

        {/* Dashboard */}
        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Dashboard</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Applications</h3>
            </div>

            <div className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
              + Add
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatCard label="Applied" value="24" />
            <StatCard label="Interviews" value="6" />
            <StatCard label="Offers" value="2" />
          </div>

          {/* Applications */}
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-800">
            <ApplicationRow company="Google" role="Frontend Engineer" status="Interview" />

            <ApplicationRow company="Microsoft" role="Software Engineer" status="OA" />

            <ApplicationRow company="Stripe" role="Frontend Developer" status="Applied" />

            <ApplicationRow company="Amazon" role="UI Engineer" status="Offer" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ApplicationRow({
  company,
  role,
  status,
}: {
  company: string;
  role: string;
  status: string;
}) {
  const statusClasses: Record<string, string> = {
    Interview: 'bg-violet-500/10 text-violet-300',
    OA: 'bg-amber-500/10 text-amber-300',
    Applied: 'bg-blue-500/10 text-blue-300',
    Offer: 'bg-emerald-500/10 text-emerald-300',
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-200">{company}</p>
        <p className="truncate text-xs text-slate-500">{role}</p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
          statusClasses[status] ?? 'bg-slate-800 text-slate-400'
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900">
      <span className="text-xs font-semibold text-indigo-400">{number}</span>

      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
