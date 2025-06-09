import { useState } from "preact/hooks";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { getBrandColors } from "@data/frontend/services/utils/color.utils.ts";
import { FreshChart } from "./fresh-chart.tsx";

interface LineChartProps {
  devices: Device[];
}

export function DevicesPerReleaseYearLineChart(
  { devices }: LineChartProps,
) {
  // Compute the full range of years from the devices
  const fullYears = Array.from(
    new Set(
      devices.reduce((acc, d) => {
        if (d.released?.mentionedDate) {
          acc.push(new Date(d.released.mentionedDate).getFullYear());
        }
        return acc;
      }, [] as number[]),
    ),
  ).sort((a, b) => a - b);

  // Use the first and last available years as the slider boundaries
  const initialMin = fullYears[0] ?? new Date().getFullYear();
  const initialMax = new Date().getFullYear();

  // Signals to store the current filter values for minimum and maximum year
  const [selectedMinYear, setSelectedMinYear] = useState(2020);
  const [selectedMaxYear, setSelectedMaxYear] = useState(initialMax);
  const [showTotalDevices, setShowTotalDevices] = useState(false);
  const [minimalOf12DevicesProduced, setMinimalOf12DevicesProduced] = useState(
    true,
  );

  const [brandColors, setBrandColors] = useState<
    Record<string, { border: string; background: string }>
  >({});

  // Filter the devices to only include those within the selected year range.
  const filteredDevices = devices.filter((d) => {
    if (d.released?.mentionedDate) {
      const year = new Date(d.released.mentionedDate).getFullYear();
      return year >= selectedMinYear && year <= selectedMaxYear;
    }
    return false;
  });

  const uniqueBrands = Array.from(
    new Set(filteredDevices.map((d) => d.brand.sanitized)),
  ).sort();

  const initializeBrandColors = () => {
    setBrandColors(getBrandColors(uniqueBrands));
  };

  // Call this right after the signals are defined
  initializeBrandColors();

  // Compute the unique years from the filtered devices.
  const getAllYears = (): number[] => {
    const years: number[] = [];
    for (const d of filteredDevices) {
      if (d.released?.mentionedDate) {
        const actualDate = new Date(d.released.mentionedDate);
        years.push(actualDate.getFullYear());
      }
    }
    return Array.from(new Set(years)).sort((a, b) => a - b);
  };

  const getLineChartLabels = (): (number | string)[] => {
    return getAllYears();
  };

  const getLineChartData = () => {
    const years = getAllYears();
    const amountOfDevicesPerYear: number[] = Array(years.length).fill(0);

    for (const d of filteredDevices) {
      if (d.released?.mentionedDate) {
        const actualDate = new Date(d.released.mentionedDate);
        const year = actualDate.getFullYear();
        const index = years.indexOf(year);
        if (index !== -1) {
          amountOfDevicesPerYear[index]++;
        }
      }
    }

    const amountOfDevicesPerBrandPerYear: Record<string, number[]> = {};

    // First, initialize arrays for each brand
    for (const brand of uniqueBrands) {
      amountOfDevicesPerBrandPerYear[brand] = Array(years.length).fill(0);
    }

    // Then count devices per brand per year
    for (const d of filteredDevices) {
      if (d.released?.mentionedDate) {
        const actualDate = new Date(d.released.mentionedDate);
        const year = actualDate.getFullYear();
        const index = years.indexOf(year);
        if (index !== -1) {
          amountOfDevicesPerBrandPerYear[d.brand.sanitized][index]++;
        }
      }
    }

    const data = [];

    if (showTotalDevices) {
      data.push({
        label: "Total devices released",
        data: amountOfDevicesPerYear,
        borderColor: "#e48500",
        pointBackgroundColor: "#e48500",
        borderWidth: 3,
        tension: 0.2,
        pointRadius: 3,
      });
    }

    data.push(
      ...Object.entries(amountOfDevicesPerBrandPerYear)
        .filter((x) => {
          if (minimalOf12DevicesProduced) {
            return x[1].reduce((acc, curr) => acc + curr, 0) >= 10;
          }
          return true;
        })
        .map(([brand, amountOfDevicesPerYear]) => ({
          label: `${brand}`,
          data: amountOfDevicesPerYear,
          fill: false,
          borderColor: brandColors[brand]?.border,
          pointBackgroundColor: brandColors[brand]?.background,
          borderWidth: 2,
          tension: .2,
          pointRadius: 3,
        })),
    );

    return data;
  };

  return (
    <div>
      <h2>Devices released per year</h2>
      <p>Keep in mind, the current year is not complete yet.</p>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          <span>Min Year: {selectedMinYear}</span>
          <input
            aria-label="Minimum year"
            type="range"
            min={initialMin}
            max={selectedMaxYear}
            value={selectedMinYear}
            onInput={(e: Event) => {
              const value = parseInt((e.target as HTMLInputElement).value);
              setSelectedMinYear(value);
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          <span>Max Year: {selectedMaxYear}</span>
          <input
            aria-label="Maximum year"
            type="range"
            min={selectedMinYear}
            max={initialMax}
            value={selectedMaxYear}
            onInput={(e: Event) => {
              const value = parseInt((e.target as HTMLInputElement).value);
              setSelectedMaxYear(value);
            }}
          />
        </div>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={minimalOf12DevicesProduced}
            onChange={(e) =>
              setMinimalOf12DevicesProduced(
                (e.target as HTMLInputElement).checked,
              )}
          />
          Show brands that produced &gt; 10 devices over selected years
        </label>
        <label>
          <input
            type="checkbox"
            checked={showTotalDevices}
            onChange={(e) =>
              setShowTotalDevices((e.target as HTMLInputElement).checked)}
          />
          Show total devices line
        </label>
      </div>
      <FreshChart
        type="line"
        options={{
          plugins: {
            legend: {
              display: minimalOf12DevicesProduced,
              onHover: (_, legendItem, legend) => {
                const chart = legend.chart;
                chart.data.datasets.forEach((dataset, index) => {
                  if (index !== legendItem.datasetIndex) {
                    // Reduce opacity of non-hovered datasets
                    dataset.borderWidth = 1;
                    dataset.borderColor = dataset.borderColor?.toString()
                      .replace("1)", "0.1)");
                  } else {
                    // Emphasize hovered dataset
                    dataset.borderWidth = 4;
                  }
                });
                chart.update();
              },
              onLeave: (_, __, legend) => {
                const chart = legend.chart;
                chart.data.datasets.forEach((dataset, index) => {
                  // Restore original styles
                  dataset.borderWidth = index === 0 ? 3 : 2;
                  dataset.borderColor = dataset.borderColor?.toString().replace(
                    "0.1)",
                    "1)",
                  );
                });
                chart.update();
              },
            },
          },
          hover: {
            mode: "dataset",
            intersect: false,
          },
          scales: {
            y: {
              grid: {
                color: "#898989",
              },
              min: 0,
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
        data={{
          labels: getLineChartLabels(),
          datasets: getLineChartData(),
        }}
      />
    </div>
  );
}
