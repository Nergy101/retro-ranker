import { PiQuestion } from "@preact-icons/pi";
import { Device } from "../../data/device.model.ts";
import { DeviceService } from "../../services/devices/device.service.ts";
import { RatingInfo } from "../ratings/RatingInfo.tsx";
import { CurrencyIcon } from "../shared/CurrencyIcon.tsx";

interface DeviceCardRowProps {
  device: Device;
}

export function DeviceCardRow({ device }: DeviceCardRowProps) {
  const upToSystemA = DeviceService.getUptoSystemA(device);
  const upToSystemC = DeviceService.getUptoSystemCOrLower(device);

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

      {/* Rating Section */}
      <div
        style={{
          marginBottom: "0.5rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {upToSystemA && (
          <RatingInfo
            rating={upToSystemA}
            tooltipUseShortSystemName={true}
            tooltipPosition="bottom"
          />
        )}
        {upToSystemC && (
          <RatingInfo
            rating={upToSystemC}
            tooltipUseShortSystemName={true}
            tooltipPosition="bottom"
          />
        )}
      </div>

      {/* Price Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {device.pricing.average !== 0
          ? (
            <span
              style={{
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
              }}
              data-tooltip={device.pricing.range.min ===
                  device.pricing.range.max
                ? device.pricing.average
                : `${device.pricing.range.min} - ${device.pricing.range.max}`}
            >
              <CurrencyIcon currencyCode={device.pricing.currency} />
              {device.pricing.average}
            </span>
          )
          : (
            <span data-tooltip="No price available">
              <PiQuestion />
            </span>
          )}
      </div>
    </div>
  );
}
