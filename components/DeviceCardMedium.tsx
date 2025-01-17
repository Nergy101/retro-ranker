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
      <header
        style={{
          flex: 1,
          margin: "0",
          borderRadius: "0.5rem",
        }}
      >
        <hgroup style={{ textAlign: "center" }}>
          <h4
            title={device.name.sanitized}
          >
            <a
              href={`/devices/${device.name.sanitized}`}
            >
              {device.name.raw}
            </a>
          </h4>
          <p style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}>
            {device.brand}
          </p>
          <StarRating device={device} />
          {" "}
        </hgroup>
      </header>
      <a
        href={`/devices/${device.name.sanitized}`}
      >
        <div style="margin: 1em; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <img
            src={device.image.url}
            alt={device.image.alt}
            style="width: 100px; height: 100px; object-fit: contain;"
            loading="lazy"
          />
          <p style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}>
            {device.name}
          </p>
        </div>

        <div style="align-self: flex-start; display: flex; flex-flow: row wrap; gap: 0.5rem;">
          {
            /* {device.specs.map((spec) => (
          <div key={spec.name} style="display: flex; gap: 0.1rem;">
            <div
              style={{
                backgroundColor: {
                  "A": "#22c55e",
                  "B": "#86efac",
                  "C": "#fde047",
                  "D": "#fb923c",
                  "E": "#ef4444",
                }[spec.rating],
                color: spec.rating === "A" || spec.rating === "E"
                  ? "white"
                  : "black",
                padding: "0.25rem",
                borderRadius: "0.25rem",
                minWidth: "1.5rem",
                textAlign: "center",
              }}
            >
              <span>{spec.name}</span>
            </div>
          </div>
        ))} */
          }
        </div>
      </a>
    </article>
  );
}
