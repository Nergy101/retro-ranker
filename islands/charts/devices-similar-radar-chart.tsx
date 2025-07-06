import { useState } from "preact/hooks";
import type { Device } from "@data/frontend/contracts/device.model.ts";
import { DevicesRadarChart } from "./devices-radar-chart.tsx";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

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
            translations={translations}
          />
        )
        : (
          <DevicesRadarChart
            devices={[device]}
            showTitle={showTitle}
            translations={translations}
          />
        )}
      <label>
        <input
          aria-label={TranslationPipe(translations, "charts.similarDevices")}
          type="checkbox"
          checked={showSimilarDevices}
          onChange={toggleShow}
        />
        <span>
          {TranslationPipe(translations, "charts.showSimilarDevices")}
        </span>
      </label>
    </div>
  );
}
