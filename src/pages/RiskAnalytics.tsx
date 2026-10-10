import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Gauge,
  ShieldCheck,
  TrendingDown,
  Waves,
} from "lucide-react";

const riskMetrics = [
  {
    title: "1-Day Value at Risk",
    value: "$48,250",
    subtitle: "Illustrative 95% confidence",
    icon: ShieldCheck,
    color: "text-emerald-400",
    background: "bg-emerald-400/10",
  },
  {
    title: "Conditional VaR",
    value: "$63,800",
    subtitle: "Illustrative tail-loss estimate",
    icon: Activity,
    color: "text-blue-400",
    background: "bg-blue-400/10",
  },
  {
    title: "Annualized Volatility",
    value: "12.6%",
    subtitle: "Sample portfolio volatility",
    icon: Waves,
    color: "text-violet-400",
    background: "bg-violet-400/10",
  },
  {
    title: "Risk Exposure",
    value: "$2.45M",
    subtitle: "Illustrative gross exposure",
    icon: Gauge,
    color: "text-amber-400",
    background: "bg-amber-400/10",
  },
];

const currencyRisks = [
  { pair: "USD/INR", exposure: "$620K", risk: 78, level: "High" },
  { pair: "EUR/USD", exposure: "$540K", risk: 54, level: "Medium" },
  { pair: "GBP/USD", exposure: "$390K", risk: 42, level: "Medium" },
  { pair: "USD/JPY", exposure: "$460K", risk: 67, level: "High" },
  { pair: "AUD/USD", exposure: "$280K", risk: 29, level: "Low" },
];

const scenarios = [
  {
    name: "Mild currency movement",
    shock: "±2%",
    impact: "$18,400",
    severity: "Low",
  },
  {
    name: "Moderate market shock",
    shock: "±5%",
    impact: "$46,000",
    severity: "Medium",
  },
  {
    name: "Severe market shock",
    shock: "±10%",
    impact: "$92,000",
    severity: "High",
  },
];

function riskColor(level: string) {
  if (level === "High") {
    return "bg-rose-400/10 text-rose-400";
  }

  if (level === "Medium") {
    return "bg-amber-400/10 text-amber-400";
  }

  return "bg-emerald-400/10 text-emerald-400";
}

export default function RiskAnalytics() {
  const [selectedConfidence, setSelectedConfidence] = useState("95%");
  const [selectedHorizon, setSelectedHorizon] = useState("1 day");
  const [selectedShock, setSelectedShock] = useState("5");

  const shockImpact =
    Number(selectedShock) === 2
      ? "$18,400"
      : Number(selectedShock) === 5
        ? "$46,000"
        : "$92,000";

  return (
    <div className="min-h-full space-y-8 bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Activity size={16} className="text-emerald-400" />
            Risk Intelligence / Analytics
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Risk Analytics
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Explore portfolio risk indicators and hypothetical currency shocks.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Confidence level
            <select
              value={selectedConfidence}
              onChange={(event) =>
                setSelectedConfidence(event.target.value)
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
            >
              <option>90%</option>
              <option>95%</option>
              <option>99%</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Time horizon
            <select
              value={selectedHorizon}
              onChange={(event) => setSelectedHorizon(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
            >
              <option>1 day</option>
              <option>10 days</option>
              <option>30 days</option>
            </select>
          </label>
        </div>
      </header>

      {/* Data notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <AlertTriangle
          size={20}
          className="mt-0.5 shrink-0 text-amber-400"
        />

        <div>
          <p className="text-sm font-semibold text-amber-300">
            Demonstration risk model
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            All values are illustrative. The confidence and horizon selectors
            demonstrate the interface only; they do not recalculate VaR.
            These figures are not suitable for financial decisions.
          </p>
        </div>
      </div>

      {/* Risk metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {riskMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">{metric.title}</p>

                <div className={`rounded-xl p-3 ${metric.background}`}>
                  <Icon size={20} className={metric.color} />
                </div>
              </div>

              <p className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                {metric.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {metric.subtitle}
              </p>
            </article>
          );
        })}
      </section>

      {/* Risk overview */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Currency Risk Breakdown
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Illustrative relative risk scores by currency pair
              </p>
            </div>

            <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
              {selectedConfidence} · {selectedHorizon}
            </span>
          </div>

          <div className="mt-7 space-y-6">
            {currencyRisks.map((item) => (
              <div key={item.pair}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium">{item.pair}</span>
                    <span className="ml-3 text-xs text-slate-500">
                      {item.exposure}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {item.risk}/100
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${riskColor(item.level)}`}
                    >
                      {item.level}
                    </span>
                  </div>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.level === "High"
                        ? "bg-rose-400"
                        : item.level === "Medium"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                    }`}
                    style={{ width: `${item.risk}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-500">
            Risk scores are invented demonstration values, not statistically
            estimated measurements.
          </div>
        </article>

        {/* Risk summary */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold">Risk Assessment</h2>
          <p className="mt-1 text-sm text-slate-400">
            Illustrative portfolio indicators
          </p>

          <div className="mt-7 rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={18} />
              <span className="text-sm font-semibold">
                Concentration watch
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              The sample model assigns relatively high risk scores to USD/INR
              and USD/JPY. Review concentration and hedge coverage in a
              validated model.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-sm text-slate-400">
                Sample hedge coverage
              </span>
              <span className="font-semibold text-emerald-400">64.8%</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-sm text-slate-400">
                Illustrative risk level
              </span>
              <span className="font-semibold text-amber-400">Moderate</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Model status
              </span>
              <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-400">
                Demo only
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* Stress testing */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold">Currency Stress Testing</h2>
            <p className="mt-1 text-sm text-slate-400">
              Explore hypothetical market-shock scenarios.
            </p>
          </div>

          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Hypothetical shock size
            <select
              value={selectedShock}
              onChange={(event) => setSelectedShock(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
            >
              <option value="2">±2% shock</option>
              <option value="5">±5% shock</option>
              <option value="10">±10% shock</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article
              key={scenario.name}
              className={`rounded-xl border p-4 transition ${
                Number(selectedShock) === Number(scenario.shock.replace("%", "").replace("±", ""))
                  ? "border-emerald-400/50 bg-emerald-400/5"
                  : "border-slate-800 bg-slate-950/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{scenario.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Shock size: {scenario.shock}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-xs ${riskColor(scenario.severity)}`}
                >
                  {scenario.severity}
                </span>
              </div>

              <p className="mt-5 text-2xl font-bold">{scenario.impact}</p>

              <p className="mt-1 text-xs text-slate-500">
                Hypothetical portfolio impact
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-950/70 p-4">
          {Number(selectedShock) >= 10 ? (
            <TrendingDown size={18} className="shrink-0 text-rose-400" />
          ) : (
            <ArrowUpRight size={18} className="shrink-0 text-amber-400" />
          )}

          <p className="text-sm text-slate-300">
            Selected scenario: ±{selectedShock}% shock. Illustrative impact:{" "}
            <span className="font-semibold text-white">{shockImpact}</span>.
            This is a preset estimate, not a calculated forecast.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col justify-between gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row">
        <span>HedgeX · Risk Intelligence</span>
        <span>Illustrative risk data · Not financial advice</span>
      </footer>
    </div>
  );
}