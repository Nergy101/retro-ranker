import { PiQuestion } from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceService as _DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { RatingInfo } from "../../islands/devices/rating-info.tsx";
import { CurrencyIcon } from "../shared/currency-icon.tsx";
import { DeviceCardActions } from "../../islands/devices/device-card-actions.tsx";
import { DeviceHelpers, getDeviceImageUrl } from "../../data/frontend/helpers/device.helpers.ts";

interface DeviceCardRowProps {
  device: Device;
  isLoggedIn?: boolean;
  likes?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  showLikeButton?: boolean;
}

export function DeviceCardRow(
  {
    device,
    isLoggedIn = false,
    likes = 0,
    isLiked = false,
    isFavorited = false,
    showLikeButton = true,
  }: DeviceCardRowProps,
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
    <div class="device-card-row">
      {/* Image Section */}
      <div class="device-card-row-section device-card-row-image">
        <img
          loading="lazy"
          src={getDeviceImageUrl(device)}
          width={100}
          height={100}
          alt={device.image?.alt ?? "A device image"}
          class="device-card-image"
        />
      </div>

      {/* Name Section */}
      <div class="device-card-row-section device-card-row-name">
        <strong style={{ color: "var(--pico-contrast)" }}>
          {device.name.raw} <span style={{ fontSize: "0.7rem" }}>by</span>{" "}
          <span
            id={`brand-tooltip-${device.name.sanitized}`}
            data-tooltip={device.brand.raw === device.brand.normalized
              ? undefined
              : device.brand.raw}
            aria-describedby={device.brand.raw !== device.brand.normalized
              ? `brand-tooltip-${device.name.sanitized}`
              : undefined}
          >
            {device.brand.normalized}
          </span>
        </strong>
      </div>

      {/* Combined Price/OS and Rating Section - 2x2 Grid */}
      <div class="device-card-row-section-combined">
        {/* Top row: Pricing and OS */}
        <div class="device-card-combined-top-row">
          {/* Price Indicator */}
          {!device.pricing.discontinued && device.pricing.average
            ? (
              <div
                class="device-card-price-indicator"
                data-tooltip={`${device.pricing.range?.min}-${device.pricing.range?.max} ${device.pricing.currency}`}
              >
                {getPriceIndicator()}
              </div>
            )
            : (
              <div
                class="device-card-price-indicator"
                data-tooltip="No pricing available"
                aria-describedby={`no-pricing-tooltip-${device.name.sanitized}`}
              >
                <CurrencyIcon currencyCode="USD" />
                <PiQuestion aria-hidden="true" focusable="false" />
              </div>
            )}

          {/* OS Indicator */}
          <div
            class="device-card-os-icons"
            data-tooltip={device.os.list.join(", ") === "?"
              ? "No OS information available"
              : device.os.list.join(", ")}
            aria-describedby={`os-icons-tooltip-${device.name.sanitized}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "2rem",
            }}
          >
            {device.os.icons.map((icon, idx) => (
              <span key={idx} aria-hidden="true">
                {DeviceHelpers.getOsIconComponent(icon)}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row: Device ratings */}
        <div class="device-card-combined-bottom-row">
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

        {/* Accessibility tooltips */}
        <span
          id={`os-icons-tooltip-${device.name.sanitized}`}
          class="sr-only"
        >
          {device.os.list.join(", ") === "?"
            ? "No OS information available"
            : device.os.list.join(", ")}
        </span>
        <span
          id={`no-pricing-tooltip-${device.name.sanitized}`}
          class="sr-only"
        >
          No pricing available
        </span>
      </div>

      <DeviceCardActions
        deviceId={device.id}
        isLoggedIn={isLoggedIn}
        likes={likes}
        isLiked={isLiked}
        isFavorited={isFavorited}
        showLikeButton={showLikeButton}
      />
    </div>
  );
}
