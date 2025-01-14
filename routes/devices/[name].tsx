import { PageProps } from "$fresh/server.ts";
import {
  getDeviceByName,
  getSimilarDevices,
} from "../../data/device.service.ts";
import { DeviceCardSmall } from "../../components/DeviceCardSmall.tsx";
import { SeeMoreCard } from "../../components/SeeMoreCard.tsx";
import { DeviceSpecs } from "../../components/DeviceSpecs.tsx";
import { StarRating } from "../../components/StarRating.tsx";
import { EmulationPerformance } from "../../components/EmulationPerformance.tsx";
export default function DeviceDetail(props: PageProps) {
  const device = getDeviceByName(props.params?.name);
  const similarDevices = getSimilarDevices(device?.sanitizedName ?? null);

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
    <div>
      <article class="device-detail">
        <header style="grid-area: header; padding: 1em; margin: 0;">
          <hgroup style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; align-items: center;">
            <h2 style={{ fontSize: "2rem", color: "var(--pico-primary)" }}>
              {device.name}
            </h2>
            <div style="display: flex; gap: 0.25rem; align-items: center;">
              <p>{device.brand}</p>
              <p data-tooltip={device.os} data-placement="bottom">
                {device.osIcons.map((icon) => <i class={`${icon}`} />)}
              </p>
            </div>
            <div>
              <img
                src={device.imageUrl}
                alt={device.name}
                style="width: 100px; height: 100px; object-fit: contain;"
              />
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <p>
                <strong>Emulation:&nbsp;</strong>
                <StarRating device={device} />
              </p>
            </div>
            <div style="display: flex; align-items: center; flex-direction: column;">
              <span style={{ color: "var(--pico-color)" }}>
                {device.pricingCategory} ({device.price})
              </span>
              <span style={{ color: "var(--pico-color)" }}>
                <i class="ph ph-calendar"></i>
                <span>&nbsp;{device.released}</span>
              </span>
            </div>
          </hgroup>
        </header>

        <section style="grid-area: specs; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <details open>
              <summary>
                Emulation Performance
              </summary>
              <EmulationPerformance device={device} />
            </details>
            <hr />
            <details>
              <summary>
                <strong style={{ color: "var(--pico-primary)" }}>
                  Specifications
                </strong>
              </summary>
              <DeviceSpecs device={device} />
            </details>
          </div>
        </section>

        <section
          style={{
            gridArea: "similar",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Similar Devices</h2>
          <div class="similar-devices-grid">
            {similarDevices.map((device) => (
              <DeviceCardSmall
                device={device}
              />
            ))}
            <SeeMoreCard href="/devices" />
          </div>
        </section>
      </article>
    </div>
  );
}