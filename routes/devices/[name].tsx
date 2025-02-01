import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { PiCalendarCheck, PiCalendarSlash, PiQuestion } from "@preact-icons/pi";
import { JSX, VNode } from "preact";
import { CurrencyIcon } from "../../components/shared/CurrencyIcon.tsx";
import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
import { DeviceSpecs } from "../../components/specifications/DeviceSpecs.tsx";
import { EmulationPerformance } from "../../components/EmulationPerformance.tsx";
import { StarRating } from "../../components/ratings/StarRating.tsx";
import { Device } from "../../data/models/device.model.ts";
import { ClipboardButton } from "../../islands/buttons/ClipboardButton.tsx";
import { CompareButton } from "../../islands/buttons/CompareButton.tsx";
import { ShareButton } from "../../islands/buttons/ShareButton.tsx";
import { DeviceService } from "../../services/devices/device.service.ts";

export default function DeviceDetail(props: PageProps) {
  const deviceService = DeviceService.getInstance();
  const device = deviceService.getDeviceByName(props.params?.name);
  const similarDevices = deviceService.getSimilarDevices(
    device?.name.sanitized ?? null,
  );

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
        "name": device.brand,
      },
      "image": device.image?.url ?? "/images/placeholder-100x100.svg",
      "description":
        `${device.name.raw} is a ${device.brand} device. The device is ${device.pricing.category} and costs on average ${device.pricing.average} ${device.pricing.currency}.`,
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
        "name": device.brand,
        "brand": {
          "@type": "Brand",
          "name": device.brand,
        },
      },
      "releaseDate": device.released.mentionedDate
        ? new Date(device.released.mentionedDate).toISOString().split("T")[0]
        : "Unknown",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "RAM",
          "value": device.ram,
        },
        {
          "@type": "PropertyValue",
          "name": "Storage",
          "value": device.storage,
        },
        {
          "@type": "PropertyValue",
          "name": "Battery",
          "value": device.battery,
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
      <Head>
        <title>Retro Ranker - {device.name.raw}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdForDevice(device),
          }}
        />
      </Head>
      <div class="device-detail-header">
        <div style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; align-items: center; padding-bottom: 0.5rem;">
          <h2
            style={{
              fontSize: "1.5rem",
              color: "var(--pico-primary)",
              textAlign: "center",
            }}
            data-tooltip={device.name.normalized != device.name.raw
              ? device.name.raw
              : undefined}
            data-placement="bottom"
          >
            {device.name.raw}
          </h2>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <p>{device.brand}</p>
            <p
              data-tooltip={device.os.list.join(", ") === "?"
                ? "No OS information available"
                : device.os.list.join(", ")}
              data-placement="bottom"
            >
              <span style="display: flex; gap: 0.25rem;">
                {device.os.icons.map((icon) =>
                  DeviceService.getOsIconComponent(icon)
                )}
              </span>
            </p>
          </div>
          <div>
            {device.image?.originalUrl
              ? (
                <img
                  loading="lazy"
                  src={device.image?.url ?? "/images/placeholder-100x100.svg"}
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
                  />
                </span>
              )}
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <p>
              <StarRating device={device} />
            </p>
          </div>
          <div style="display: flex; align-items: center; flex-direction: column;">
            {!device.pricing.discontinued
              ? (
                <span
                  style={{
                    color: "var(--pico-color)",
                    display: "inline-flex",
                  }}
                  data-tooltip={`${device.pricing.category}: 
                ${device.pricing.range?.min}-${device.pricing.range?.max} 
                ${device.pricing.currency}`}
                  data-placement="bottom"
                >
                  <CurrencyIcon currencyCode={device.pricing.currency} />
                  {device.pricing.average}
                </span>
              )
              : (
                <span
                  style={{ display: "flex", gap: "0.25rem" }}
                  data-tooltip="Discontinued"
                >
                  <PiQuestion />
                </span>
              )}
            <span
              style={{
                color: "var(--pico-color)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              data-tooltip={releaseDate.date}
              data-placement="bottom"
            >
              {releaseDate.icon()}

              {releaseDate.expected ? "Expected" : releaseDate.date}
            </span>
          </div>
        </div>
        <div class="device-detail-actions">
          <div
            style="display: flex; justify-content: center; flex-flow: row wrap; margin:0;"
            role="group"
          >
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
      </div>

      <div class="device-detail-performance">
        <EmulationPerformance device={device} />
      </div>

      <div class="device-detail-similar-devices">
        <h2>Similar Devices</h2>
        <div class="similar-devices-grid">
          {similarDevices.map((device) => (
            <a href={`/devices/${device.name.sanitized}`}>
              <DeviceCardMedium
                device={device}
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
                <table class="striped">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Details</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>OS / CFW</td>
                      <td>
                        {device.os.list.join(", ")}
                        {device.os.customFirmwares.length > 0
                          ? `(${device.os.customFirmwares.join(", ")})`
                          : ""}
                      </td>
                      <td>
                        <div style="display: flex; gap: 0.25rem; flex-direction: row;">
                          <div>
                            <span
                              data-tooltip={device.os.list.join(", ")}
                              data-placement="bottom"
                            >
                              {device.os.icons.map((icon) => (
                                DeviceService.getOsIconComponent(icon)
                              ))}
                            </span>
                          </div>
                          <div>
                            <ul>
                              {device.os.links?.map((link) => (
                                <li>
                                  <a href={link.url} target="_blank">
                                    {link.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>SOC</td>
                      <td>{device.systemOnChip}</td>
                      <td>{device.architecture}</td>
                    </tr>
                    <tr>
                      <td>CPU</td>
                      <td>
                        {device.cpus?.map((cpu, index) => (
                          <div key={index} style="display: flex; gap: 0.25rem;">
                            {cpu.names.map((name, nameIndex) => (
                              <span key={nameIndex}>{name}</span>
                            ))}
                          </div>
                        ))}
                      </td>
                      <td>
                        {device.cpus?.map((cpu, index) => (
                          <div key={index}>
                            {cpu.cores} cores ({cpu.threads} threads) @{" "}
                            {cpu.clockSpeed?.max}
                            {cpu.clockSpeed?.unit}
                          </div>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td>GPU</td>
                      <td>
                        {device.gpus?.map((gpu, index) => (
                          <div key={index}>{gpu.name}</div>
                        ))}
                      </td>
                      <td>
                        {device.gpus?.map((gpu, index) => (
                          <div key={index}>
                            {gpu.cores} @ {gpu.clockSpeed?.max}
                            {gpu.clockSpeed?.unit}
                          </div>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td>RAM</td>
                      <td>
                        {device.ram?.type ??
                          DeviceService.getPropertyIconByCharacter(null)}
                      </td>
                      <td>
                        {device.ram?.sizes?.map((size, index) => (
                          <span key={index}>
                            {size}
                            {device.ram?.unit}
                            {index < (device.ram?.sizes?.length ?? 0) - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td>Dimensions</td>
                      <td>
                        {device.dimensions
                          ? `${device.dimensions.length}mm x ${device.dimensions.width}mm x ${device.dimensions.height}mm`
                          : DeviceService.getPropertyIconByCharacter(null)}
                      </td>
                      <td>{device.weight} grams</td>
                    </tr>
                    <tr>
                      <td>Screen</td>
                      <td>
                        {device.screen.size} {device.screen.type?.type}
                        {device.screen.type?.isTouchscreen ? " (Touch)" : ""}
                        {device.screen.type?.isPenCapable ? " (Pen)" : ""}
                      </td>
                      <td>
                        {device.screen.resolution?.map((res) => (
                          <div key={res.raw}>
                            {res.width}x{res.height}
                            {device.screen.ppi?.[0]
                              ? `, ${device.screen.ppi[0]} PPI`
                              : DeviceService.getPropertyIconByCharacter(null)}
                          </div>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td>Battery</td>
                      <td>
                        {device.battery?.capacity} {device.battery?.unit}
                      </td>
                      <td>
                        Charge port: {device.chargePort?.type}{"  "}
                        {device.chargePort?.numberOfPorts &&
                            device.chargePort?.numberOfPorts > 1
                          ? `${device.chargePort?.numberOfPorts}x`
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </details>

          <div class="divider" style="padding: 0.5rem 0;"></div>

          <details>
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
