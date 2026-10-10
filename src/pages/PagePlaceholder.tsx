import type { ReactNode } from "react";

interface PagePlaceholderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PagePlaceholder({
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-[#0d1420] p-6">
      <p className="mb-2 text-xs font-semibold tracking-widest text-emerald-400">
        HEDGEX WORKSPACE
      </p>

      <h1 className="text-2xl font-semibold text-white">{title}</h1>

      <p className="mt-2 text-sm text-slate-400">{description}</p>

      <div className="mt-6">
        {children ?? (
          <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
            <p className="text-sm text-slate-400">
              This module will be implemented in the next development step.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}