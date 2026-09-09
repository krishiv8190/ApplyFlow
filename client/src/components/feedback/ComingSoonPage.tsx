interface ComingSoonPageProps {
  title: string;
  description: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <section className="mx-auto max-w-6xl rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
      <p className="text-sm font-medium text-indigo-300">IN DEVELOPMENT</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
    </section>
  );
}
