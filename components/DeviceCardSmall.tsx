import { Device } from "../data/models/device.model.ts";
import { StarRating } from "./StarRating.tsx";

interface DeviceCardSmallProps {
  device: Device;
}

export function DeviceCardSmall({ device }: DeviceCardSmallProps) {
  return (
    <div
      class="small-card"
      style="display: flex; justify-content: center; align-items: center;"
    >
      <a
        href={`/devices/${device.name.sanitized}`}
        style="font-weight: bold; text-decoration: none;"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "auto",
            gap: ".5rem",
          }}
        >
          <hgroup
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <strong
              style={{
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "8rem",
              }}
              title={device.name.raw}
            >
              <span>{device.name.raw}</span>
            </strong>
            <p style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}>
              {device.brand}
            </p>
          </hgroup>
          <div class="figure" style="width: 4rem; height: 4rem;">
            {device.image?.originalUrl
              ? (
                <img
                  loading="lazy"
                  src={device.image?.url ?? "/images/placeholder-100x100.svg"}
                  width={100}
                  height={100}
                  alt={device.image?.alt ?? "A device image"}
                  style="width: 100px; height: 100px; object-fit: contain;"
                />
              )
              : (
                <span
                  data-tooltip="No image available"
                  data-placement="bottom"
                >
                  <img
                    src="/images/placeholder-100x100.svg"
                    width={100}
                    height={100}
                    alt="A placeholder image"
                  />
                </span>
              )}
          </div>
          <StarRating device={device} />
        </div>
      </a>
    </div>
  );
}
