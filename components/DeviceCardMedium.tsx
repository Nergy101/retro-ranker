import { Device } from "../data/models/device.model.ts";
import { StarRating } from "./StarRating.tsx";
interface DeviceCardMediumProps {
  device: Device;
}

export function DeviceCardMedium({ device }: DeviceCardMediumProps) {
  return (
    <article
      class="device-search-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        border: "1px solid var(--pico-primary)",
        borderRadius: "0.5rem",
      }}
    >
      <a
        href={`/devices/${device.name.sanitized}`}
        style={{
          textDecoration: "none",
        }}
      >
        <header
          style={{
            flex: 1,
            margin: "0",
            paddingTop: "0.5rem",
            borderRadius: "0.5rem",
          }}
        >
          <hgroup style={{ textAlign: "center" }}>
            <h4
              title={device.name.sanitized}
            >
              <span style={{ color: "var(--pico-primary)" }}>
                {device.name.raw}
              </span>
            </h4>
            <p style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}>
              {device.brand}
            </p>
            <StarRating device={device} />
          </hgroup>
        </header>
        <div style="padding-top: 0.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <img
            src={device.image.url ?? "/images/placeholder-100x100.svg"}
            alt={device.image.alt ?? "A placeholder image"}
            style="width: 100px; height: 100px; object-fit: contain;"
            loading="lazy"
          />
        </div>
      </a>
    </article>
  );
}
