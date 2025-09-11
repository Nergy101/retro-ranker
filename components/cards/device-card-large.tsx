import { PiQuestion } from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { EmulationPerformance } from "../devices/emulation-performance.tsx";
import { StarRating } from "../ratings/star-rating.tsx";
import { CurrencyIcon } from "../shared/currency-icon.tsx";
import { DeviceCardActions } from "../../islands/devices/device-card-actions.tsx";
import { DeviceHelpers } from "../../data/frontend/helpers/device.helpers.ts";

interface DeviceCardLargeProps {
  device: Device;
  isLoggedIn?: boolean;
  likes?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  showLikeButton?: boolean;
}

export function DeviceCardLarge(
  {
    device,
    isLoggedIn = false,
    likes = 0,
    isLiked = false,
    isFavorited = false,
    showLikeButton = true,
  }: DeviceCardLargeProps,
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

  return (
    <article class="device-search-card device-card">
      <header class="device-card-header device-card-header-row">
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
          <div class="device-card-rating-row">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <StarRating device={device} />
            </div>
          </div>

          <div class="device-card-stats">
            <div class="device-card-price-container">
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
                // Decorative OS icons
                <span key={idx} aria-hidden="true">
                  {DeviceHelpers.getOsIconComponent(icon)}
                </span>
              )}
            </span>
          </div>
        </hgroup>
      </header>
      <div style={{ overflowY: "hidden", overflowX: "hidden" }}>
        <EmulationPerformance
          device={device}
          tooltipUseShortSystemName={true}
          useRatingDescription={false}
          hideLikeButton={true}
          user={null}
          likes={null}
          isLiked={false}
          userFavorited={false}
        />
        <DeviceCardActions
          deviceId={device.id}
          isLoggedIn={isLoggedIn}
          likes={likes}
          isLiked={isLiked}
          isFavorited={isFavorited}
          showLikeButton={showLikeButton}
        />
      </div>
      {/* Accessibility tooltips */}
      <span id="discontinued-tooltip" class="sr-only">
        Device is discontinued
      </span>
      <span id="no-pricing-tooltip" class="sr-only">No pricing available</span>
      <span id="os-icons-tooltip" class="sr-only">
        {device.os.list.join(", ") === "?"
          ? "No OS information available"
          : device.os.list.join(", ")}
      </span>
    </article>
  );
}
