import { PageProps } from "$fresh/server.ts";
import { PiCalendarCheck, PiCalendarSlash, PiQuestion } from "@preact-icons/pi";
import { JSX, VNode } from "preact";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { DeviceLinks } from "../../components/DeviceLinks.tsx";
import { EmulationPerformance } from "../../components/EmulationPerformance.tsx";
import { StarRating } from "../../components/ratings/StarRating.tsx";
import { CurrencyIcon } from "../../components/shared/CurrencyIcon.tsx";
import { TagComponent } from "../../components/shared/TagComponent.tsx";
import { DeviceSpecs } from "../../components/specifications/DeviceSpecs.tsx";
import { SummaryTable } from "../../components/specifications/tables/SummaryTable.tsx";
import { Device } from "../../data/device.model.ts";
import { BackButton } from "../../islands/buttons/BackButton.tsx";
import { ClipboardButton } from "../../islands/buttons/ClipboardButton.tsx";
import { CompareButton } from "../../islands/buttons/CompareButton.tsx";
import { ShareButton } from "../../islands/buttons/ShareButton.tsx";
import { DevicesSimilarRadarChart } from "../../islands/charts/DevicesSimilarRadarChart.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";
import SEO from "../../components/SEO.tsx";

export default function DeviceDetail(props: PageProps) {
  const deviceService = DeviceService.getInstance();
  const device = deviceService.getDeviceByName(props.params?.name);
  const similarDevices = deviceService.getSimilarDevices(
    device?.name.sanitized ?? null,
  ).sort((a, b) => b.totalRating - a.totalRating);

  const getReleaseDate = (
    deviceReleased: { raw: string | null; mentionedDate: Date | null },
  ): {
    date: string;
    icon: () => VNode<JSX.SVGAttributes>;
    expected: boolean;
  } => {
    if (!deviceReleased.raw) {
      return {
        date: "Unknown",
        icon: () => <PiQuestion />,
        expected: false,
      };
    }

    if (deviceReleased.mentionedDate) {
      return {
        date: new Date(deviceReleased.mentionedDate).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        ),
        icon: () => <PiCalendarCheck />,
        expected: false,
      };
    }

    return {
      date: deviceReleased.raw,
      icon: () => <PiCalendarSlash />,
      expected: deviceReleased.raw.toLowerCase().includes("upcoming"),
    };
  };

  const jsonLdForDevice = (device: Device | null) => {
    if (!device) return "";

    return JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": device.name.raw,
      "brand": {
        "@type": "Brand",
        "name": device.brand.raw,
      },
      "image": device.image?.pngUrl ?? "/images/placeholder-100x100.svg",
      "description":
        `${device.name.raw} is a ${device.brand.raw} retro gaming handheld device. This ${device.pricing.category} budget emulation device costs on average ${device.pricing.average} ${device.pricing.currency}. Features include ${device.ram?.sizes?.[0]} ${device.ram?.unit} RAM, ${device.storage} storage, and ${device.battery.capacity}${device.battery.unit} battery.`,
      "offers": device.vendorLinks.map((link) => ({
        "@type": "Offer",
        "url": link.url,
        "price": device.pricing?.average ?? "0",
        "priceCurrency": device.pricing?.currency ?? "USD",
        "priceSpecification": {
          "price": device.pricing?.average ?? "0",
          "priceCurrency": device.pricing?.currency ?? "USD",
        },
      })),
      "manufacturer": {
        "@type": "Organization",
        "name": device.brand.raw,
        "brand": {
          "@type": "Brand",
          "name": device.brand.raw,
        },
      },
      "releaseDate": device.released.mentionedDate
        ? new Date(device.released.mentionedDate).toISOString().split("T")[0]
        : "Unknown",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "RAM",
          "value": device.ram?.sizes?.join(", ") + " " + device.ram?.unit,
        },
        {
          "@type": "PropertyValue",
          "name": "Storage",
          "value": device.storage,
        },
        {
          "@type": "PropertyValue",
          "name": "Battery",
          "value": device.battery.capacity + " " + device.battery.unit,
        },
        {
          "@type": "PropertyValue",
          "name": "Operating System",
          "value": device.os.list.join(", "),
        },
        {
          "@type": "PropertyValue",
          "name": "Form Factor",
          "value": device.formFactor,
        },
        {
          "@type": "PropertyValue",
          "name": "Screen Size",
          "value": device.screen.size ? `${device.screen.size} inches` : "Unknown",
        },
      ],
    });
  };

  if (!device) {
    return (
      <div>
        <article>
          <header>
            <h1>Device Not Found</h1>
          </header>
          <p>Sorry, we couldn't find the device you're looking for.</p>
          <footer>
            <a href="/" role="button">Return to Home</a>
          </footer>
        </article>
      </div>
    );
  }

  const releaseDate = getReleaseDate(device.released);

  return (
    <div class="device-detail">
      <SEO
        title={`${device.name.raw} - ${device.brand.raw} Retro Gaming Handheld`}
        description={`${device.name.raw} by ${device.brand.raw}: ${device.pricing.category} budget retro gaming handheld with ${device.ram?.sizes?.[0]} ${device.ram?.unit} RAM, ${device.storage} storage, and ${device.battery.capacity}${device.battery.unit} battery. Release: ${releaseDate.expected ? "Expected" : releaseDate.date}. ${device.os.list.join(", ") !== "?" ? `Supports ${device.os.list.join(", ")}.` : ""} Compare specs and performance ratings.`}
        image={`https://retroranker.site${device.image?.pngUrl ?? undefined}`}
        url={`https://retroranker.site${props.url.pathname}`}
        jsonLd={jsonLdForDevice(device)}
        keywords={`${device.name.raw}, ${device.brand.raw}, ${device.os.list.join(", ")}, retro gaming handheld, emulation device, portable gaming, ${device.pricing.category} budget, retro console, handheld emulator`}
      />

      <div class="device-detail-header">
        <div style={{ margin: 0, padding: 0 }}>
          <BackButton />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 .5rem",
          }}
        >
          <h2
            style={{
              padding: "0",
              margin: "0",
              color: "var(--pico-primary)",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              gap: "0.5rem",
            }}
            data-tooltip={device.name.normalized != device.name.raw
              ? device.name.raw
              : undefined}
            data-placement="bottom"
          >
            {device.name.normalized}
          </h2>
          <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
            <span
              style={{ textAlign: "center" }}
              data-tooltip={device.brand.raw === device.brand.normalized
                ? undefined
                : device.brand.raw}
            >
              {device.brand.normalized}
            </span>
          </div>
          <div>
            {device.image?.originalUrl
              ? (
                <img
                  loading="lazy"
                  src={device.image?.webpUrl ??
                    "/images/placeholder-100x100.svg"}
                  width={100}
                  height={100}
                  alt={device.image?.alt ?? "A device image"}
                  style="width: 100%; height: 100%; object-fit: contain;"
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
          <div style="display: flex; gap: 0.5rem;">
            <StarRating device={device} />
          </div>
          <div style="display: flex; align-items: center; flex-direction: column;">
            <div style="display: flex; gap: 0.25rem;">
              {!device.pricing.discontinued && device.pricing.average
                ? (
                  <span
                    style={{
                      color: "var(--pico-color)",
                      display: "inline-flex",
                      alignItems: "flex-end",
                    }}
                    data-tooltip={`${device.pricing.category}: 
                ${device.pricing.range?.min}-${device.pricing.range?.max} 
                ${device.pricing.currency}`}
                    data-placement="bottom"
                  >
                    <CurrencyIcon currencyCode={device.pricing.currency} />
                    <span style={{ lineHeight: "normal", fontSize: "0.9rem" }}>
                      {device.pricing.average}
                    </span>
                  </span>
                )
                : (
                  <span
                    style={{ display: "flex" }}
                    data-tooltip="No pricing information available"
                  >
                    <CurrencyIcon currencyCode="USD" />
                    <PiQuestion />
                  </span>
                )}

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

            <span
              style={{
                color: "var(--pico-color)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                paddingTop: "0.25rem",
              }}
            >
              {releaseDate.icon()}

              {releaseDate.expected ? "Expected" : releaseDate.date}
            </span>
          </div>
        </div>
        <div class="device-detail-actions">
          <ClipboardButton
            url={`https://retroranker.site/devices/${device.name.sanitized}`}
          />
          <ShareButton
            title={device.name.raw}
            url={`https://retroranker.site/devices/${device.name.sanitized}`}
          />
          <CompareButton deviceName={device.name.sanitized} />
        </div>
      </div>

      <div class="device-detail-performance">
        <EmulationPerformance device={device} />
      </div>

      <div class="device-detail-links">
        <DeviceLinks device={device} />
      </div>

      <div class="device-detail-similar-devices">
        <h2 style="text-align: center;">Find Similar Devices</h2>
        <DevicesSimilarRadarChart
          device={device}
          similarDevices={similarDevices}
          showTitle={false}
        />
        <div class="tags">
          {device.tags.map((tag) => <TagComponent key={tag.name} tag={tag} />)}
        </div>
        <div class="similar-devices-grid">
          {similarDevices.map((deviceItem) => (
            <a href={`/devices/${deviceItem.name.sanitized}`}>
              <DeviceCardMedium
                device={deviceItem}
                isActive={false}
              />
            </a>
          ))}
        </div>
      </div>

      <div class="device-detail-specs">
        <div style="display: flex; flex-direction: column;">
          <div class="divider" style="padding: 0.5rem 0;"></div>
          <details open>
            <summary>
              <strong style={{ color: "var(--pico-primary)" }}>
                Specifications Summary
              </strong>
            </summary>
            <section>
              <div class="overflow-auto">
                <SummaryTable device={device} />
              </div>
            </section>
          </details>

          <div class="divider" style="padding: 0.5rem 0;"></div>

          <details open>
            <summary>
              <strong style={{ color: "var(--pico-primary)" }}>
                Full Specifications
              </strong>
            </summary>
            <DeviceSpecs device={device} />
          </details>
          <div class="divider" style="padding: 0.5rem 0 0 0;"></div>
        </div>
      </div>
    </div>
  );
}
