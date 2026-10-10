import React from "react";
import ReactECharts from "echarts-for-react";
import {
  Activity,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Gauge,
  Globe2,
  LayoutDashboard,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";

type Page =
  | "Overview"
  | "Live Markets"
  | "Risk Analytics"
  | "Hedging Optimizer"
  | "Scenario Simulator";

const navigation: {
  name: Page;
  icon: React.ElementType;
}[] = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Live Markets", icon: Globe2 },
  { name: "Risk Analytics", icon: ShieldCheck },
  { name: "Hedging Optimizer", icon: SlidersHorizontal },
  { name: "Scenario Simulator", icon: Activity },
];

const marketData = [
  {
    pair: "EUR/USD",
    name: "Euro / US Dollar",
    price: "1.0842",
    change: "+0.24%",
    positive: true,
    flag1: "🇪🇺",
    flag2: "🇺🇸",
    values: [35, 42, 38, 48, 44, 58, 52, 65, 60, 72, 68, 80],
  },
  {
    pair: "GBP/USD",
    name: "British Pound / US Dollar",
    price: "1.2718",
    change: "-0.18%",
    positive: false,
    flag1: "🇬🇧",
    flag2: "🇺🇸",
    values: [72, 65, 70, 55, 61, 50, 55, 43, 48, 38, 42, 32],
  },
  {
    pair: "USD/INR",
    name: "US Dollar / Indian Rupee",
    price: "83.42",
    change: "+0.12%",
    positive: true,
    flag1: "🇺🇸",
    flag2: "🇮🇳",
    values: [30, 35, 32, 45, 40, 48, 44, 52, 48, 60, 55, 64],
  },
  {
    pair: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    price: "149.82",
    change: "-0.31%",
    positive: false,
    flag1: "🇺🇸",
    flag2: "🇯🇵",
    values: [75, 70, 73, 64, 68, 58, 61, 48, 52, 43, 38, 30],
  },
  {
    pair: "AUD/USD",
    name: "Australian Dollar / US Dollar",
    price: "0.6524",
    change: "+0.41%",
    positive: true,
    flag1: "🇦🇺",
    flag2: "🇺🇸",
    values: [28, 35, 31, 40, 38, 50, 46, 55, 50, 65, 60, 74],
  },
];

