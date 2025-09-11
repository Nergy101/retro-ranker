import { PiQuestion } from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { DeviceService as _DeviceService } from "../../data/frontend/services/devices/device.service.ts";
import { RatingInfo } from "../../islands/devices/rating-info.tsx";
import { CurrencyIcon } from "../shared/currency-icon.tsx";
import { DeviceCardActions } from "../../islands/devices/device-card-actions.tsx";
import { DeviceHelpers } from "../../data/frontend/helpers/device.helpers.ts";

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
  const upToSystemA = DeviceHelpers.getUptoSystemA(device);
  const upToSystemC = DeviceHelpers.getUptoSystemCOrLower(device);

  return (
    <div class="device-card-row">
      {/* Image Section */}
      <div class="device-card-row-section">
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

      {/* Rating Section */}
      <div class="device-card-rating-row">
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
      <div class="device-card-row-section">
        {device.pricing.average !== 0
          ? (
            <span
              style={{
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
              }}
              data-tooltip={device.pricing.range?.min ===
                  device.pricing.range?.max
                ? device.pricing.average
                : `${device.pricing.range?.min} - ${device.pricing.range?.max}`}
            >
              <CurrencyIcon currencyCode={device.pricing.currency} />
              {device.pricing.average}
            </span>
          )
          : (
            <span
              data-tooltip="No price available"
              aria-describedby={`no-price-tooltip-${device.name.sanitized}`}
            >
              <PiQuestion aria-hidden="true" focusable="false" />
              <span
                id={`no-price-tooltip-${device.name.sanitized}`}
                class="sr-only"
              >
                No price available
              </span>
            </span>
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
    </div>
  );
}
