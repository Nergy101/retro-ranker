import { Device } from "../data/models/device.model.ts";

interface EmulationPerformanceProps {
  device: Device;
}

export function EmulationPerformance({ device }: EmulationPerformanceProps) {
  const ratings = device.consoleRatings;

  const getRatingInfo = (rating: string) => {
    switch (rating.toUpperCase()) {
      case "A":
        return { color: "#22c55e", text: "Excellent 5/5" };
      case "B":
        return { color: "#79c34c", text: "Playable 4/5" };
      case "C":
        return { color: "#fde047", text: "Playable with tweaks 3/5" };
      case "D":
        return { color: "#fb923c", text: "Barely works 2/5" };
      case "F":
        return { color: "#ef4444", text: "Doesn't work 1/5" };
      default:
        return { color: "var(--pico-contrast)", text: "Unknown" };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      {ratings.map((rating) => {
        const { color, text } = getRatingInfo(rating.rating);
        return (
          <div
            style={{
              backgroundColor: color,
              padding: "0.25rem",
              borderRadius: "0.5em",
              textAlign: "center",
              color: ["A", "B", "F"].includes(rating.rating.toUpperCase())
                ? "white"
                : "black",
              fontSize: "0.75rem",
            }}
          >
            <span data-tooltip={text}>{rating.system}</span>
          </div>
        );
      })}
    </div>
  );
}
