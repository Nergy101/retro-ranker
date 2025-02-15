import { Device } from "../../data/device.model.ts";

interface DeviceCardRowProps {
  device: Device;
}

export function DeviceCardRow({ device }: DeviceCardRowProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: ".5rem",
        border: "1px solid var(--pico-primary)",
        padding: ".25rem",
        borderRadius: "var(--pico-radius)",
        width: "80%",
      }}
    >
      <img
        src={device.image.url ?? "images/placeholder.png"}
        alt={device.name.raw}
      />
      <strong style={{ color: "var(--pico-contrast)" }}>
        {device.name.raw} <span style={{ fontSize: "0.7rem" }}>by</span>{" "}
        {device.brand}
      </strong>
      <span style={{ fontSize: "0.7rem" }}>
        for {device.pricing.average} {device.pricing.currency}
      </span>
    </div>
  );
}
