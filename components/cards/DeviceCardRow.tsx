import { Device } from "../../data/device.model.ts";

interface DeviceCardRowProps {
  device: Device;
}

export function DeviceCardRow({ device }: DeviceCardRowProps) {
  return (
    <div class="device-card-row">
      {/* Image Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {device.image?.originalUrl
          ? (
            <img
              loading="lazy"
              src={device.image?.webpUrl ?? "/images/placeholder-100x100.svg"}
              width={100}
              height={100}
              alt={device.image?.alt ?? "A device image"}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                borderRadius: "1em",
              }}
            />
          )
          : (
            <span>
              <img
                src="/images/placeholder-100x100.svg"
                width={100}
                height={100}
                alt="A placeholder image"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  borderRadius: "1em",
                }}
              />
            </span>
          )}
      </div>

      {/* Name Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <strong style={{ color: "var(--pico-contrast)" }}>
          {device.name.raw} <span style={{ fontSize: "0.7rem" }}>by</span>{" "}
          <span
            data-tooltip={device.brand.raw === device.brand.normalized
              ? undefined
              : device.brand.raw}
          >
            {device.brand.normalized}
          </span>
        </strong>
      </div>

      {/* Price Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{ fontSize: "0.7rem" }}
          data-tooltip={device.pricing.range.min === device.pricing.range.max
            ? device.pricing.average
            : `${device.pricing.range.min} - ${device.pricing.range.max}`}
        >
          for {device.pricing.average} {device.pricing.currency}
        </span>
      </div>
    </div>
  );
}
