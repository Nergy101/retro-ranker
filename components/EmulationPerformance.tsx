import { PiQuestionFill, PiVibrate } from "@preact-icons/pi";
import { Device } from "../data/device.model.ts";
import { Cooling } from "../data/models/cooling.model.ts";
import { DeviceService } from "../services/devices/device.service.ts";
import { RatingInfo } from "./ratings/RatingInfo.tsx";
import { Tag } from "./Tags/Tag.tsx";

interface EmulationPerformanceProps {
  device: Device;
}

export function EmulationPerformance({ device }: EmulationPerformanceProps) {
  const ratings = device.systemRatings;

  const getCoolingColor = (cooling: Cooling) => {
    // count the number of true values
    const trueCount = [
      cooling.hasHeatsink,
      cooling.hasHeatPipe,
      cooling.hasFan,
      cooling.hasVentilationCutouts,
    ].filter(Boolean)
      .length;
    if (trueCount === 0) {
      return { color: "#AB0D0D", textColor: "white", tooltip: "None" };
    }
    if (trueCount === 1) {
      return { color: "#EEB61B", textColor: "black", tooltip: "Moderate" };
    }
    if (trueCount === 2) {
      return { color: "#3952A2", textColor: "white", tooltip: "Good" };
    }
    if (trueCount === 3) {
      return { color: "#16833E", textColor: "white", tooltip: "Excellent" };
    }
    return {
      color: "var(--pico-contrast)",
      textColor: "black",
      tooltip: "Unknown",
    };
  };

  const getRumbleColor = (rumble: boolean | null) => {
    if (rumble === null) {
      return {
        color: "#EEB61B",
        textColor: "black",
        tooltip: "Unknown",
      };
    }
    if (rumble) {
      return { color: "#16833E", textColor: "white", tooltip: "Present" };
    }

    return { color: "#AB0D0D", textColor: "white", tooltip: "Not present" };
  };

  const renderCoolingSection = () => {
    const coolingData = getCoolingColor(device.cooling);
    return (
      <div
        style={{
          backgroundColor: coolingData.color,
          padding: "0.25rem",
          borderRadius: "0.5em",
          textAlign: "center",
          fontSize: "0.75rem",
          color: coolingData.textColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tooltip={coolingData.tooltip}
      >
        <strong>Cooling</strong>
        <span style={{ display: "flex", gap: "0.25rem", fontSize: "1rem" }}>
          {DeviceService.getCoolingIcons(device.cooling).map((
            { icon, tooltip },
          ) => (
            <span data-tooltip={tooltip} data-placement="bottom">{icon}</span>
          ))}
        </span>
      </div>
    );
  };

  const renderRumbleSection = () => {
    const rumbleData = getRumbleColor(device.rumble);
    return (
      <div
        style={{
          backgroundColor: rumbleData.color,
          color: rumbleData.textColor,
          padding: "0.25rem",
          borderRadius: "0.5em",
          textAlign: "center",
          fontSize: "0.75rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-tooltip={rumbleData.tooltip}
      >
        <strong>Rumble</strong>
        <span style={{ display: "flex", gap: "0.25rem", fontSize: "1rem" }}>
          {device.rumble ? <PiVibrate /> : <PiQuestionFill />}
        </span>
      </div>
    );
  };

  return (
    <div
      class="emulation-performance"
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
    >
      <h3 style={{ textAlign: "center", padding: 0, margin: 0 }}>
        Emulation Performance
      </h3>
      <div class="rating-info-grid">
        {ratings.map((rating) => (
          <RatingInfo key={rating.system} rating={rating} />
        ))}
      </div>

      <h3 style={{ textAlign: "center", padding: 0, margin: 0 }}>Ergonomics</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
        {renderCoolingSection()}
        {renderRumbleSection()}
      </div>
    </div>
  );
}
