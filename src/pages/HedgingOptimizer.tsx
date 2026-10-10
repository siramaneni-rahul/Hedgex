import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  ArrowLeftRight,
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  ShieldCheck,
  TrendingDown,
  Wallet,
} from "lucide-react";

type Strategy = "Forward" | "Futures" | "Options";

const currencyPairs = [
  { value: "EUR/USD", label: "EUR / USD", rate: 1.1642 },
  { value: "GBP/USD", label: "GBP / USD", rate: 1.3378 },
  { value: "USD/INR", label: "USD / INR", rate: 88.75 },
  { value: "USD/JPY", label: "USD / JPY", rate: 153.42 },
  { value: "AUD/USD", label: "AUD / USD", rate: 0.6584 },
];

const strategyDetails: Record<
  Strategy,
  { costRate: number; riskReduction: number; description: string }
> = {
  Forward: {
    costRate: 0.003,
    riskReduction: 0.85,
    description: "Lock an exchange rate for a future transaction.",
  },
  Futures: {
    costRate: 0.002,
    riskReduction: 0.8,
    description: "Use standardized contracts to offset currency exposure.",
  },
  Options: {
    costRate: 0.012,
    riskReduction: 0.65,
    description: "Pay a premium for protection while retaining upside potential.",
  },
};

