import { PiQuestion } from "@preact-icons/pi";
import { Device } from "@data/frontend/contracts/device.model.ts";
import { DeviceService } from "@data/frontend/services/devices/device.service.ts";
import { RatingInfo } from "@islands/devices/rating-info.tsx";
import { CurrencyIcon } from "../shared/currency-icon.tsx";

interface DeviceCardMediumProps {
  device: Device;
  isActive?: boolean;
}

export function DeviceCardMedium(
  { device, isActive = false }: DeviceCardMediumProps,
) {
  const getPriceIndicator = () => {
    if (device.pricing.discontinued) {
      return (
        <span data-tooltip="Discontinued">
          <PiQuestion />
        </span>
      );
    }
    // if low its 1 dollar sign, if medium its 2 dollar signs, if high its 3 dollar signs
    if (device.pricing.category === "low") {
      return (
        <span style={{ display: "flex", alignItems: "flex-end" }}>
          <CurrencyIcon currencyCode={device.pricing.currency} />
        </span>
      );
    } else if (device.pricing.category === "mid") {
      return (
        <span style={{ display: "flex", alignItems: "flex-end" }}>
          <CurrencyIcon currencyCode={device.pricing.currency} />
          <CurrencyIcon currencyCode={device.pricing.currency} />
        </span>
      );
    } else if (device.pricing.category === "high") {
      return (
        <span style={{ display: "flex", alignItems: "flex-end" }}>
          <CurrencyIcon currencyCode={device.pricing.currency} />
          <CurrencyIcon currencyCode={device.pricing.currency} />
          <CurrencyIcon currencyCode={device.pricing.currency} />
        </span>
      );
    }
  };

  const upToSystemA = DeviceService.getUptoSystemA(device);
  const upToSystemCOrLower = DeviceService.getUptoSystemCOrLower(device);

  return (
    <article
      class={`device-search-card device-card ${isActive ? "active" : ""}`}
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
          </span>
        </hgroup>
      </header>
      <div class="device-card-info">
        {device.image?.originalUrl
          ? (
            <img
              loading="lazy"
              src={device.image?.webpUrl ?? "/images/placeholder-100x100.svg"}
              width={100}
              height={100}
              alt={device.image?.alt ?? "A device image"}
              class="device-card-image"
            />
          )
          : (
            <span>
              <img
                src="/images/placeholder-100x100.svg"
                width={100}
                height={100}
                alt="A placeholder image"
                class="device-card-image"
              />
            </span>
          )}
      </div>
      <div class="device-card-stats">
        <div
          class="device-card-price-container"
        >
          {!device.pricing.discontinued && device.pricing.average
            ? (
              <span
                style={{ display: "flex", fontSize: "1rem" }}
                data-tooltip={`${device.pricing.range.min}-${device.pricing.range.max} ${device.pricing.currency}`}
              >
                {getPriceIndicator()}
              </span>
            )
            : (
              <span
                style={{ display: "flex", fontSize: "1rem" }}
                data-tooltip="No pricing available"
              >
                <CurrencyIcon currencyCode="USD" />
                <PiQuestion />
              </span>
            )}
        </div>
        <span
          class="device-card-os-icons"
          data-tooltip={device.os.list.join(", ") === "?"
            ? "No OS information available"
            : device.os.list.join(", ")}
        >
          {device.os.icons.map((icon) =>
            DeviceService.getOsIconComponent(icon)
          )}
        </span>
      </div>
      <div class="device-card-rating-row">
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
    </article>
  );
}
