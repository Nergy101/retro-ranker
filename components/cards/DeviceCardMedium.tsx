import { PiQuestion } from "@preact-icons/pi";
import { Device } from "../../data/device.model.ts";
import { DeviceService } from "../../services/devices/device.service.ts";
import { CurrencyIcon } from "../shared/CurrencyIcon.tsx";
import { StarRating } from "../ratings/StarRating.tsx";

interface DeviceCardMediumProps {
  device: Device;
  isActive: boolean;
}

export function DeviceCardMedium({ device, isActive }: DeviceCardMediumProps) {
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

  return (
    <article
      class={`device-search-card ${isActive ? "active" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--pico-primary)",
        borderRadius: "0.5rem",
      }}
    >
      <header
        style={{
          flex: 1,
          margin: "0",
          paddingTop: "0.5rem",
          borderRadius: "0.5rem",
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
          borderBottom: "none",
        }}
      >
        <hgroup style={{ textAlign: "center" }}>
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
          <p style={{ fontSize: "0.6rem", color: "var(--pico-contrast)" }}>
            {device.brand}
          </p>
        </hgroup>
      </header>
      <div style="padding: 0.5rem;display: flex; flex-direction: column; justify-content: center; align-items: center;">
        {device.image?.originalUrl
          ? (
            <img
              loading="lazy"
              src={device.image?.url ?? "/images/placeholder-100x100.svg"}
              width={100}
              height={100}
              alt={device.image?.alt ?? "A device image"}
              style="width: 100px; height: 100px; object-fit: contain;"
            />
          )
          : (
            <span
              data-tooltip="No image available"
              data-placement="bottom"
            >
              <img
                src="/images/placeholder-100x100.svg"
                width={100}
                height={100}
                alt="A placeholder image"
              />
            </span>
          )}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <StarRating device={device} />
      </div>
      <div
        style={{
          marginBottom: ".5rem",
          fontSize: ".8rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "baseline",
          gap: ".5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
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
                data-tooltip="No pricing information available"
              >
                <CurrencyIcon currencyCode="USD" />
                <PiQuestion />
              </span>
            )}
        </div>
        <span
          style={{
            display: "flex",
            gap: "0.25rem",
            fontSize: "1.2rem",
            marginTop: "0.5rem",
          }}
          data-tooltip={device.os.list.join(", ") === "?"
            ? "No OS information available"
            : device.os.list.join(", ")}
        >
          {device.os.icons.map((icon) =>
            DeviceService.getOsIconComponent(icon)
          )}
        </span>
      </div>
    </article>
  );
}
