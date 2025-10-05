import { PiQuestion } from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceHelpers } from "../../data/frontend/helpers/device.helpers.ts";
import { RatingInfo } from "../../islands/devices/rating-info.tsx";
import { CurrencyIcon } from "../shared/currency-icon.tsx";
import { DeviceCardActions } from "../../islands/devices/device-card-actions.tsx";
import { ProgressiveImage } from "../../islands/ProgressiveImage.tsx";

interface DeviceCardMediumProps {
  device: Device;
  isActive?: boolean;
  isLoggedIn?: boolean;
  likes?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  showLikeButton?: boolean;
  borderColor?: string;
}

export function DeviceCardMedium(
  {
    device,
    isActive = false,
    isLoggedIn = false,
    likes = 0,
    isLiked = false,
    isFavorited = false,
    showLikeButton = true,
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
        <ProgressiveImage
          src={device.image?.webpUrl ?? "/images/placeholder-100x100.svg"}
          alt={device.image?.alt ?? "A device image"}
          className="device-card-image"
          loading="lazy"
        />
      </div>
      <div class="device-card-stats">
        <div class="device-card-price-container">
          {!device.pricing.discontinued && device.pricing.average
            ? (
              <span
                style={{ display: "flex", fontSize: "1rem" }}
                data-tooltip={`${device.pricing.range?.min}-${device.pricing.range?.max} ${device.pricing.currency}`}
              >
                {getPriceIndicator()}
              </span>
            )
            : (
              <span
                style={{ display: "flex", fontSize: "1rem" }}
                data-tooltip="No pricing available"
                aria-describedby="no-pricing-tooltip"
              >
                <CurrencyIcon currencyCode="USD" />
                <PiQuestion aria-hidden="true" focusable="false" />
              </span>
            )}
        </div>
        <span
          class="device-card-os-icons"
          data-tooltip={device.os.list.join(", ") === "?"
            ? "No OS information available"
            : device.os.list.join(", ")}
          aria-describedby="os-icons-tooltip"
        >
          {device.os.icons.map((icon, idx) =>
            // Decorative icons, hide from screen readers
            <span key={idx} aria-hidden="true" style="display:inline;">
              {DeviceHelpers.getOsIconComponent(icon)}
            </span>
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
      <DeviceCardActions
        deviceId={device.id}
        isLoggedIn={isLoggedIn}
        likes={likes}
        isLiked={isLiked}
        isFavorited={isFavorited}
        showLikeButton={showLikeButton}
      />
      {/* Accessible tooltip descriptions */}
      <span id="discontinued-tooltip" class="sr-only">
        Device is discontinued
      </span>
      <span id="no-pricing-tooltip" class="sr-only">No pricing available</span>
      <span id="os-icons-tooltip" class="sr-only">Operating system icons</span>
    </article>
  );
}
