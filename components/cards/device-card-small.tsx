import { Device } from "@data/frontend/contracts/device.model.ts";
import { StarRating } from "../ratings/star-rating.tsx";

interface DeviceCardSmallProps {
  device: Device;
}

export function DeviceCardSmall({ device }: DeviceCardSmallProps) {
  return (
    <div
      class="small-card"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <a
        href={`/devices/${device.name.sanitized}`}
        style={{
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1em",
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
            <p
              style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}
              data-tooltip={device.brand.raw === device.brand.normalized
                ? undefined
                : device.brand.raw}
              aria-describedby={device.brand.raw !== device.brand.normalized
                ? `brand-tooltip-${device.name.sanitized}`
                : undefined}
            >
              {device.brand.normalized}
            </p>
            {device.brand.raw !== device.brand.normalized && (
              <span
                id={`brand-tooltip-${device.name.sanitized}`}
                class="sr-only"
              >
                {device.brand.raw}
              </span>
            )}
          </hgroup>
          <div class="figure">
            {device.image?.originalUrl
              ? (
                <img
                  loading="lazy"
                  src={device.image?.webpUrl ??
                    "/images/placeholder-100x100.svg"}
                  width={100}
                  height={100}
                  alt={device.image?.alt ?? "A device image"}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                  aria-hidden={device.image?.alt ? "false" : "true"}
                />
              )
              : (
                <span
                  data-tooltip="No image available"
                  data-placement="bottom"
                  aria-describedby={`no-image-tooltip-${device.name.sanitized}`}
                >
                  <img
                    src="/images/placeholder-100x100.svg"
                    width={100}
                    height={100}
                    alt="A placeholder image"
                    aria-hidden="true"
                  />
                  <span
                    id={`no-image-tooltip-${device.name.sanitized}`}
                    class="sr-only"
                  >
                    No image available
                  </span>
                </span>
              )}
          </div>
          <StarRating device={device} />
        </div>
      </a>
    </div>
  );
}
