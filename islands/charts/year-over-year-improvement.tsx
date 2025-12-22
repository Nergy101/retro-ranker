import { useMemo, useState } from "preact/hooks";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { FreshChart } from "./fresh-chart.tsx";

interface LineChartProps {
  devices: Device[];
}

export function YearOverYearImprovement({ devices }: LineChartProps) {
  const [selectedMetric, setSelectedMetric] = useState("averagePrice");

  // Process data for year-over-year analysis (last 5 years only)
  const yearlyData = useMemo(() => {
    const yearStats: { [year: number]: any } = {};
    const currentYear = new Date().getFullYear();
    const cutoffYear = currentYear - 4; // Last 5 years (including current year)

    devices.forEach((device) => {
      if (!device.released?.mentionedDate) return;

      const year = new Date(device.released.mentionedDate).getFullYear();
      if (isNaN(year) || year < cutoffYear) return; // Only include last 5 years

      if (!yearStats[year]) {
        yearStats[year] = {
          year,
          devices: [],
          ratings: [],
          prices: [],
          screenSizes: [],
          ramSizes: [],
          storageSizes: [],
          weights: [],
          batteryCapacities: [],
          cpuCores: [],
        };
      }

      yearStats[year].devices.push(device);

      // Collect metrics
      if (device.totalRating > 0) {
        yearStats[year].ratings.push(device.totalRating);
      }

      if (
        device.pricing.average && device.pricing.average > 0 &&
        !device.pricing.discontinued
      ) {
        yearStats[year].prices.push(device.pricing.average);
      }

      if (device.screen.size && device.screen.size > 0) {
        yearStats[year].screenSizes.push(device.screen.size);
      }

      if (device.ram?.sizes && device.ram.sizes.length > 0) {
        // Use the first (primary) RAM size
        yearStats[year].ramSizes.push(device.ram.sizes[0]);
      }

      if (device.storage) {
        // Extract storage size from string (e.g., "64GB" -> 64)
        const storageMatch = device.storage.match(/(\d+)/);
        if (storageMatch) {
          yearStats[year].storageSizes.push(parseInt(storageMatch[1]));
        }
      }

      if (device.weight && device.weight > 0) {
        yearStats[year].weights.push(device.weight);
      }

      if (device.battery?.capacity && device.battery.capacity > 0) {
        yearStats[year].batteryCapacities.push(device.battery.capacity);
      }

      if (device.cpus && device.cpus.length > 0) {
        // Sum up all CPU cores across all CPUs
        const totalCores = device.cpus.reduce(
          (sum, cpu) => sum + (cpu.cores || 0),
          0,
        );
        if (totalCores > 0) {
          yearStats[year].cpuCores.push(totalCores);
        }
      }
    });

    // Calculate averages for each year
    const chartData = Object.values(yearStats)
      .map((yearData) => ({
        year: yearData.year,
        deviceCount: yearData.devices.length,
        averageRating: yearData.ratings.length > 0
          ? yearData.ratings.reduce(
            (sum: number, rating: number) => sum + rating,
            0,
          ) /
            yearData.ratings.length
          : null,
        averagePrice: yearData.prices.length > 0
          ? yearData.prices.reduce(
            (sum: number, price: number) => sum + price,
            0,
          ) /
            yearData.prices.length
          : null,
        averageScreenSize: yearData.screenSizes.length > 0
          ? yearData.screenSizes.reduce(
            (sum: number, size: number) => sum + size,
            0,
          ) /
            yearData.screenSizes.length
          : null,
        averageRam: yearData.ramSizes.length > 0
          ? yearData.ramSizes.reduce(
            (sum: number, ram: number) => sum + ram,
            0,
          ) /
            yearData.ramSizes.length
          : null,
        averageStorage: yearData.storageSizes.length > 0
          ? yearData.storageSizes.reduce(
            (sum: number, storage: number) => sum + storage,
            0,
          ) /
            yearData.storageSizes.length
          : null,
        averageWeight: yearData.weights.length > 0
          ? yearData.weights.reduce(
            (sum: number, weight: number) => sum + weight,
            0,
          ) /
            yearData.weights.length
          : null,
        averageBatteryCapacity: yearData.batteryCapacities.length > 0
          ? yearData.batteryCapacities.reduce(
            (sum: number, capacity: number) => sum + capacity,
            0,
          ) /
            yearData.batteryCapacities.length
          : null,
        averageCpuCores: yearData.cpuCores.length > 0
          ? yearData.cpuCores.reduce(
            (sum: number, cores: number) => sum + cores,
            0,
          ) /
            yearData.cpuCores.length
          : null,
        // Keep raw arrays for counting
        ratings: yearData.ratings,
        prices: yearData.prices,
        screenSizes: yearData.screenSizes,
        ramSizes: yearData.ramSizes,
        storageSizes: yearData.storageSizes,
        weights: yearData.weights,
        batteryCapacities: yearData.batteryCapacities,
        cpuCores: yearData.cpuCores,
      }))
      .sort((a, b) => a.year - b.year);

    return chartData;
  }, [devices]);

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
            const yearData = yearlyData.find((d) =>
              d.year === parseInt(context.label)
            );

            if (value === null || isNaN(value)) {
              return `${datasetLabel}: No data available`;
            }

            if (datasetLabel === "Average Price ($)") {
              const priceCount = yearData?.prices?.length || 0;
              return `Average Price: $${
                value.toFixed(0)
              } (${priceCount} devices with pricing)`;
            } else if (datasetLabel === 'Average Screen Size (")') {
              const screenCount = yearData?.screenSizes?.length || 0;
              return `Average Screen Size: ${
                value.toFixed(1)
              }" (${screenCount} devices with screen data)`;
            } else if (datasetLabel === "Average RAM (GB)") {
              const ramCount = yearData?.ramSizes?.length || 0;
              return `Average RAM: ${
                value.toFixed(0)
              }GB (${ramCount} devices with RAM data)`;
            } else if (datasetLabel === "Average Storage (GB)") {
              const storageCount = yearData?.storageSizes?.length || 0;
              return `Average Storage: ${
                value.toFixed(0)
              }GB (${storageCount} devices with storage data)`;
            } else if (datasetLabel === "Average Weight (g)") {
              const weightCount = yearData?.weights?.length || 0;
              return `Average Weight: ${
                value.toFixed(0)
              }g (${weightCount} devices with weight data)`;
            } else if (datasetLabel === "Average Battery (mAh)") {
              const batteryCount = yearData?.batteryCapacities?.length || 0;
              return `Average Battery: ${
                value.toFixed(0)
              }mAh (${batteryCount} devices with battery data)`;
            } else if (datasetLabel === "Average CPU Cores") {
              const cpuCount = yearData?.cpuCores?.length || 0;
              return `Average CPU Cores: ${
                value.toFixed(1)
              } (${cpuCount} devices with CPU data)`;
            } else if (datasetLabel === "Performance Rating (0-10)") {
              const ratingCount = yearData?.ratings?.length || 0;
              return `Performance Rating (0-10): ${
                value.toFixed(1)
              }/10 (${ratingCount} devices with ratings)`;
            }
            return `${datasetLabel}: ${value.toFixed(1)}`;
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
          text: "Average Value",
        },
        grid: {
          color: "#898989",
        },
      },
    },
  };

  const metricColors = {
    averagePrice: "#FF6B6B",
    averageScreenSize: "#45B7D1",
    averageRam: "#96CEB4",
    averageStorage: "#FFEAA7",
    averageWeight: "#DDA0DD",
    averageBatteryCapacity: "#98D8C8",
    averageCpuCores: "#F7DC6F",
    averageRating: "#4ECDC4",
  };

  const metricLabels = {
    averagePrice: "Average Price ($)",
    averageScreenSize: 'Average Screen Size (")',
    averageRam: "Average RAM (GB)",
    averageStorage: "Average Storage (GB)",
    averageWeight: "Average Weight (g)",
    averageBatteryCapacity: "Average Battery (mAh)",
    averageCpuCores: "Average CPU Cores",
    averageRating: "Performance Rating (0-10)",
  };

  return (
    <div>
      <p style={{ marginTop: "0", marginBottom: "1rem" }}>
        How device specifications and performance have changed over the last 5
        years
      </p>

      <div class="card">
        <h3>📊 Select Metric to Display</h3>
        <div class="secondary" style={{ marginBottom: "1rem" }}>
          <strong>Analysis Period:</strong> {new Date().getFullYear() - 4} -
          {" "}
          {new Date().getFullYear()} (Last 5 Years)
        </div>
        <div class="secondary" style={{ marginBottom: "1rem" }}>
          <strong>
            Data Coverage for{" "}
            {metricLabels[selectedMetric as keyof typeof metricLabels]}:
          </strong>{" "}
          {(() => {
            const totalDevices = yearlyData.reduce((sum, yearData) => {
              if (selectedMetric === "averagePrice") {
                return sum + (yearData.prices?.length || 0);
              }
              if (selectedMetric === "averageScreenSize") {
                return sum + (yearData.screenSizes?.length || 0);
              }
              if (selectedMetric === "averageRam") {
                return sum + (yearData.ramSizes?.length || 0);
              }
              if (selectedMetric === "averageStorage") {
                return sum + (yearData.storageSizes?.length || 0);
              }
              if (selectedMetric === "averageWeight") {
                return sum + (yearData.weights?.length || 0);
              }
              if (selectedMetric === "averageBatteryCapacity") {
                return sum + (yearData.batteryCapacities?.length || 0);
              }
              if (selectedMetric === "averageCpuCores") {
                return sum + (yearData.cpuCores?.length || 0);
              }
              if (selectedMetric === "averageRating") {
                return sum + (yearData.ratings?.length || 0);
              }
              return sum;
            }, 0);
            const yearsWithData = yearlyData.filter((yearData) => {
              if (selectedMetric === "averagePrice") {
                return yearData.prices?.length > 0;
              }
              if (selectedMetric === "averageScreenSize") {
                return yearData.screenSizes?.length > 0;
              }
              if (selectedMetric === "averageRam") {
                return yearData.ramSizes?.length > 0;
              }
              if (selectedMetric === "averageStorage") {
                return yearData.storageSizes?.length > 0;
              }
              if (selectedMetric === "averageWeight") {
                return yearData.weights?.length > 0;
              }
              if (selectedMetric === "averageBatteryCapacity") {
                return yearData.batteryCapacities?.length > 0;
              }
              if (selectedMetric === "averageCpuCores") {
                return yearData.cpuCores?.length > 0;
              }
              if (selectedMetric === "averageRating") {
                return yearData.ratings?.length > 0;
              }
              return false;
            }).length;
            return `${totalDevices} devices across ${yearsWithData} years`;
          })()}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {Object.keys(metricLabels).map((metric) => (
            <label
              key={metric}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="radio"
                name="metric"
                value={metric}
                checked={selectedMetric === metric}
                onChange={(e) => setSelectedMetric(e.currentTarget.value)}
              />
              <span
                style={{
                  color: metricColors[metric as keyof typeof metricColors],
                }}
              >
                {metricLabels[metric as keyof typeof metricLabels]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div class="year-over-year-chart-container">
        <FreshChart
          type="line"
          data={{
            labels: yearlyData.map((d) => d.year.toString()),
            datasets: [{
              label: metricLabels[selectedMetric as keyof typeof metricLabels],
              data: yearlyData.map((d) => {
                const value = d[selectedMetric as keyof typeof d] as number;
                return value !== null && !isNaN(value) ? value : null;
              }),
              borderColor:
                metricColors[selectedMetric as keyof typeof metricColors],
              backgroundColor:
                metricColors[selectedMetric as keyof typeof metricColors],
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.2,
              fill: false,
              spanGaps: false, // Don't connect points across null values
            }],
          }}
          options={{
            ...options,
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>

      <p class="secondary" style={{ marginTop: "1rem" }}>
        <strong>Note:</strong>{" "}
        Only includes devices from the last 5 years with valid release dates and
        the selected metrics. Trends are calculated from the first to last
        available data points for each metric within this 5-year period.
      </p>
    </div>
  );
}
