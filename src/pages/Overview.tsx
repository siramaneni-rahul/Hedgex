import { marketData } from "../data/marketData";
import ExposureChart from "../components/dashboard/ExposureChart";
import {
  Wallet,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe2,
  Clock3,
} from "lucide-react";

import MetricCard from "../components/ui/MetricCard";

const currencyPairs = marketData;

const riskItems = [
  { label: "Currency concentration", value: 72, color: "bg-blue-500" },
  { label: "Hedge coverage", value: 64, color: "bg-emerald-500" },
  { label: "Portfolio diversification", value: 81, color: "bg-violet-500" },
];

export default function Overview() {
  return (
    <div className="min-h-full space-y-8 bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Globe2 size={16} />
            <span>Risk Management / Overview</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Portfolio Overview
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Monitor your currency exposure, portfolio risk, and hedging performance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 sm:self-auto">
          <Clock3 size={16} className="text-emerald-400" />
          Demo market snapshot
        </div>
      </header>

      {/* Demo Data Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <Activity size={20} className="mt-0.5 shrink-0 text-amber-400" />

        <div>
          <p className="text-sm font-medium text-amber-300">
            Demonstration environment
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Figures shown are illustrative sample data, not live market quotes
            or validated financial risk calculations.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Portfolio Summary</h2>
          <span className="text-xs text-slate-500">Sample metrics</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Exposure"
            value="$2.45M"
            change="Across 8 currency positions"
            positive
            icon={<Wallet size={20} />}
          />

          <MetricCard
            title="Estimated 1-Day VaR"
            value="$48,250"
            change="Illustrative risk estimate"
            positive={false}
            icon={<ShieldCheck size={20} />}
          />

          <MetricCard
            title="Hedge Coverage"
            value="64.8%"
            change="Target: 75%"
            positive
            icon={<TrendingUp size={20} />}
          />

          <MetricCard
            title="Active Positions"
            value="08"
            change="Across 4 currency pairs"
            positive
            icon={<Activity size={20} />}
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Currency Markets */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div>
              <h2 className="font-semibold">Currency Markets</h2>
              <p className="mt-1 text-xs text-slate-400">
                Illustrative foreign exchange prices
              </p>
            </div>

            <span className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300">
              FX Overview
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-560p text-left text-sm">
              <thead className="bg-slate-800/40 text-xs text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Currency Pair</th>
                  <th className="px-5 py-3 font-medium">Sample Rate</th>
                  <th className="px-5 py-3 font-medium">Change</th>
                  <th className="px-5 py-3 text-right font-medium">
                    Exposure
                  </th>
                </tr>
              </thead>

              <tbody>
                {currencyPairs.map((item) => (
                  <tr
                    key={item.pair}
                    className="border-t border-slate-800/80 transition-colors hover:bg-slate-800/30"
                  >
                   <td className="px-5 py-4">
  <div className="flex min-w-0 flex-col">
    <span className="whitespace-nowrap font-semibold text-white">
      {item.pair}
    </span>

    <span className="mt-1 text-xs text-slate-500">
      {item.name}
    </span>
  </div>
</td>

                    <td className="px-5 py-4 font-mono text-slate-200">
                      {item.rate}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          item.positive
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {item.positive ? (
                          <ArrowUpRight size={15} />
                        ) : (
                          <ArrowDownRight size={15} />
                        )}
                        {item.change}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right font-medium text-slate-200">
                      {item.volume}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-800 px-5 py-3 text-xs text-slate-500">
            Sample figures for interface demonstration only.
          </div>
        </section>
        {/* Currency Exposure Chart */}
<section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
  <div className="mb-4">
    <h2 className="font-semibold">Currency Exposure Breakdown</h2>

    <p className="mt-1 text-xs text-slate-400">
      Illustrative exposure distribution by currency
    </p>
  </div>

  <ExposureChart />

  <p className="mt-2 text-xs text-slate-500">
    Sample data for demonstration purposes.
  </p>
</section>

        {/* Portfolio Health */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-6">
            <h2 className="font-semibold">Portfolio Health</h2>
            <p className="mt-1 text-xs text-slate-400">
              Illustrative portfolio indicators
            </p>
          </div>

          <div className="mb-7 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Overall hedge coverage
              </span>
              <ShieldCheck size={19} className="text-emerald-400" />
            </div>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-bold">64.8%</span>
              <span className="mb-1 text-xs text-slate-500">
                of sample exposure
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: "64.8%" }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Illustrative target: 75%
            </p>
          </div>

          <div className="space-y-6">
            {riskItems.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <span className="text-sm font-semibold text-white">
                    {item.value}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-sm font-medium text-blue-300">
              Risk management tip
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Review your currency concentration and hedge coverage when
              evaluating changes in foreign exchange exposure.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="flex flex-col justify-between gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row">
        <span>HedgeX · Cross-Border Risk Management</span>
        <span>Demo dashboard · Not financial advice</span>
      </footer>
    </div>
  );
}