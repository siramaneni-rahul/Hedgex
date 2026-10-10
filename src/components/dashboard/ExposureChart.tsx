import ReactECharts from "echarts-for-react";

const exposureData = [
  { currency: "USD", exposure: 850000 },
  { currency: "EUR", exposure: 620000 },
  { currency: "GBP", exposure: 410000 },
  { currency: "JPY", exposure: 350000 },
  { currency: "INR", exposure: 220000 },
];

export default function ExposureChart() {
  const option = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const item = params[0];

        return `${item.name}<br/>Exposure: $${item.value.toLocaleString()}`;
      },
    },

    grid: {
      left: 15,
      right: 25,
      top: 20,
      bottom: 25,
      containLabel: true,
    },

    xAxis: {
      type: "value",
      axisLabel: {
        color: "#94a3b8",
        formatter: (value: number) => `$${value / 1000}k`,
      },
      splitLine: {
        lineStyle: {
          color: "#1e293b",
        },
      },
    },

    yAxis: {
      type: "category",
      data: exposureData.map((item) => item.currency),
      axisLabel: {
        color: "#cbd5e1",
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },

    series: [
      {
        name: "Exposure",
        type: "bar",
        data: exposureData.map((item) => item.exposure),
        barWidth: 22,
        itemStyle: {
          color: "#34d399",
          borderRadius: [0, 6, 6, 0],
        },
        emphasis: {
          itemStyle: {
            color: "#6ee7b7",
          },
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "280px", width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge
      lazyUpdate
    />
  );
}