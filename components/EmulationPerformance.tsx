import { Device } from "../data/device.model.ts";

interface EmulationPerformanceProps {
  device: Device;
}

export function EmulationPerformance({ device }: EmulationPerformanceProps) {
  const systems = device.systemRatings;

  const getRatingInfo = (rating: string) => {
    switch (rating.toUpperCase()) {
      case "A":
        return { color: "#22c55e", text: "Excellent" };
      case "B":
        return { color: "#1a9648", text: "Playable" };
      case "C":
        return { color: "#fde047", text: "Playable with tweaks" };
      case "D":
        return { color: "#fb923c", text: "Works" };
      case "F":
        return { color: "#ef4444", text: "Doesn't work" };
      default:
        return { color: "var(--pico-muted)", text: "N/A" };
    }
  };

  return (
    <div style={{ 
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "0.5rem",
    }}>
      {systems.map((system) => {
        const { color, text } = getRatingInfo(system.rating);
        return (
          <div
            style={{
              backgroundColor: color,
              padding: "0.25rem",
              borderRadius: "0.5em",
              textAlign: "center",
              color: ["A", "F"].includes(system.rating.toUpperCase())
                ? "white"
                : "black",
              fontSize: "0.75rem",
            }}
          >
            <span data-tooltip={text}>{system.system}</span>
          </div>
        );
      })}
    </div>
  );
}