const money = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-[#101827] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-100">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  positive,
  description,
}: {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  positive?: boolean;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#101827] p-5 transition duration-200 hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{title}</span>
        <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-400">
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {value}
        </span>
        {change && (
          <span
            className={`mb-1 flex items-center gap-1 text-xs ${
              positive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {change}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

function Tag({
  children,
  color = "slate",
}: {
  children: React.ReactNode;
  color?: "green" | "red" | "yellow" | "blue" | "slate";
}) {
  const colors = {
    green: "bg-emerald-400/10 text-emerald-400",
    red: "bg-rose-400/10 text-rose-400",
    yellow: "bg-amber-400/10 text-amber-400",
    blue: "bg-sky-400/10 text-sky-400",
    slate: "bg-slate-700/50 text-slate-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function MiniChart({
  values,
  positive,
}: {
  values: number[];
  positive: boolean;
}) {
  const color = positive ? "#34d399" : "#fb7185";

  const option = {
    animation: true,
    grid: { left: 0, right: 0, top: 3, bottom: 3 },
    xAxis: {
      type: "category",
      show: false,
      boundaryGap: false,
      data: values.map((_, i) => i),
    },
    yAxis: { type: "value", show: false, scale: true },
    series: [
      {
        type: "line",
        data: values,
        smooth: true,
        symbol: "none",
        lineStyle: { color, width: 2 },
        areaStyle: { color, opacity: 0.08 },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 45, width: 105 }} />;
}

function MarketTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-155 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-xs text-slate-500">
            <th className="pb-4 font-medium">Currency pair</th>
            <th className="pb-4 font-medium">Illustrative rate</th>
            <th className="pb-4 font-medium">Change</th>
            <th className="pb-4 font-medium">Trend</th>
            <th className="pb-4 text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map((item) => (
            <tr
              key={item.pair}
              className="border-b border-slate-800/70 last:border-0"
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1 text-lg">
                    <span>{item.flag1}</span>
                    <span>{item.flag2}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.pair}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 font-medium text-slate-200">{item.price}</td>
              <td className="py-4">
                <span
                  className={
                    item.positive ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {item.change}
                </span>
              </td>
              <td className="py-4">
                <MiniChart values={item.values} positive={item.positive} />
              </td>
              <td className="py-4 text-right">
                <Tag color={item.positive ? "green" : "red"}>
                  {item.positive ? "Upward" : "Downward"}
                </Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewPage() {
  const exposureOption = {
    tooltip: { trigger: "axis" },
    legend: {
      bottom: 0,
      textStyle: { color: "#94a3b8" },
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: { left: 0, right: 10, top: 15, bottom: 35, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: { lineStyle: { color: "#263246" } },
      axisLabel: { color: "#64748b" },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#64748b",
        formatter: (v: number) => `$${v}k`,
      },
      splitLine: { lineStyle: { color: "#1e293b" } },
    },
    series: [
      {
        name: "Current exposure",
        type: "line",
        smooth: true,
        data: [220, 245, 230, 270, 255, 285, 284],
        lineStyle: { color: "#34d399", width: 3 },
        itemStyle: { color: "#34d399" },
        areaStyle: { color: "#34d399", opacity: 0.08 },
      },
      {
        name: "Hedged exposure",
        type: "line",
        smooth: true,
        data: [140, 150, 145, 165, 160, 175, 170],
        lineStyle: { color: "#60a5fa", width: 2 },
        itemStyle: { color: "#60a5fa" },
      },
    ],
  };

  const allocationOption = {
    tooltip: { trigger: "item" },
    legend: {
      orient: "vertical",
      right: 0,
      top: "center",
      textStyle: { color: "#94a3b8" },
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "78%"],
        center: ["34%", "50%"],
        avoidLabelOverlap: true,
        label: { show: false },
        data: [
          { value: 42, name: "USD", itemStyle: { color: "#34d399" } },
          { value: 26, name: "EUR", itemStyle: { color: "#60a5fa" } },
          { value: 18, name: "GBP", itemStyle: { color: "#a78bfa" } },
          { value: 14, name: "Other", itemStyle: { color: "#fbbf24" } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Portfolio Exposure"
          value="$2.84M"
          change="+4.2%"
          positive
          icon={Wallet}
          description="Illustrative portfolio value"
        />
        <MetricCard
          title="Hedged Exposure"
          value="$1.99M"
          change="70%"
          positive
          icon={ShieldCheck}
          description="Illustrative hedge ratio"
        />
        <MetricCard
          title="Value at Risk (95%)"
          value="$84.2K"
          change="+2.1%"
          icon={Gauge}
          description="Illustrative one-day VaR"
        />
        <MetricCard
          title="Potential Hedge Cost"
          value="$15.9K"
          change="0.8%"
          positive
          icon={CircleDollarSign}
          description="Illustrative annualized estimate"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Portfolio Exposure"
          subtitle="Illustrative values over the last seven periods"
          className="xl:col-span-2"
          action={<Tag color="green">Demo analytics</Tag>}
        >
          <ReactECharts
            option={exposureOption}
            style={{ height: 300, width: "100%" }}
          />
        </Panel>

        <Panel
          title="Currency Allocation"
          subtitle="Illustrative exposure distribution"
        >
          <ReactECharts
            option={allocationOption}
            style={{ height: 300, width: "100%" }}
          />
        </Panel>
      </div>

      <Panel
        title="FX Market Watchlist"
        subtitle="Sample rates for interface demonstration only"
        action={
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Demo data
          </span>
        }
      >
        <MarketTable />
      </Panel>

      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <Activity className="mt-0.5 shrink-0 text-amber-400" size={18} />
        <div>
          <p className="text-sm font-medium text-amber-300">
            Prototype data notice
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            All displayed rates, portfolio values, and risk figures are
            illustrative. This frontend does not connect to a live market feed
            or calculate validated financial risk metrics.
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveMarketsPage() {
  const [search, setSearch] = React.useState("");

  const filtered = marketData.filter(
    (item) =>
      item.pair.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Pairs Tracked"
          value="05"
          icon={Globe2}
          description="Sample currency pairs"
        />
        <MetricCard
          title="Positive Changes"
          value="03"
          icon={TrendingUp}
          positive
          description="In this illustrative snapshot"
        />
        <MetricCard
          title="Negative Changes"
          value="02"
          icon={TrendingDown}
          description="In this illustrative snapshot"
        />
      </div>

      <Panel
        title="Currency Markets"
        subtitle="Sample market snapshot — not live data"
        action={<Tag color="yellow">Simulation</Tag>}
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency pairs..."
              className="w-full rounded-xl border border-slate-700 bg-[#0b1220] py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => setSearch("")}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw size={15} />
            Reset
          </button>
        </div>

        {filtered.length ? (
          <MarketTableFiltered items={filtered} />
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">
            No currency pairs match your search.
          </p>
        )}
      </Panel>-[76px]
    </div>
  );
}

function MarketTableFiltered({
  items,
}: {
  items: typeof marketData;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-162.5 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-xs text-slate-500">
            <th className="pb-4 font-medium">Pair</th>
            <th className="pb-4 font-medium">Sample rate</th>
            <th className="pb-4 font-medium">Change</th>
            <th className="pb-4 font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.pair}
              className="border-b border-slate-800/70 last:border-0"
            >
              <td className="py-4">
                <p className="font-medium text-white">{item.pair}</p>
                <p className="mt-1 text-xs text-slate-500">{item.name}</p>
              </td>
              <td className="py-4 text-slate-200">{item.price}</td>
              <td
                className={`py-4 ${
                  item.positive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {item.change}
              </td>
              <td className="py-4">
                <MiniChart values={item.values} positive={item.positive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RiskAnalyticsPage() {
  const [confidence, setConfidence] = React.useState(95);
  const [portfolio, setPortfolio] = React.useState(2840000);

  // Illustrative approximation for UI demonstration only.
  const multiplier = confidence === 99 ? 1.35 : confidence === 97.5 ? 1.15 : 1;
  const illustrativeVar = portfolio * 0.02965 * multiplier;

  const riskOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 5, right: 5, top: 15, bottom: 25, containLabel: true },
    xAxis: {
      type: "category",
      data: ["-4%", "-3%", "-2%", "-1%", "0%", "1%", "2%", "3%", "4%"],
      axisLabel: { color: "#94a3b8" },
      axisLine: { lineStyle: { color: "#334155" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#64748b" },
      splitLine: { lineStyle: { color: "#1e293b" } },
    },
    series: [
      {
        type: "bar",
        barWidth: "65%",
        data: [
          { value: 3, itemStyle: { color: "#fb7185" } },
          { value: 8, itemStyle: { color: "#fb7185" } },
          { value: 17, itemStyle: { color: "#fb7185" } },
          { value: 30, itemStyle: { color: "#fb7185" } },
          { value: 45, itemStyle: { color: "#64748b" } },
          { value: 32, itemStyle: { color: "#34d399" } },
          { value: 19, itemStyle: { color: "#34d399" } },
          { value: 9, itemStyle: { color: "#34d399" } },
          { value: 4, itemStyle: { color: "#34d399" } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Illustrative VaR"
          value={money(illustrativeVar)}
          icon={Gauge}
          description={`${confidence}% confidence setting`}
        />
        <MetricCard
          title="Portfolio Exposure"
          value={money(portfolio)}
          icon={Wallet}
          description="Editable below"
        />
        <MetricCard
          title="Risk Model"
          value="Demo"
          icon={ShieldCheck}
          description="Not a validated financial model"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Risk Distribution"
          subtitle="Illustrative distribution of hypothetical returns"
        >
          <ReactECharts
            option={riskOption}
            style={{ height: 300, width: "100%" }}
          />
        </Panel>

        <Panel
          title="Risk Parameters"
          subtitle="Change the settings to update the demo estimate"
        >
          <div className="space-y-7">
            <div>
              <div className="mb-3 flex justify-between gap-3 text-sm">
                <label className="text-slate-300">Portfolio value</label>
                <span className="font-semibold text-white">
                  {money(portfolio)}
                </span>
              </div>
              <input
                type="number"
                min={1000}
                value={portfolio}
                onChange={(e) =>
                  setPortfolio(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="mb-3 flex justify-between text-sm">
                <label className="text-slate-300">Confidence level</label>
                <span className="font-semibold text-emerald-400">
                  {confidence}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[95, 97.5, 99].map((value) => (
                  <button
                    key={value}
                    onClick={() => setConfidence(value)}
                    className={`rounded-xl border px-3 py-3 text-sm transition ${
                      confidence === value
                        ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                        : "border-slate-700 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-sm font-medium text-amber-300">
                Interpretation
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                The estimate changes with the selected confidence level and
                portfolio value. A production VaR engine requires historical
                or simulated returns, a defined time horizon, validated
                assumptions, and model testing.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function HedgingOptimizerPage() {
  const [hedgeRatio, setHedgeRatio] = React.useState(70);
  const [portfolioExposure, setPortfolioExposure] = React.useState(2840000);
  const [hedgingCostRate, setHedgingCostRate] = React.useState(0.8);

  const hedgedAmount = portfolioExposure * (hedgeRatio / 100);
  const unhedgedAmount = portfolioExposure - hedgedAmount;
  const estimatedCost = hedgedAmount * (hedgingCostRate / 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Hedge Ratio"
          value={`${hedgeRatio}%`}
          icon={ShieldCheck}
          positive
          description="Selected hedge coverage"
        />
        <MetricCard
          title="Amount Hedged"
          value={money(hedgedAmount)}
          icon={Wallet}
          description="Calculated from entered exposure"
        />
        <MetricCard
          title="Estimated Hedge Cost"
          value={money(estimatedCost)}
          icon={CircleDollarSign}
          description={`${hedgingCostRate}% assumed cost rate`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Panel
          title="Hedging Strategy"
          subtitle="Adjust your hypothetical portfolio settings"
          className="xl:col-span-3"
        >
          <div className="space-y-8">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm text-slate-300">
                  Portfolio exposure
                </label>
                <span className="font-semibold text-white">
                  {money(portfolioExposure)}
                </span>
              </div>
              <input
                type="number"
                min={0}
                value={portfolioExposure}
                onChange={(e) =>
                  setPortfolioExposure(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm text-slate-300">
                  Hedge ratio
                </label>
                <span className="text-xl font-semibold text-emerald-400">
                  {hedgeRatio}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={hedgeRatio}
                onChange={(e) => setHedgeRatio(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>0% — No hedge</span>
                <span>50%</span>
                <span>100% — Fully hedged</span>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm text-slate-300">
                Assumed hedge cost rate
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[0.4, 0.8, 1.2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setHedgingCostRate(rate)}
                    className={`rounded-xl border px-3 py-3 text-sm transition ${
                      hedgingCostRate === rate
                        ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                        : "border-slate-700 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {rate.toFixed(1)}%
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setHedgeRatio(70);
                setPortfolioExposure(2840000);
                setHedgingCostRate(0.8);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              <RefreshCw size={16} />
              Reset parameters
            </button>
          </div>
        </Panel>

        <Panel
          title="Strategy Breakdown"
          subtitle="Calculated from your current settings"
          className="xl:col-span-2"
        >
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">Hedged exposure</span>
                <span className="text-emerald-400">
                  {hedgeRatio}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${hedgeRatio}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-white">
                {money(hedgedAmount)}
              </p>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">Unhedged exposure</span>
                <span className="text-amber-400">
                  {100 - hedgeRatio}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${100 - hedgeRatio}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-white">
                {money(unhedgedAmount)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-[#0b1220] p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CircleDollarSign size={17} className="text-emerald-400" />
                Estimated cost
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {money(estimatedCost)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Simple estimate: hedged amount × assumed cost rate. Actual
                costs depend on instruments, tenor, liquidity, spreads,
                collateral, and market conditions.
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
        <Zap size={18} className="mt-0.5 shrink-0 text-sky-400" />
        <div>
          <p className="text-sm font-medium text-sky-300">
            Optimizer prototype
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            This page calculates illustrative exposure and cost values. It
            does not yet determine an optimal hedge using forward rates,
            derivatives pricing, correlations, transaction costs, or a
            risk-adjusted optimization algorithm.
          </p>
        </div>
      </div>
    </div>
  );
}

function ScenarioSimulatorPage() {
  const [fxShock, setFxShock] = React.useState(5);
  const [scenarioExposure, setScenarioExposure] = React.useState(2840000);
  const [currency, setCurrency] = React.useState("USD");
  const [scenarioDirection, setScenarioDirection] = React.useState<
    "down" | "up"
  >("down");

  const signedShock =
    scenarioDirection === "down" ? -Math.abs(fxShock) : Math.abs(fxShock);

  const estimatedImpact = scenarioExposure * (signedShock / 100);
  const scenarioValue = scenarioExposure + estimatedImpact;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Scenario Shock"
          value={`${signedShock > 0 ? "+" : ""}${signedShock}%`}
          icon={Activity}
          description="Hypothetical exchange-rate movement"
        />
        <MetricCard
          title="Estimated Impact"
          value={money(estimatedImpact, currency)}
          icon={signedShock < 0 ? TrendingDown : TrendingUp}
          positive={signedShock >= 0}
          description="Simplified linear estimate"
        />
        <MetricCard
          title="Scenario Value"
          value={money(scenarioValue, currency)}
          icon={Wallet}
          description="Exposure plus estimated impact"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Configure Scenario"
          subtitle="Choose an illustrative FX shock and exposure"
        >
          <div className="space-y-7">
            <div>
              <label className="mb-3 block text-sm text-slate-300">
                Portfolio exposure
              </label>
              <input
                type="number"
                min={0}
                value={scenarioExposure}
                onChange={(e) =>
                  setScenarioExposure(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm text-slate-300">
                Display currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#0b1220] px-4 py-3 text-white outline-none focus:border-emerald-500"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="INR">INR — Indian Rupee</option>
                <option value="JPY">JPY — Japanese Yen</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Changing this selection changes formatting only. It does not
                convert the underlying amount.
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm text-slate-300">
                  FX shock magnitude
                </label>
                <span className="text-xl font-semibold text-white">
                  {fxShock}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={fxShock}
                onChange={(e) => setFxShock(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>10%</span>
                <span>20%</span>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm text-slate-300">
                Scenario direction
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setScenarioDirection("down")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm transition ${
                    scenarioDirection === "down"
                      ? "border-rose-400 bg-rose-400/10 text-rose-300"
                      : "border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <TrendingDown size={17} />
                  Currency weakens
                </button>
                <button
                  onClick={() => setScenarioDirection("up")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm transition ${
                    scenarioDirection === "up"
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                      : "border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <TrendingUp size={17} />
                  Currency strengthens
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setFxShock(5);
                setScenarioExposure(2840000);
                setCurrency("USD");
                setScenarioDirection("down");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              <RefreshCw size={16} />
              Reset scenario
            </button>
          </div>
        </Panel>

        <Panel
          title="Scenario Results"
          subtitle="Impact estimate updates as you change settings"
        >
          <div
            className={`rounded-2xl border p-5 ${
              signedShock < 0
                ? "border-rose-500/20 bg-rose-500/5"
                : "border-emerald-500/20 bg-emerald-500/5"
            }`}
          >
            <p className="text-sm text-slate-400">Estimated impact</p>
            <p
              className={`mt-3 text-3xl font-semibold ${
                signedShock < 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {signedShock > 0 ? "+" : ""}
              {money(estimatedImpact, currency)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {Math.abs(signedShock)}% hypothetical shock
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="text-slate-400">Initial exposure</span>
                <span className="text-white">
                  {money(scenarioExposure, currency)}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-800">
                <div className="h-3 w-full rounded-full bg-sky-400" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="text-slate-400">Estimated impact</span>
                <span
                  className={
                    signedShock < 0 ? "text-rose-400" : "text-emerald-400"
                  }
                >
                  {signedShock > 0 ? "+" : ""}
                  {money(estimatedImpact, currency)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-3 rounded-full transition-all ${
                    signedShock < 0 ? "bg-rose-400" : "bg-emerald-400"
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(signedShock) * 5, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-[#0b1220] p-4">
              <p className="text-sm text-slate-400">Resulting value</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {money(scenarioValue, currency)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm font-medium text-amber-300">
              Model limitation
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              This simplified scenario assumes a direct linear relationship
              between the shock and exposure. Actual FX impacts depend on
              currency denomination, liabilities, hedges, pricing, and
              correlations. It is not a forecast.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = React.useState<Page>("Overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const pageDescriptions: Record<Page, string> = {
    Overview: "Monitor your cross-border portfolio at a glance.",
    "Live Markets": "Explore illustrative foreign exchange market data.",
    "Risk Analytics": "Explore portfolio risk settings and sample metrics.",
    "Hedging Optimizer": "Adjust hypothetical hedging strategies.",
    "Scenario Simulator": "Test hypothetical exchange-rate shocks.",
  };

  const pageContent: Record<Page, React.ReactNode> = {
    Overview: <OverviewPage />,
    "Live Markets": <LiveMarketsPage />,
    "Risk Analytics": <RiskAnalyticsPage />,
    "Hedging Optimizer": <HedgingOptimizerPage />,
    "Scenario Simulator": <ScenarioSimulatorPage />,
  };

  const selectPage = (page: Page) => {
    setActive(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-200">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-[#0a101b] transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-19 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#07140f]">
            <ArrowLeftRight size={23} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Hedge<span className="text-emerald-400">X</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Intelligent treasury
            </p>
          </div>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          <nav className="space-y-1">
            {navigation.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => selectPage(name)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active === name
                    ? "bg-emerald-400/10 font-medium text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    active === name
                      ? "text-emerald-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }
                />
                <span>{name}</span>
                {active === name && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-xl border border-slate-800 bg-[#101827] p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-sky-400/10 p-2 text-sky-400">
                <ShieldCheck size={17} />
              </div>
              <span className="text-sm font-medium text-white">
                Demo workspace
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Prototype mode is active. Market data is illustrative.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Not connected to live data
            </div>
          </div>

          <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Settings size={18} />
            Settings
          </button>

          <div className="mt-3 flex items-center gap-3 border-t border-slate-800 px-2 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-300 to-teal-700 font-semibold text-white">
              HX
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                Treasury Analyst
              </p>
              <p className="mt-1 text-xs text-slate-500">Demo account</p>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-19 items-center justify-between gap-3 border-b border-slate-800 bg-[#0b1220]/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-lg font-semibold text-white sm:text-xl">
                  {active}
                </h2>
                <span className="hidden sm:inline-flex">
                  <Tag color="yellow">Prototype</Tag>
                </span>
              </div>
              <p className="mt-1 hidden truncate text-xs text-slate-500 sm:block">
                {pageDescriptions[active]}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-[#101827] px-3 py-2 md:flex">
              <Search size={15} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value.trim()) {
                    selectPage("Live Markets");
                  }
                }}
                placeholder="Search markets..."
                className="w-32 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
              />
              <span className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500">
                /
              </span>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 sm:flex">
              <Clock3 size={14} />
              <span>Demo mode</span>
            </div>

            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="relative rounded-xl border border-slate-800 p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0b1220]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-14 z-50 w-72 rounded-xl border border-slate-700 bg-[#101827] p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      aria-label="Close notifications"
                      className="text-slate-500 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <div className="mt-0.5 rounded-lg bg-amber-400/10 p-2 text-amber-400">
                      <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-200">
                        Prototype is running
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        This workspace uses sample data. Live alerts are not
                        configured.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-semibold text-emerald-300 sm:flex">
              HX
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-400">
                Welcome to HedgeX
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {active === "Overview" ? "Portfolio Overview" : active}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {pageDescriptions[active]}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#101827] px-3 py-2.5 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Sample data
              </div>
              <button
                onClick={() => selectPage("Overview")}
                className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-[#07140f] transition hover:bg-emerald-300"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Overview</span>
              </button>
            </div>
          </div>

          {pageContent[active]}
        </main>

        <footer className="border-t border-slate-800 px-4 py-5 sm:px-8">
          <div className="flex flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row">
            <p>HedgeX · Cross-Border Hedging Prototype</p>
            <p>Illustrative data only · No live financial connections</p>
          </div>
        </footer>
      </div>
    </div>
  );
}