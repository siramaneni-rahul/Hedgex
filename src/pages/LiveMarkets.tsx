import { marketData } from "../../public/data/marketData";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  RefreshCw,
  Search,
  TrendingUp,
  TrendingDown,
  Globe2,
} from "lucide-react";

const currencyNames: Record<string, string> = {
  "EUR/USD": "Euro / US Dollar",
  "GBP/USD": "British Pound / US Dollar",
  "USD/INR": "US Dollar / Indian Rupee",
  "USD/JPY": "US Dollar / Japanese Yen",
  "AUD/USD": "Australian Dollar / US Dollar",
  "USD/CAD": "US Dollar / Canadian Dollar",
};

const initialMarkets = marketData.map((item) => {
  const minHistory = Math.min(...item.history);
  const maxHistory = Math.max(...item.history);
  const range = maxHistory - minHistory || 1;

  // MiniChart expects points on a 0–100 scale.
  const points = item.history.map(
    (value) => 10 + ((value - minHistory) / range) * 80,
  );

  return {
    pair: item.pair,
    name: currencyNames[item.pair] ?? `${item.baseCurrency} / ${item.quoteCurrency}`,
    rate: item.rate,
    change: item.change,
    high: item.rate * 1.002,
    low: item.rate * 0.998,
    points,
  };
});

type FilterType = "All" | "Rising" | "Falling";

function formatRate(rate: number) {
  return rate < 2 ? rate.toFixed(4) : rate.toFixed(2);
}

function MiniChart({
  points,
  positive,
}: {
  points: number[];
  positive: boolean;
}) {
  const width = 120;
  const height = 38;

  const chartPoints = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - (point / 100) * height;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-10 w-28 overflow-visible"
      role="img"
      aria-label={positive ? "Illustrative rising trend" : "Illustrative falling trend"}
    >
      <polyline
        points={chartPoints}
        fill="none"
        stroke={positive ? "#34d399" : "#fb7185"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LiveMarkets() {
  const [markets, setMarkets] = useState(initialMarkets);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshCount, setRefreshCount] = useState(0);

  const filteredMarkets = useMemo(() => {
    const query = search.toLowerCase().trim();

    return markets.filter((market) => {
      const matchesSearch =
        market.pair.toLowerCase().includes(query) ||
        market.name.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Rising" && market.change > 0) ||
        (filter === "Falling" && market.change < 0);

      return matchesSearch && matchesFilter;
    });
  }, [markets, search, filter]);

  const risingCount = markets.filter((market) => market.change > 0).length;
  const fallingCount = markets.filter((market) => market.change < 0).length;

  function refreshMarkets() {
    // Simulates a refresh. It does not retrieve real market data.
    setRefreshCount((count) => count + 1);
    setLastRefresh(new Date());

    setMarkets((currentMarkets) =>
      currentMarkets.map((market) => ({
        ...market,
        points: [...market.points.slice(1), market.points[0]],
      })),
    );
  }

  return (
    <div className="min-h-full space-y-8 bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      {/* Page heading */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Globe2 size={16} className="text-emerald-400" />
            <span>Market Intelligence / Live Markets</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Live Markets</h1>

          <p className="mt-2 text-sm text-slate-400">
            Monitor currency movements across major foreign exchange pairs.
          </p>
        </div>

        <button
          onClick={refreshMarkets}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95 md:self-auto"
        >
          <RefreshCw size={17} />
          Refresh Demo
        </button>
      </header>

      {/* Data notice */}
      <section className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <Activity size={20} className="mt-0.5 shrink-0 text-amber-400" />

        <div>
          <h2 className="text-sm font-semibold text-amber-300">
            Illustrative market data
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            These prices, changes, highs, lows, and trends are sample values.
            Refresh only updates the demonstration interface; it does not fetch
            real-time quotes.
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Tracked Pairs</span>
            <Globe2 size={19} className="text-blue-400" />
          </div>
          <p className="mt-4 text-3xl font-bold">{markets.length}</p>
          <p className="mt-2 text-xs text-slate-500">
            Major currency pairs
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Rising Pairs</span>
            <TrendingUp size={19} className="text-emerald-400" />
          </div>
          <p className="mt-4 text-3xl font-bold text-emerald-400">
            {risingCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Positive illustrative change
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Falling Pairs</span>
            <TrendingDown size={19} className="text-rose-400" />
          </div>
          <p className="mt-4 text-3xl font-bold text-rose-400">
            {fallingCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Negative illustrative change
          </p>
        </div>
      </section>

      {/* Market table */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-semibold">FX Market Watchlist</h2>
            <p className="mt-1 text-sm text-slate-400">
              Sample exchange rates and illustrative price trends
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search currency..."
                aria-label="Search currency pairs"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 sm:w-56"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as FilterType)}
              aria-label="Filter currency pairs"
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
            >
              <option value="All">All pairs</option>
              <option value="Rising">Rising</option>
              <option value="Falling">Falling</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-850 text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400">
              <tr>
                <th className="px-5 py-4 font-medium">Currency Pair</th>
                <th className="px-5 py-4 font-medium">Illustrative Rate</th>
                <th className="px-5 py-4 font-medium">24h Change</th>
                <th className="px-5 py-4 font-medium">Trend</th>
                <th className="px-5 py-4 font-medium">Day High / Low</th>
                <th className="px-5 py-4 text-right font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredMarkets.map((market) => (
                <tr
                  key={market.pair}
                  className="border-t border-slate-800/80 transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-5 py-5">
                    <div className="whitespace-nowrap font-semibold text-white">
                      {market.pair}
                    </div>
                    <div className="mt-1 whitespace-nowrap text-xs text-slate-500">
                      {market.name}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 font-mono font-semibold text-slate-200">
                    {formatRate(market.rate)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-5">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        market.change >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {market.change >= 0 ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}
                      {market.change > 0 ? "+" : ""}
                      {market.change.toFixed(2)}%
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <MiniChart
                      points={market.points}
                      positive={market.change >= 0}
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 text-xs text-slate-400">
                    <div>H: {formatRate(market.high)}</div>
                    <div className="mt-1">L: {formatRate(market.low)}</div>
                  </td>

                  <td className="px-5 py-5 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        market.change >= 0
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-rose-400/10 text-rose-400"
                      }`}
                    >
                      {market.change >= 0 ? "Rising" : "Falling"}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredMarkets.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No currency pairs match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-slate-800 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing {filteredMarkets.length} of {markets.length} pairs
          </span>

          <span className="inline-flex items-center gap-2">
            <Clock size={14} />
            Last demo refresh: {lastRefresh.toLocaleTimeString()}
            {refreshCount > 0 && ` · ${refreshCount} refresh(es)`}
          </span>
        </div>
      </section>
    </div>
  );
}