const money = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export default function HedgingOptimizer() {
  const [pair, setPair] = useState("EUR/USD");
  const [exposure, setExposure] = useState(1_000_000);
  const [hedgeRatio, setHedgeRatio] = useState(75);
  const [strategy, setStrategy] = useState<Strategy>("Forward");
  const [shock, setShock] = useState(5);

  const selectedPair = currencyPairs.find((item) => item.value === pair)!;
  const selectedStrategy = strategyDetails[strategy];

  const results = useMemo(() => {
    const hedgeAmount = exposure * (hedgeRatio / 100);
    const unhedgedAmount = exposure - hedgeAmount;

    // Illustrative scenario: shock represents an adverse percentage move.
    const unhedgedLoss = exposure * (shock / 100);
    const residualLoss =
      unhedgedAmount * (shock / 100) +
      hedgeAmount * (shock / 100) * (1 - selectedStrategy.riskReduction);

    const estimatedCost = hedgeAmount * selectedStrategy.costRate;
    const avoidedLoss = Math.max(0, unhedgedLoss - residualLoss);
    const netBenefit = avoidedLoss - estimatedCost;

    return {
      hedgeAmount,
      unhedgedAmount,
      unhedgedLoss,
      residualLoss,
      estimatedCost,
      avoidedLoss,
      netBenefit,
    };
  }, [exposure, hedgeRatio, shock, selectedStrategy]);

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
      data: ["Unhedged loss", "Hedged loss", "Estimated cost"],
    },
    grid: { left: 15, right: 20, top: 20, bottom: 55, containLabel: true },
    xAxis: {
      type: "category",
      data: ["Current exposure"],
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
        name: "Unhedged loss",
        type: "bar",
        data: [results.unhedgedLoss],
        itemStyle: { color: "#f87171", borderRadius: [5, 5, 0, 0] },
        barMaxWidth: 55,
      },
      {
        name: "Hedged loss",
        type: "bar",
        data: [results.residualLoss],
        itemStyle: { color: "#34d399", borderRadius: [5, 5, 0, 0] },
        barMaxWidth: 55,
      },
      {
        name: "Estimated cost",
        type: "bar",
        data: [results.estimatedCost],
        itemStyle: { color: "#fbbf24", borderRadius: [5, 5, 0, 0] },
        barMaxWidth: 55,
      },
    ],
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-emerald-400">
            <Calculator size={16} />
            Portfolio optimization
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Hedging Optimizer
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Explore how different hedge strategies may affect your currency
            exposure, estimated costs, and scenario losses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 md:self-auto">
          <ShieldCheck size={18} />
          Interactive simulation
        </div>
      </header>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm leading-6 text-amber-200">
        <strong>Demo mode:</strong> Rates, hedge effectiveness, and cost
        assumptions are illustrative. This is not a live trading engine or
        financial advice.
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Input panel */}
        <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Exposure configuration
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Adjust the inputs to explore different outcomes.
            </p>
          </div>

          <div>
            <label
              htmlFor="currency-pair"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Currency pair
            </label>
            <select
              id="currency-pair"
              value={pair}
              onChange={(event) => setPair(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
            >
              {currencyPairs.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Illustrative reference rate:{" "}
              <span className="font-semibold text-slate-300">
                {selectedPair.rate}
              </span>
            </p>
          </div>

          <div>
            <label
              htmlFor="exposure"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Exposure amount (USD equivalent)
            </label>
            <div className="relative">
              <CircleDollarSign
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                id="exposure"
                type="number"
                min="1000"
                max="100000000"
                step="1000"
                value={exposure}
                onChange={(event) =>
                  setExposure(
                    Math.min(
                      100_000_000,
                      Math.max(1000, Number(event.target.value) || 1000),
                    ),
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[100_000, 500_000, 1_000_000, 5_000_000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setExposure(amount)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                    exposure === amount
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {amount >= 1_000_000
                    ? `$${amount / 1_000_000}M`
                    : `$${amount / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="hedge-ratio"
                className="text-sm font-medium text-slate-300"
              >
                Hedge ratio
              </label>
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-bold text-emerald-300">
                {hedgeRatio}%
              </span>
            </div>
            <input
              id="hedge-ratio"
              type="range"
              min="0"
              max="100"
              step="5"
              value={hedgeRatio}
              onChange={(event) => setHedgeRatio(Number(event.target.value))}
              className="w-full cursor-pointer accent-emerald-500"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>0% · Unhedged</span>
              <span>100% · Fully hedged</span>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-300">
              Hedging strategy
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(["Forward", "Futures", "Options"] as Strategy[]).map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setStrategy(item)}
                    className={`rounded-xl border p-3 text-left transition ${
                      strategy === item
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700 bg-slate-950 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-sm font-semibold ${
                          strategy === item ? "text-emerald-300" : "text-white"
                        }`}
                      >
                        {item}
                      </span>
                      {strategy === item && (
                        <CheckCircle2 size={15} className="text-emerald-400" />
                      )}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {item === "Forward"
                        ? "Lock a future rate"
                        : item === "Futures"
                          ? "Standardized contracts"
                          : "Flexible protection"}
                    </p>
                  </button>
                ),
              )}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              {selectedStrategy.description}
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="market-shock"
                className="text-sm font-medium text-slate-300"
              >
                Adverse market shock
              </label>
              <span className="text-sm font-semibold text-rose-300">
                {shock}%
              </span>
            </div>
            <input
              id="market-shock"
              type="range"
              min="1"
              max="20"
              step="1"
              value={shock}
              onChange={(event) => setShock(Number(event.target.value))}
              className="w-full cursor-pointer accent-rose-400"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>1% · Mild</span>
              <span>20% · Severe</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Selected strategy</p>
                <p className="mt-1 font-semibold text-white">{strategy}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Illustrative cost rate</p>
                <p className="mt-1 font-semibold text-amber-300">
                  {(selectedStrategy.costRate * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Results panel */}
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Hedge amount</span>
                <Wallet size={18} className="text-emerald-400" />
              </div>
              <p className="mt-3 text-2xl font-bold text-white">
                {money(results.hedgeAmount)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {hedgeRatio}% of total exposure
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Estimated cost</span>
                <CircleDollarSign size={18} className="text-amber-400" />
              </div>
              <p className="mt-3 text-2xl font-bold text-amber-300">
                {money(results.estimatedCost)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Based on the assumed strategy cost
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Residual exposure</span>
                <ArrowLeftRight size={18} className="text-sky-400" />
              </div>
              <p className="mt-3 text-2xl font-bold text-white">
                {money(results.unhedgedAmount)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Exposure not covered by the hedge
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Estimated loss avoided
                </span>
                <TrendingDown size={18} className="text-emerald-400" />
              </div>
              <p className="mt-3 text-2xl font-bold text-emerald-300">
                {money(results.avoidedLoss)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Before estimated hedging costs
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Scenario comparison
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Estimated loss under a {shock}% adverse move.
              </p>
            </div>
            <ReactECharts
              option={chartOption}
              style={{ height: "320px", width: "100%" }}
              notMerge
              lazyUpdate
            />
          </section>

          <section className="rounded-2xl border border-emerald-500/20 bg-linear-to-br  from-emerald-500/10 to-slate-900/60 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <ShieldCheck size={22} className="text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-white">
                  Simulation summary
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Hedging{" "}
                  <strong className="text-white">{hedgeRatio}%</strong> of your{" "}
                  <strong className="text-white">{pair}</strong> exposure using{" "}
                  <strong className="text-white">{strategy}</strong> produces
                  an estimated residual scenario loss of{" "}
                  <strong className="text-rose-300">
                    {money(results.residualLoss)}
                  </strong>
                  .
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-slate-500">
                      Loss avoided minus cost
                    </p>
                    <p
                      className={`mt-1 text-lg font-bold ${
                        results.netBenefit >= 0
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }`}
                    >
                      {results.netBenefit < 0 ? "-" : ""}
                      {money(Math.abs(results.netBenefit))}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-slate-500">Unhedged scenario loss</p>
                    <p className="mt-1 text-lg font-bold text-rose-300">
                      {money(results.unhedgedLoss)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="flex flex-col justify-between gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row">
        <span>HedgeX · Hedging Optimization Engine</span>
        <span>
          Illustrative calculations only · Not financial advice
        </span>
      </footer>
    </div>
  );
}