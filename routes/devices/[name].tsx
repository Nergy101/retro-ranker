import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import {
  PiCalendarCheck,
  PiCalendarSlash,
  PiQuestion
} from "@preact-icons/pi";
import { JSX, VNode } from "preact";
import { CurrencyIcon } from "../../components/CurrencyIcon.tsx";
import { DeviceCardSmall } from "../../components/DeviceCardSmall.tsx";
import { DeviceSpecs } from "../../components/DeviceSpecs.tsx";
import { EmulationPerformance } from "../../components/EmulationPerformance.tsx";
import { StarRating } from "../../components/StarRating.tsx";
import { Device } from "../../data/models/device.model.ts";
import { ClipboardButton } from "../../islands/ClipboardButton.tsx";
import { ShareButton } from "../../islands/ShareButton.tsx";
import { CompareButton } from "../../islands/CompareButton.tsx";
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
      "offers": {
        "@type": "Offer",
        "url": `https://retroranker.site/devices/${device.name.sanitized}`,
        "priceCurrency": device.pricing.currency,
        "price": device.pricing.average,
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
              fontSize: "2rem",
              color: "var(--pico-primary)",
              textAlign: "center",
            }}
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
              data-tooltip={getReleaseDate(device.released).date}
              data-placement="bottom"
            >
              {getReleaseDate(device.released).icon()}

              {getReleaseDate(device.released).expected
                ? "Expected"
                : getReleaseDate(device.released).date}
            </span>
          </div>
        </div>
        <div>
          <div
            style="display: flex; justify-content: center; margin:0;"
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
        <h3 style={{ textAlign: "center" }}>Emulation Performance</h3>

        <EmulationPerformance device={device} />
      </div>

      <div class="device-detail-specs">
        <div style="display: flex; flex-direction: column;">
          <div class="divider" style="padding: 0.5rem 0;"></div>
          <details>
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
                        {device.os.list.join(", ")} {device.os.customFirmwares
                          ? `(${device.os.customFirmwares})`
                          : ""}
                      </td>
                      <td>
                        <div style="display: flex; gap: 0.25rem;">
                          <div>
                            <div
                              data-tooltip={device.os.list.join(", ")}
                              data-placement="bottom"
                              style={{ display: "flex", gap: "0.25rem" }}
                            >
                              {device.os.icons.map((icon) => (
                                DeviceService.getOsIconComponent(icon)
                              ))}
                            </div>
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
                        <span style="display: flex; gap: 0.25rem;">
                          {device.cpu.names.map((name) => <span>{name}</span>)}
                        </span>
                      </td>
                      <td>
                        {device.cpu.cores} cores ({device.cpu.threads}{" "}
                        threads) @ {device.cpu.clockSpeed}
                      </td>
                    </tr>
                    <tr>
                      <td>GPU</td>
                      <td>{device.gpu.name}</td>
                      <td>
                        {device.gpu.cores} cores @ {device.gpu.clockSpeed}
                      </td>
                    </tr>
                    <tr>
                      <td>RAM</td>
                      <td>{device.ram}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Dimensions</td>
                      <td>{device.dimensions}</td>
                      <td>{device.weight}</td>
                    </tr>
                    <tr>
                      <td>Screen</td>
                      <td>{device.screen.size} {device.screen.type}</td>
                      <td>
                        {device.screen.resolution} {device.screen.ppi} PPI
                      </td>
                    </tr>
                    <tr>
                      <td>Battery</td>
                      <td>{device.battery}</td>
                      <td>{device.chargePort}</td>
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

      <div class="device-detail-similar-devices">
        <h2>Similar Devices</h2>
        <div class="similar-devices-grid">
          {similarDevices.map((device) => (
            <DeviceCardSmall
              device={device}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
