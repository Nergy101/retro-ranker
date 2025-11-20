import { useCallback, useMemo, useState } from "preact/hooks";
import type { Device } from "../../data/frontend/contracts/device.model.ts";
import { DevicesRadarChart } from "./devices-radar-chart.tsx";

interface DevicesSimilarRadarChartProps {
  device: Device;
  similarDevices: Device[];
  showTitle?: boolean;
  translations?: Record<string, string>;
}

export function DevicesSimilarRadarChart({
  device,
  similarDevices,
  showTitle = true,
  translations = {},
}: DevicesSimilarRadarChartProps) {
  const [showSimilarDevices, setShowSimilarDevices] = useState(true);

  const toggleShow = useCallback((e: Event) => {
    setShowSimilarDevices((e.target as HTMLInputElement).checked);
  }, []);

  const devicesToShow = useMemo(() => {
    return showSimilarDevices ? [device, ...similarDevices] : [device];
  }, [device, similarDevices, showSimilarDevices]);

  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <DevicesRadarChart
        devices={devicesToShow}
        showTitle={showTitle}
        translations={translations}
      />
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        <input
          type="checkbox"
          checked={showSimilarDevices}
          onChange={toggleShow}
        />
        Show similar devices
      </label>
    </div>
  );
}
