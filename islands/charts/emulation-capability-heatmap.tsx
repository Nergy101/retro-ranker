import { useMemo, useState } from "preact/hooks";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import {
  EmulationSystem,
  EmulationSystemOrder,
} from "../../data/frontend/enums/emulation-system.ts";
import { FreshChart } from "./fresh-chart.tsx";

interface HeatmapProps {
  devices: Device[];
}

export function EmulationCapabilityHeatmap({ devices }: HeatmapProps) {
  // Get all available years for the slider
  const availableYears = useMemo(() => {
    const years = devices
      .filter((d) => d.released?.mentionedDate)
      .map((d) => {
        const date = d.released?.mentionedDate;
        return date ? new Date(date).getFullYear() : null;
      })
      .filter((year): year is number => year !== null && !isNaN(year));

    return Array.from(new Set(years)).sort((a, b) => a - b);
  }, [devices]);

  // State for year range filters
  const [minYear, setMinYear] = useState(availableYears[0] || 2020);
  const [maxYear, setMaxYear] = useState(
    availableYears[availableYears.length - 1] || new Date().getFullYear(),
  );
  // Get all emulation systems in order
  const emulationSystems = useMemo(() => {
    return Object.values(EmulationSystem)
      .filter((system) => system !== EmulationSystem.All)
      .sort((a, b) => EmulationSystemOrder[a] - EmulationSystemOrder[b]);
  }, []);

  // Create heatmap data
  const heatmapData = useMemo(() => {
    const data: number[][] = [];
    const deviceNames: string[] = [];

    // Filter devices by year range and get top 20 devices by rating
    const filteredDevices = devices.filter((d) => {
      if (!d.released?.mentionedDate) return false;
      const year = new Date(d.released.mentionedDate).getFullYear();
      return year >= minYear && year <= maxYear;
    });

    const topDevices = filteredDevices
      .filter((d) => d.totalRating > 0)
      .sort((a, b) => b.totalRating - a.totalRating)
      .slice(0, 20);

    for (const device of topDevices) {
      deviceNames.push(device.name.normalized);
      const deviceRatings: number[] = [];

      for (const system of emulationSystems) {
        const systemRating = device.systemRatings.find((sr) =>
          sr.system === system
        );
        // Convert rating to 0-1 scale for heatmap intensity
        const normalizedRating = systemRating && systemRating.ratingNumber
          ? systemRating.ratingNumber / 10
          : 0;
        deviceRatings.push(normalizedRating);
      }

      data.push(deviceRatings);
    }

    return { data, deviceNames };
  }, [devices, emulationSystems, minYear, maxYear]);

  return (
    <div>
      <h2>Emulation Capability Matrix</h2>
      <p>
        Performance ratings for top 20 devices across different retro gaming
        systems
      </p>

      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h3>📅 Filter by Release Year</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label>From:</label>
            <select
              value={minYear}
              onChange={(e) => setMinYear(parseInt(e.currentTarget.value))}
              style={{ padding: "0.25rem" }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label>To:</label>
            <select
              value={maxYear}
              onChange={(e) => setMaxYear(parseInt(e.currentTarget.value))}
              style={{ padding: "0.25rem" }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: "0.9em", color: "#666" }}>
            Showing devices from {minYear} to {maxYear}
          </div>
        </div>

        {heatmapData.deviceNames.length > 0 && (
          <div style={{ marginTop: "1rem", fontSize: "0.9em", color: "#666" }}>
            <strong>Displaying:</strong> {heatmapData.deviceNames.length}{" "}
            devices (top {Math.min(20, heatmapData.deviceNames.length)}{" "}
            by rating in selected year range)
          </div>
        )}

        {heatmapData.deviceNames.length === 0 && (
          <div
            style={{ marginTop: "1rem", fontSize: "0.9em", color: "#e74c3c" }}
          >
            <strong>No devices found</strong>{" "}
            in the selected year range. Try expanding the range.
          </div>
        )}
      </div>

      <p>
        <strong>Legend:</strong>{" "}
        Higher values indicate better emulation performance. Hover over bars to
        see detailed ratings.
      </p>
      <div style={{ height: "600px", width: "100%" }}>
        <FreshChart
          type="bar"
          data={{
            labels: emulationSystems,
            datasets: heatmapData.deviceNames.map((
              deviceName,
              deviceIndex,
            ) => ({
              label: deviceName,
              data: heatmapData.data[deviceIndex],
              backgroundColor: `hsl(${(deviceIndex * 137.5) % 360}, 70%, 60%)`,
              borderColor: `hsl(${(deviceIndex * 137.5) % 360}, 70%, 40%)`,
              borderWidth: 1,
            })),
          }}
          options={{
            plugins: {
              legend: {
                display: true,
                position: "top" as const,
                labels: {
                  usePointStyle: true,
                  padding: 10,
                  font: {
                    size: 10,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  title: (context: any) => {
                    const systemIndex = context[0].dataIndex;
                    return `${emulationSystems[systemIndex]}`;
                  },
                  label: (context: any) => {
                    const deviceName = context.dataset.label;
                    const rating = context.parsed.y;
                    const device = devices.find((d) =>
                      d.name.normalized === deviceName
                    );
                    const systemRating = device?.systemRatings.find((sr) =>
                      sr.system === emulationSystems[context.dataIndex]
                    );
                    return [
                      `Device: ${deviceName}`,
                      `Rating: ${systemRating?.ratingMark || "N/A"}`,
                      `Score: ${rating.toFixed(1)}/10`,
                    ];
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Emulation Systems",
                },
                grid: {
                  color: "#898989",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Performance Rating",
                },
                min: 0,
                max: 1,
                grid: {
                  color: "#898989",
                },
                ticks: {
                  callback: function (value: any) {
                    return (value * 10).toFixed(0);
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
