import { useSignal } from "@preact/signals";
import type { Device } from "../../data/device.model.ts";
import { DevicesRadarChart } from "./devices-radar-chart.tsx";

interface DevicesSimilarRadarChartProps {
  device: Device;
  similarDevices: Device[];
}

export default function DevicesSimilarRadarChart({
  device,
  similarDevices,
}: DevicesSimilarRadarChartProps) {
  const showSimilarDevices = useSignal(false);

  const toggleShow = (e: Event) => {
    // For checkboxes, read the new "checked" value from the event target
    showSimilarDevices.value = (e.target as HTMLInputElement).checked;
  };

  return (
    <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {showSimilarDevices.value
        ? <DevicesRadarChart devices={[device, ...similarDevices]} />
        : <DevicesRadarChart devices={[device]} />}
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
