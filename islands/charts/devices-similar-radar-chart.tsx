import { useState } from "preact/hooks";
import type { Device } from "../../data/frontend/contracts/device.model.ts";
import DevicesRadarChart from "./devices-radar-chart.tsx";

interface DevicesSimilarRadarChartProps {
  device: Device;
  similarDevices: Device[];
  showTitle?: boolean;
}

export function DevicesSimilarRadarChart({
  device,
  similarDevices,
  showTitle = true,
}: DevicesSimilarRadarChartProps) {
  const [showSimilarDevices, setShowSimilarDevices] = useState(true);

  const toggleShow = (e: Event) => {
    // For checkboxes, read the new "checked" value from the event target
    setShowSimilarDevices((e.target as HTMLInputElement).checked);
  };

  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {showSimilarDevices
        ? (
          <DevicesRadarChart
            devices={[device, ...similarDevices]}
            showTitle={showTitle}
          />
        )
        : <DevicesRadarChart devices={[device]} showTitle={showTitle} />}
      <label>
        <input
          aria-label="Show similar devices in radar chart"
          type="checkbox"
          checked={showSimilarDevices}
          onChange={toggleShow}
        />
        <span>Show similar devices in chart</span>
      </label>
    </div>
  );
}
