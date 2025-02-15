import { useSignal } from "@preact/signals";
import type { Device } from "../../data/device.model.ts";
import { DevicesRadarChart } from "./DevicesRadarChart.tsx";

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
  const showSimilarDevices = useSignal(true);

  const toggleShow = (e: Event) => {
    // For checkboxes, read the new "checked" value from the event target
    showSimilarDevices.value = (e.target as HTMLInputElement).checked;
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
      {showSimilarDevices.value
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
          checked={showSimilarDevices.value}
          onChange={toggleShow}
        />
        <span>Show similar devices in chart</span>
      </label>
    </div>
  );
}
