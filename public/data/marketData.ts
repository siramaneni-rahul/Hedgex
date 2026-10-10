export interface FXPair {
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  change: number;
  history: number[];
}

export const marketData: FXPair[] = [
  {
    pair: "EUR/USD",
    baseCurrency: "EUR",
    quoteCurrency: "USD",
    rate: 1.1642,
    change: 0.24,
    history: [1.159, 1.161, 1.160, 1.163, 1.162, 1.1642],
  },
  {
    pair: "GBP/USD",
    baseCurrency: "GBP",
    quoteCurrency: "USD",
    rate: 1.3378,
    change: 0.18,
    history: [1.331, 1.333, 1.332, 1.336, 1.335, 1.3378],
  },
  {
    pair: "USD/INR",
    baseCurrency: "USD",
    quoteCurrency: "INR",
    rate: 88.75,
    change: -0.12,
    history: [88.82, 88.79, 88.84, 88.77, 88.78, 88.75],
  },
  {
    pair: "USD/JPY",
    baseCurrency: "USD",
    quoteCurrency: "JPY",
    rate: 153.42,
    change: -0.31,
    history: [154.1, 153.9, 153.8, 153.6, 153.7, 153.42],
  },
  {
    pair: "AUD/USD",
    baseCurrency: "AUD",
    quoteCurrency: "USD",
    rate: 0.6584,
    change: 0.15,
    history: [0.654, 0.655, 0.656, 0.655, 0.657, 0.6584],
  },
  {
    pair: "USD/CAD",
    baseCurrency: "USD",
    quoteCurrency: "CAD",
    rate: 1.3842,
    change: -0.08,
    history: [1.386, 1.385, 1.387, 1.384, 1.385, 1.3842],
  },
];

export const marketSummary = {
  marketStatus: "Demo Market",
  lastUpdated: new Date().toISOString(),
  totalPairs: marketData.length,
  dataSource: "Illustrative sample data",
};