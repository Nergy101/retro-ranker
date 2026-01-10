import { PiQuestion } from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceHelpers, getDeviceImageUrl } from "../../data/frontend/helpers/device.helpers.ts";
import { RatingInfo } from "../../islands/devices/rating-info.tsx";
import { CurrencyIcon } from "../shared/currency-icon.tsx";

interface DeviceCardMediumProps {
  device: Device;
  isActive?: boolean;
  borderColor?: string;
}

export function DeviceCardMedium(
  {
    device,
    isActive = false,
    borderColor,
  }: DeviceCardMediumProps,
) {
  const getPriceIndicator = () => {
    if (device.pricing.discontinued) {
      return (
        <span
          data-tooltip="Discontinued"
          aria-describedby="discontinued-tooltip"
        >
          <PiQuestion aria-hidden="true" focusable="false" />
        </span>
      );
    }
    // if low its 1 dollar sign, if medium its 2 dollar signs, if high its 3 dollar signs
    if (device.pricing.category === "low") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CurrencyIcon currencyCode={device.pricing.currency} />
          <span
            style={{ fontSize: "0.6rem", color: "var(--pico-muted-color)" }}
          >
            {device.pricing.range?.min} - {device.pricing.range?.max}
          </span>
        </div>
      );
    } else if (device.pricing.category === "mid") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <CurrencyIcon currencyCode={device.pricing.currency} />
            <CurrencyIcon currencyCode={device.pricing.currency} />
          </span>
          <span
            style={{ fontSize: "0.6rem", color: "var(--pico-muted-color)" }}
          >
            {device.pricing.range?.min} - {device.pricing.range?.max}
          </span>
        </div>
      );
    } else if (device.pricing.category === "high") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <CurrencyIcon currencyCode={device.pricing.currency} />
            <CurrencyIcon currencyCode={device.pricing.currency} />
            <CurrencyIcon currencyCode={device.pricing.currency} />
          </span>
          <span
            style={{ fontSize: "0.6rem", color: "var(--pico-muted-color)" }}
          >
            {device.pricing.range?.min} - {device.pricing.range?.max}
          </span>
        </div>
      );
    }
  };

  const upToSystemA = DeviceHelpers.getUptoSystemA(device);
  const upToSystemCOrLower = DeviceHelpers.getUptoSystemCOrLower(device);

  return (
    <article
      class={`device-search-card device-card ${isActive ? "active" : ""}`}
      style={borderColor
        ? { borderColor, borderWidth: "2px", borderStyle: "solid" }
        : {}}
    >
      <header class="device-card-header">
        <hgroup class="device-card-hgroup">
          <strong
            data-tooltip={device.name.normalized != device.name.raw
              ? device.name.raw
              : undefined}
            data-placement="bottom"
          >
            <span style={{ color: "var(--pico-primary)" }}>
              {device.name.normalized}
            </span>
          </strong>
          <span
            style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}
            data-tooltip={device.brand.raw === device.brand.normalized
              ? undefined
              : device.brand.raw}
          >
            {device.brand.normalized}
            {" | "}
            <span
              style={{ fontSize: "0.6rem", color: "var(--pico-muted-color)" }}
            >
              {device.released.raw?.toLowerCase().includes("upcoming")
                ? "Upcoming"
                : device.released.raw}
            </span>
          </span>
        </hgroup>
      </header>
      <div class="device-card-info">
        <img
          loading="lazy"
          src={getDeviceImageUrl(device)}
          width={100}
          height={100}
          alt={device.image?.alt ?? "A device image"}
          class="device-card-image"
        />
      </div>
      <div class="device-card-stats">
        <div class="device-card-data-row">
          {/* Left section: price indicator + OS icon */}
          <div class="device-card-left-section">
            {!device.pricing.discontinued && device.pricing.average
              ? (
                <div class="device-card-os-price-section">
                  <div
                    class="device-card-price-indicator"
                    data-tooltip={`${device.pricing.range?.min}-${device.pricing.range?.max} ${device.pricing.currency}`}
                  >
                    {getPriceIndicator()}
                  </div>
                  <div
                    class="device-card-os-icons"
                    data-tooltip={device.os.list.join(", ") === "?"
                      ? "No OS information available"
                      : device.os.list.join(", ")}
                    aria-describedby="os-icons-tooltip"
                  >
                    {device.os.icons.map((icon, idx) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <span
                          key={idx}
                          aria-hidden="true"
                          style="display:inline;"
                        >
                          {DeviceHelpers.getOsIconComponent(icon)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
              : (
                <div class="device-card-os-price-section">
                  <div
                    class="device-card-price-indicator"
                    data-tooltip="No pricing available"
                    aria-describedby="no-pricing-tooltip"
                  >
                    <CurrencyIcon currencyCode="USD" />
                    <PiQuestion aria-hidden="true" focusable="false" />
                  </div>
                  <div
                    class="device-card-os-icons"
                    data-tooltip="No OS information available"
                    aria-describedby="os-icons-tooltip"
                  >
                    <span aria-hidden="true" style="display:inline;">
                      <PiQuestion />
                    </span>
                  </div>
                </div>
              )}
          </div>

          {/* Right section: deviceA/B side by side */}
          <div class="device-card-right-section">
            {upToSystemA && (
              <RatingInfo
                rating={upToSystemA}
                tooltipUseShortSystemName={true}
                tooltipPosition="top"
              />
            )}
            {upToSystemCOrLower && (
              <RatingInfo
                rating={upToSystemCOrLower}
                tooltipUseShortSystemName={true}
                tooltipPosition="top"
              />
            )}
          </div>
        </div>
      </div>

      {/* Accessible tooltip descriptions */}
      <span id="discontinued-tooltip" class="sr-only">
        Device is discontinued
      </span>
      <span id="no-pricing-tooltip" class="sr-only">No pricing available</span>
      <span id="os-icons-tooltip" class="sr-only">Operating system icons</span>
    </article>
  );
}
