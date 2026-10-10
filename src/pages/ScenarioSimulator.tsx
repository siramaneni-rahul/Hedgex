import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

type ScenarioType = "custom" | "recession" | "riskOff" | "recovery";

const scenarioPresets: Record<
  Exclude<ScenarioType, "custom">,
  { name: string; description: string; usd: number; eur: number; gbp: number }
> = {
  recession: {
    name: "Global Recession",
    description: "Simulate a broad economic slowdown and market stress.",
    usd: 4,
    eur: -7,
    gbp: -9,
  },
  riskOff: {
    name: "Risk-Off Shock",
    description: "Simulate a sudden flight to perceived safer assets.",
    usd: 6,
    eur: -4,
    gbp: -6,
  },
  recovery: {
    name: "Economic Recovery",
    description: "Simulate improving risk sentiment and economic growth.",
    usd: -3,
    eur: 5,
    gbp: 7,
  },
};

const initialExposures = {
  usd: 1_000_000,
  eur: 750_000,
  gbp: 500_000,
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function ScenarioSimulator() {
  const [scenario, setScenario] = useState<ScenarioType>("recession");
  const [usdShock, setUsdShock] = useState(4);
  const [eurShock, setEurShock] = useState(-7);
  const [gbpShock, setGbpShock] = useState(-9);
  const [hedgeRatio, setHedgeRatio] = useState(50);
  const [exposures, setExposures] = useState(initialExposures);

  const updateScenario = (value: ScenarioType) => {
    setScenario(value);

    if (value !== "custom") {
      const preset = scenarioPresets[value];
      setUsdShock(preset.usd);
      setEurShock(preset.eur);
      setGbpShock(preset.gbp);
    }
  };

  const results = useMemo(() => {
    const usdImpact = exposures.usd * (usdShock / 100);
    const eurImpact = exposures.eur * (eurShock / 100);
    const gbpImpact = exposures.gbp * (gbpShock / 100);

    const grossImpact = usdImpact + eurImpact + gbpImpact;
    const hedgeProtection = Math.abs(grossImpact) * (hedgeRatio / 100);
    const netImpact = grossImpact * (1 - hedgeRatio / 100);

    const totalExposure =
      exposures.usd + exposures.eur + exposures.gbp;

    const portfolioImpactPercent =
      totalExposure === 0 ? 0 : (grossImpact / totalExposure) * 100;

    return {
      usdImpact,
      eurImpact,
      gbpImpact,
      grossImpact,
      hedgeProtection,
      netImpact,
      totalExposure,
      portfolioImpactPercent,
    };
  }, [exposures, usdShock, eurShock, gbpShock, hedgeRatio]);

  const chartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0f172a",
      borderColor: "#334155",
      textStyle: { color: "#e2e8f0" },
      valueFormatter: (value: number) => money(value),
    },
    legend: {
      bottom: 0,
      textStyle: { color: "#94a3b8" },
    },
    grid: {
      left: 20,
      right: 25,
      top: 20,
      bottom: 55,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["USD", "EUR", "GBP"],
      axisLabel: { color: "#94a3b8" },
      axisLine: { lineStyle: { color: "#334155" } },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#94a3b8",
        formatter: (value: number) => `$${Math.round(value / 1000)}k`,
      },
      splitLine: { lineStyle: { color: "#1e293b" } },
    },
    series: [
      {
        name: "Before hedging",
        type: "bar",
        data: [results.usdImpact, results.eurImpact, results.gbpImpact],
        itemStyle: {
          color: "#f87171",
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 45,
      },
      {
        name: "After hedging",
        type: "bar",
        data: [
          results.usdImpact * (1 - hedgeRatio / 100),
          results.eurImpact * (1 - hedgeRatio / 100),
          results.gbpImpact * (1 - hedgeRatio / 100),
        ],
        itemStyle: {
          color: "#34d399",
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 45,
      },
    ],
  };

  const formatImpact = (value: number) =>
    `${value > 0 ? "+" : value < 0 ? "−" : ""}${money(Math.abs(value))}`;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-violet-400">
            <Zap size={16} />
            What-if analysis
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Scenario Simulator
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Test hypothetical market shocks, compare portfolio impacts, and
            explore how hedging may change your exposure.
          </p>
        </div>

        <button
          onClick={() => {
            setScenario("recession");
            setUsdShock(4);
            setEurShock(-7);
            setGbpShock(-9);
            setHedgeRatio(50);
            setExposures(initialExposures);
          }}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white md:self-auto"
        >
          <RotateCcw size={16} />
          Reset simulation
        </button>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <AlertTriangle
          size={19}
          className="mt-0.5 shrink-0 text-amber-400"
        />
        <p className="text-sm leading-6 text-amber-200">
          <strong>Illustrative simulation:</strong> These shocks are hypothetical
          inputs, not forecasts. The model uses simplified exposure calculations
          and does not represent a validated market-risk model.
        </p>
      </div>

      {/* Presets */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Choose a market scenario
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Start with a preset or customize the market shocks below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(
            Object.entries(scenarioPresets) as [
              Exclude<ScenarioType, "custom">,
              (typeof scenarioPresets)[Exclude<ScenarioType, "custom">],
            ][]
          ).map(([key, item]) => (
            <button
              key={key}
              onClick={() => updateScenario(key)}
              className={`rounded-2xl border p-5 text-left transition ${
                scenario === key
                  ? "border-violet-500/60 bg-violet-500/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`font-semibold ${
                    scenario === key ? "text-violet-300" : "text-white"
                  }`}
                >
                  {item.name}
                </span>
                <Activity
                  size={19}
                  className={
                    scenario === key ? "text-violet-400" : "text-slate-500"
                  }
                />
              </div>

              <p className="mt-3 min-h-10 text-sm leading-5 text-slate-400">
                {item.description}
              </p>

              <div className="mt-4 flex gap-2 text-xs">
                <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-300">
                  USD {item.usd > 0 ? "+" : ""}
                  {item.usd}%
                </span>
                <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-300">
                  EUR {item.eur > 0 ? "+" : ""}
                  {item.eur}%
                </span>
                <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-300">
                  GBP {item.gbp > 0 ? "+" : ""}
                  {item.gbp}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Controls */}
        <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-3">
              <SlidersHorizontal size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Scenario controls</h2>
              <p className="text-xs text-slate-500">
                Changes update the results instantly.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                label: "USD market shock",
                value: usdShock,
                setter: setUsdShock,
              },
              {
                label: "EUR market shock",
                value: eurShock,
                setter: setEurShock,
              },
              {
                label: "GBP market shock",
                value: gbpShock,
                setter: setGbpShock,
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-slate-300">
                    {item.label}
                  </label>
                  <span
                    className={`text-sm font-semibold ${
                      item.value > 0
                        ? "text-emerald-300"
                        : item.value < 0
                          ? "text-rose-300"
                          : "text-slate-300"
                    }`}
                  >
                    {item.value > 0 ? "+" : ""}
                    {item.value}%
                  </span>
                </div>

                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={item.value}
                  onChange={(event) => {
                    item.setter(Number(event.target.value));
                    setScenario("custom");
                  }}
                  className="w-full cursor-pointer accent-violet-500"
                />

                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>−20%</span>
                  <span>0%</span>
                  <span>+20%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-5">
            <h3 className="mb-3 text-sm font-semibold text-white">
              Portfolio exposures
            </h3>

            {(
              [
                ["usd", "USD exposure"],
                ["eur", "EUR exposure"],
                ["gbp", "GBP exposure"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="mb-4">
                <label
                  htmlFor={`exposure-${key}`}
                  className="mb-2 block text-xs text-slate-400"
                >
                  {label}
                </label>
                <input
                  id={`exposure-${key}`}
                  type="number"
                  min="0"
                  max="100000000"
                  step="10000"
                  value={exposures[key]}
                  onChange={(event) =>
                    setExposures((previous) => ({
                      ...previous,
                      [key]: Math.min(
                        100_000_000,
                        Math.max(0, Number(event.target.value) || 0),
                      ),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                />
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="scenario-hedge"
                className="text-sm font-medium text-slate-300"
              >
                Hedge ratio
              </label>
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-bold text-emerald-300">
                {hedgeRatio}%
              </span>
            </div>

            <input
              id="scenario-hedge"
              type="range"
              min="0"
              max="100"
              step="5"
              value={hedgeRatio}
              onChange={(event) => setHedgeRatio(Number(event.target.value))}
              className="w-full cursor-pointer accent-emerald-500"
            />

            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>0% · No hedge</span>
              <span>100% · Full hedge</span>
            </div>
          </div>
        </section>

        {/* Results */}
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Gross scenario impact</span>
                <BarChart3 size={18} className="text-sky-400" />
              </div>
              <p
                className={`mt-3 text-2xl font-bold ${
                  results.grossImpact >= 0
                    ? "text-emerald-300"
                    : "text-rose-300"
                }`}
              >
                {formatImpact(results.grossImpact)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Before applying the hedge ratio
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Net scenario impact</span>
                <ShieldAlert size={18} className="text-violet-400" />
              </div>
              <p
                className={`mt-3 text-2xl font-bold ${
                  results.netImpact >= 0
                    ? "text-emerald-300"
                    : "text-rose-300"
                }`}
              >
                {formatImpact(results.netImpact)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                After the simplified hedge adjustment
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Hedge adjustment</span>
                {results.grossImpact < 0 ? (
                  <ArrowUpRight size={18} className="text-emerald-400" />
                ) : (
                  <ArrowDownRight size={18} className="text-amber-400" />
                )}
              </div>
              <p className="mt-3 text-2xl font-bold text-white">
                {money(Math.abs(results.grossImpact - results.netImpact))}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Absolute modeled impact difference
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Portfolio exposure</span>
                <Activity size={18} className="text-sky-400" />
              </div>
              <p className="mt-3 text-2xl font-bold text-white">
                {money(results.totalExposure)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Combined entered exposures
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Currency impact analysis
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Modeled impact before and after the selected hedge ratio.
              </p>
            </div>

            <ReactECharts
              option={chartOption}
              style={{ height: "320px", width: "100%" }}
              notMerge
              lazyUpdate
            />
          </section>

          <section className="rounded-2xl border border-violet-500/20 bg-linear-to-br from-violet-500/10 to-slate-900/60 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-violet-500/10 p-3">
                <Activity size={21} className="text-violet-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">
                  Scenario interpretation
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Under the selected hypothetical shocks, the combined gross
                  impact is{" "}
                  <strong
                    className={
                      results.grossImpact >= 0
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }
                  >
                    {formatImpact(results.grossImpact)}
                  </strong>
                  . With a {hedgeRatio}% hedge ratio, the simplified modeled
                  impact becomes{" "}
                  <strong className="text-white">
                    {formatImpact(results.netImpact)}
                  </strong>
                  .
                </p>

                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs text-slate-500">
                    Portfolio impact before hedging
                  </p>
                  <p className="mt-1 text-xl font-bold text-white">
                    {results.portfolioImpactPercent >= 0 ? "+" : ""}
                    {results.portfolioImpactPercent.toFixed(2)}%
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    This percentage compares the modeled gross impact with the
                    combined exposure entered above. It is not VaR or a
                    probability-based loss estimate.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="flex flex-col justify-between gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row">
        <span>HedgeX · Scenario Analysis</span>
        <span>Hypothetical inputs · Simplified risk calculations</span>
      </footer>
    </div>
  );
}