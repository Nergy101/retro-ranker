import { useMemo, useState } from "preact/hooks";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { FreshChart } from "./fresh-chart.tsx";

interface HistogramProps {
  devices: Device[];
}

export function PriceRangeDistribution({ devices }: HistogramProps) {
  const [includeDiscontinued, _setIncludeDiscontinued] = useState(false);

  // Define price brackets
  const priceBrackets = [
    { label: "$0-50", min: 0, max: 50, color: "#FF6B6B" },
    { label: "$50-100", min: 50, max: 100, color: "#4ECDC4" },
    { label: "$100-150", min: 100, max: 150, color: "#45B7D1" },
    { label: "$150-200", min: 150, max: 200, color: "#96CEB4" },
    { label: "$200-300", min: 200, max: 300, color: "#FFEAA7" },
    { label: "$300-400", min: 300, max: 400, color: "#DDA0DD" },
    { label: "$400-500", min: 400, max: 500, color: "#98D8C8" },
    { label: "$500+", min: 500, max: Infinity, color: "#F7DC6F" },
  ];

  // Process data for histogram
  const histogramData = useMemo(() => {
    const validDevices = devices.filter((device) =>
      device.pricing.average &&
      device.pricing.average > 0 &&
      (includeDiscontinued || !device.pricing.discontinued)
    );

    const bracketCounts = priceBrackets.map((bracket) => {
      const count = validDevices.filter((device) => {
        const price = device.pricing.average!;
        return price >= bracket.min && price < bracket.max;
      }).length;

      return {
        label: bracket.label,
        count,
        color: bracket.color,
        devices: validDevices.filter((device) => {
          const price = device.pricing.average!;
          return price >= bracket.min && price < bracket.max;
        }),
      };
    });

    return bracketCounts;
  }, [devices, includeDiscontinued]);

  // Calculate statistics
  const stats = useMemo(() => {
    const validDevices = devices.filter((device) =>
      device.pricing.average &&
      device.pricing.average > 0 &&
      (includeDiscontinued || !device.pricing.discontinued)
    );

    if (validDevices.length === 0) return null;

    const prices = validDevices.map((d) => d.pricing.average!);
    const sortedPrices = prices.sort((a, b) => a - b);

    return {
      total: validDevices.length,
      average: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      median: sortedPrices[Math.floor(sortedPrices.length / 2)],
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [devices, includeDiscontinued]);

  // Generate colors for price brackets similar to brand chart
  const getColorsForBracket = (bracket: any): [string, string] => {
    let hash = 0;
    const label = bracket.label;
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    let hue = hash % 360;
    if (hue < 0) {
      hue += 360;
    }
    return ["hsl(" + hue + ", 70%, 50%)", "hsl(" + hue + ", 70%, 50%, 0.5)"];
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const bracket = histogramData[context.dataIndex];
            return `${bracket.label}: ${context.raw} devices`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "#898989",
        },
        min: 0,
      },
    },
  };

  return (
    <div>
      <h2>Price Range Distribution</h2>
      <p>Distribution of devices across different price brackets</p>

      {stats && (
        <div class="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong>Total Devices:</strong> {stats.total}
            </div>
            <div>
              <strong>Average Price:</strong> ${stats.average.toFixed(0)}
            </div>
            <div>
              <strong>Median Price:</strong> ${stats.median.toFixed(0)}
            </div>
            <div>
              <strong>Price Range:</strong> ${stats.min} - ${stats.max}
            </div>
          </div>
        </div>
      )}

      <div style={{ height: "400px", width: "100%" }}>
        <FreshChart
          type="bar"
          data={{
            labels: histogramData.map((bracket) => bracket.label),
            datasets: [{
              label: "Number of Devices",
              data: histogramData.map((bracket) => bracket.count),
              backgroundColor: histogramData.map((bracket) =>
                getColorsForBracket(bracket)[1]
              ),
              borderColor: histogramData.map((bracket) =>
                getColorsForBracket(bracket)[0]
              ),
              borderWidth: 1,
              hoverBorderWidth: 3,
            }],
          }}
          options={options}
        />
      </div>

      <p class="secondary" style={{ marginTop: "1rem" }}>
        <strong>Note:</strong>{" "}
        Price statistics only include devices with valid pricing data. Some
        devices may be excluded due to missing or unknown pricing information.
      </p>
    </div>
  );
}
