import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: ReactNode;
}

export default function MetricCard({
  title,
  value,
  change,
  positive,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:border-slate-600 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>

        {icon && (
          <div className="rounded-lg bg-slate-800 p-2 text-slate-300">
            {icon}
          </div>
        )}
      </div>

      <h3 className="text-2xl font-semibold tracking-tight text-white">
        {value}
      </h3>

      {change && (
        <p
          className={`mt-2 text-sm ${
            positive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
}