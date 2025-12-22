import { useMemo } from "preact/hooks";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { FreshChart } from "./fresh-chart.tsx";

interface PieChartProps {
  devices: Device[];
}

export function OperatingSystemDistribution({ devices }: PieChartProps) {
  // Process data for pie chart
  const pieData = useMemo(() => {
    const osCounts: { [key: string]: { count: number; devices: Device[] } } =
      {};

    devices.forEach((device) => {
      const osList = device.os.list || [];
      const customFirmwares = device.os.customFirmwares || [];

      // Categorize operating systems
      let primaryOS = "Unknown";

      if (osList.length > 0) {
        const os = osList[0].toLowerCase();
        if (os.includes("android")) {
          primaryOS = "Android";
        } else if (os.includes("linux")) {
          primaryOS = "Linux";
        } else if (os.includes("windows")) {
          primaryOS = "Windows";
        } else if (
          os.includes("retroarch") || os.includes("emuelec") ||
          os.includes("batocera")
        ) {
          primaryOS = "Custom Firmware";
        } else if (customFirmwares.length > 0) {
          primaryOS = "Custom Firmware";
        } else {
          // If the OS name is empty or undefined, keep it as Unknown
          primaryOS = osList[0] && osList[0].trim() ? osList[0] : "Unknown";
        }
      } else if (customFirmwares.length > 0) {
        primaryOS = "Custom Firmware";
      }

      if (!osCounts[primaryOS]) {
        osCounts[primaryOS] = { count: 0, devices: [] };
      }
      osCounts[primaryOS].count++;
      osCounts[primaryOS].devices.push(device);
    });

    // Sort by count and create chart data
    const sortedOS = Object.entries(osCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([os, data]) => ({
        os,
        count: data.count,
        devices: data.devices,
        percentage: (data.count / devices.length) * 100,
      }));

    return sortedOS;
  }, [devices]);

  // Define colors for different OS types
  const getOSColor = (os: string): string => {
    const colors: { [key: string]: string } = {
      "Android": "#3DDC84",
      "Linux": "#FCC624",
      "Windows": "#0078D4",
      "Custom Firmware": "#FF6B6B",
      "Unknown": "#95A5A6",
    };

    // Generate color for other OS types
    if (!colors[os]) {
      let hash = 0;
      for (let i = 0; i < os.length; i++) {
        hash = os.charCodeAt(i) + ((hash << 5) - hash);
      }
      let hue = hash % 360;
      if (hue < 0) {
        hue += 360;
      }
      return `hsl(${hue}, 70%, 50%)`;
    }

    return colors[os];
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            const osData = pieData[context.dataIndex];
            return [
              `Devices: ${osData.count}`,
              `Percentage: ${osData.percentage.toFixed(1)}%`,
              "Click to view devices with this operating system",
            ];
          },
        },
      },
    },
    onClick: (_: any, elements: any) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const osData = pieData[elementIndex];
        if (osData) {
          globalThis.location.href = `/devices?tags=${
            encodeURIComponent(osData.os.toLowerCase())
          }`;
        }
      }
    },
  };

  return (
    <div>
      <p style={{ marginTop: "0", marginBottom: "1rem" }}>
        Distribution of devices across different operating systems and custom
        firmware.{" "}
        <br />Click on a slice to view devices with that operating system.
      </p>
      <div class="secondary" style={{ marginBottom: "1rem" }}>
        <strong>Total Devices:</strong> {devices.length}
      </div>

      <div class="os-distribution-container">
        <div class="chart-section">
          <div class="os-distribution-chart-container">
            <FreshChart
              type="pie"
              data={{
                labels: pieData.map((d) => d.os),
                datasets: [{
                  data: pieData.map((d) => d.count),
                  backgroundColor: pieData.map((d) => getOSColor(d.os)),
                  borderColor: pieData.map((d) => getOSColor(d.os)),
                  borderWidth: 2,
                }],
              }}
              options={{
                ...options,
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>

        <div class="stats-section">
          <h3>📊 Top 3 OS Statistics</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {pieData.slice(0, 3).map((osData, _) => (
              <div
                key={osData.os}
                class="card"
                style={{
                  borderLeft: `4px solid ${getOSColor(osData.os)}`,
                  paddingLeft: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <a
                    href={`/devices?tags=${
                      encodeURIComponent(osData.os.toLowerCase())
                    }`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    data-tooltip={`Search ${osData.os} devices`}
                    data-placement="right"
                  >
                    <h4 style={{ margin: 0, color: getOSColor(osData.os) }}>
                      {osData.os}
                    </h4>
                  </a>
                  <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                    {osData.count}
                  </span>
                </div>
                <div
                  class="secondary"
                  style={{ marginTop: "0.5rem", padding: "0.125rem 0" }}
                >
                  {osData.percentage.toFixed(1)}% of all devices
                </div>
                {osData.devices.length > 0 && (
                  <div
                    class="secondary"
                    style={{ marginTop: "0.5rem", padding: "0.125rem 0" }}
                  >
                    <strong>Examples:</strong>{" "}
                    {osData.devices.slice(0, 2).map((d) => d.name.normalized)
                      .join(", ")}
                    {osData.devices.length > 2 &&
                      ` +${osData.devices.length - 2} more`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
