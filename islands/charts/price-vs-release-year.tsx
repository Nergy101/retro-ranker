import { useMemo, useState } from "preact/hooks";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { FreshChart } from "./fresh-chart.tsx";

interface LineChartProps {
  devices: Device[];
}

export function PriceVsReleaseYear({ devices }: LineChartProps) {
  const [minYear, setMinYear] = useState(2020);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());

  // Get all available years (2017 and above)
  const availableYears = useMemo(() => {
    const years = devices
      .filter((d) => d.released?.mentionedDate)
      .map((d) => new Date(d.released!.mentionedDate!).getFullYear())
      .filter((year) => !isNaN(year) && year >= 2017);

    return Array.from(new Set(years)).sort((a, b) => a - b);
  }, [devices]);

  // Process data for line chart
  const lineChartData = useMemo(() => {
    const filteredDevices = devices.filter((device) =>
      device.released?.mentionedDate &&
      device.pricing.average &&
      device.pricing.average > 0 &&
      !device.pricing.discontinued
    );

    // Group by year
    const yearData: { [year: number]: number[] } = {};

    filteredDevices.forEach((device) => {
      const mentionedDate = device.released?.mentionedDate;
      if (!mentionedDate) return;
      const year = new Date(mentionedDate).getFullYear();
      if (isNaN(year)) return;
      if (year >= minYear && year <= maxYear) {
        if (!yearData[year]) {
          yearData[year] = [];
        }
        yearData[year].push(device.pricing.average!);
      }
    });

    // Calculate statistics for each year
    const chartData = Object.entries(yearData)
      .map(([year, prices]) => {
        const sortedPrices = prices.sort((a, b) => a - b);
        const count = prices.length;
        const average = prices.reduce((sum, price) => sum + price, 0) / count;
        const median = sortedPrices[Math.floor(count / 2)];
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return {
          year: parseInt(year),
          count,
          average,
          median,
          min,
          max,
        };
      })
      .sort((a, b) => a.year - b.year);

    return chartData;
  }, [devices, minYear, maxYear]);

  // Calculate trend line (simple linear regression)
  const trendLine = useMemo(() => {
    if (lineChartData.length < 2) return null;

    const n = lineChartData.length;
    const sumX = lineChartData.reduce((sum, d) => sum + d.year, 0);
    const sumY = lineChartData.reduce((sum, d) => sum + d.average, 0);
    const sumXY = lineChartData.reduce((sum, d) => sum + d.year * d.average, 0);
    const sumXX = lineChartData.reduce((sum, d) => sum + d.year * d.year, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return lineChartData.map((d) => ({
      x: d.year,
      y: slope * d.year + intercept,
    }));
  }, [lineChartData]);

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return `Year ${context[0].label}`;
          },
          label: (context: any) => {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;

            if (datasetLabel === "Average Price") {
              const yearData = lineChartData.find((d) =>
                d.year === parseInt(context.label)
              );
              return [
                `Average: $${value.toFixed(0)}`,
                `Median: $${yearData?.median.toFixed(0) || "N/A"}`,
                `Devices: ${yearData?.count || 0}`,
              ];
            } else if (datasetLabel === "Trend Line") {
              return `Trend: $${value.toFixed(0)}`;
            }
            return `${datasetLabel}: $${value.toFixed(0)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Release Year",
        },
        grid: {
          color: "#898989",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        grid: {
          color: "#898989",
        },
      },
    },
  };

  return (
    <div>
      <h2>Pricing Trends</h2>
      <p>How device pricing has evolved over time</p>

      <div class="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label>Year Range:</label>
            <select
              value={minYear}
              onChange={(e) => setMinYear(parseInt(e.currentTarget.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <span>to</span>
            <select
              value={maxYear}
              onChange={(e) => {
                const newMaxYear = parseInt(e.currentTarget.value);
                setMaxYear(newMaxYear);
                // Ensure minYear doesn't go below 2017
                if (minYear < 2017) {
                  setMinYear(2017);
                }
              }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {lineChartData.length > 0 && (
        <div class="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong>Average Price increase:</strong> {lineChartData.length > 1
                ? `$${
                  ((lineChartData[lineChartData.length - 1].average -
                    lineChartData[0].average) / (lineChartData.length - 1))
                    .toFixed(0)
                } per year`
                : "N/A"}
            </div>
            <div>
              <strong>Highest Average:</strong>{" "}
              ${Math.max(...lineChartData.map((d) => d.average)).toFixed(0)} in
              {" "}
              {lineChartData.find((d) =>
                d.average === Math.max(...lineChartData.map((d) => d.average))
              )?.year}
            </div>
            <div>
              <strong>Lowest Average:</strong>{" "}
              ${Math.min(...lineChartData.map((d) => d.average)).toFixed(0)} in
              {" "}
              {lineChartData.find((d) =>
                d.average === Math.min(...lineChartData.map((d) => d.average))
              )?.year}
            </div>
          </div>
        </div>
      )}

      <div style={{ height: "500px", width: "100%" }}>
        <FreshChart
          type="line"
          data={{
            labels: lineChartData.map((d) => d.year.toString()),
            datasets: [
              {
                label: "Average Price",
                data: lineChartData.map((d) => d.average),
                borderColor: "#4ECDC4",
                backgroundColor: "#4ECDC4",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.2,
              },
              ...(trendLine
                ? [{
                  label: "Trend Line",
                  data: trendLine.map((d) => d.y),
                  borderColor: "#FF6B6B",
                  backgroundColor: "#FF6B6B",
                  borderWidth: 2,
                  borderDash: [5, 5],
                  pointRadius: 0,
                  tension: 0,
                }]
                : []),
            ],
          }}
          options={options}
        />
      </div>

      <p class="secondary" style={{ marginTop: "1rem" }}>
        <strong>Note:</strong>{" "}
        Only includes devices with valid pricing and release date data.
        Discontinued devices are excluded. Trend line shows overall price
        direction over time.
      </p>
    </div>
  );
}
