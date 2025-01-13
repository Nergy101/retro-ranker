import { PageProps } from "$fresh/server.ts";
import {
  getDeviceByName,
  getSimilarDevices,
} from "../../data/device.service.ts";
import { DeviceCardSmall } from "../../components/DeviceCardSmall.tsx";
import { SeeMoreCard } from "../../components/SeeMoreCard.tsx";
import { DeviceSpecs } from "../../components/DeviceSpecs.tsx";

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
        <header style="grid-area: header;">
          <hgroup style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; align-items: center;">
            <h2>{device.name}</h2>
            <div style="display: flex; gap: 0.25rem; align-items: center;">
              <span>{device.brand}</span>
              <span data-tooltip={device.os}>
                {device.osIcons.map((icon) => <i class={`${icon}`} />)}
              </span>
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
                <strong>Emulation:</strong>
                &nbsp;
                <span
                  data-tooltip={`Rating: ${device.performanceRating.rating}/15, ${device.performanceRating.maxEmulation}`}
                >
                  {device.performanceRating.tier}
                </span>
              </p>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <p>
                <i class="ph ph-calendar"></i>
                <span>&nbsp;{device.released}</span>
              </p>
            </div>
          </hgroup>
        </header>

        <section style="grid-area: specs; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem;">
          <h2>Specifications</h2>

          <DeviceSpecs device={device} />

          {
            /* <div style="display: grid; gap: 0.5rem; margin: 1rem 0;">
            {
              {device.specs.map((spec) => (
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div
                  style={{
                    backgroundColor: {
                      "A": "#22c55e",
                      "B": "#86efac",
                      "C": "#fde047",
                      "D": "#fb923c",
                      "E": "#ef4444",
                    }[spec.rating],
                    color: spec.rating === "A" || spec.rating === "E"
                      ? "white"
                      : "black",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    fontWeight: "bold",
                    minWidth: "2rem",
                    textAlign: "center",
                  }}
                >
                  {spec.rating}
                </div>
                <strong>{spec.name}:</strong>
                <span>{spec.value}</span>
              </div>
            ))}
            }
          </div> */
          }
        </section>

        <section style={{ gridArea: "similar", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
          <h2>Similar Devices</h2>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(1, 1fr)" }}>
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
