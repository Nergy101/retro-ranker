import { Device } from "../data/models/device.model.ts";
import { StarRating } from "./StarRating.tsx";
import { CurrencyIcon } from "./CurrencyIcon.tsx";
import { DeviceService } from "../services/devices/device.service.ts";

interface DeviceCardMediumProps {
  device: Device;
}

export function DeviceCardMedium({ device }: DeviceCardMediumProps) {
  const deviceService = DeviceService.getInstance();

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
            <strong
              title={device.name.sanitized}
            >
              <span style={{ color: "var(--pico-primary)" }}>
                {device.name.raw}
              </span>
            </strong>
            <p style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}>
              {device.brand}
            </p>
          </hgroup>
        </header>
        <div style="padding: 0.5rem;display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <img
            src={device.image.url ?? "/images/placeholder-100x100.svg"}
            alt={device.image.alt ?? "A placeholder image"}
            style="width: 100px; height: 100px; object-fit: contain;"
            loading="lazy"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
              <StarRating device={device} />
            </div>
        <div style="margin-bottom: .5rem; display: flex; flex-direction: row; justify-content: center; gap: .5rem;">
          <span
            style={{ display: "flex", gap: "0.25rem" }}
            data-tooltip={`${device.pricing.range.min}-${device.pricing.range.max} ${device.pricing.currency}`}
          >
            <CurrencyIcon currencyCode={device.pricing.currency} />
            {device.pricing.average}
          </span>
          <span
            style={{ display: "flex", gap: "0.25rem" }}
            data-tooltip={device.os.list.join(", ") === "?"
              ? "No OS information available"
              : device.os.list.join(", ")}
          >
            {device.os.icons.map((icon) =>
              deviceService.getOsIconComponent(icon)
            )}
          </span>
        </div>
      </a>
    </article>
  );
}
