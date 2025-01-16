import { PageProps } from "$fresh/server.ts";
import { CurrencyIcon } from "../../components/CurrencyIcon.tsx";
import { DeviceCardSmall } from "../../components/DeviceCardSmall.tsx";
import { DeviceSpecs } from "../../components/DeviceSpecs.tsx";
import { EmulationPerformance } from "../../components/EmulationPerformance.tsx";
import { StarRating } from "../../components/StarRating.tsx";
import { DeviceService } from "../../data/devices/device.service.ts";
export default function DeviceDetail(props: PageProps) {
  const deviceService = DeviceService.getInstance();
  const device = deviceService.getDeviceByName(props.params?.name);
  const similarDevices = deviceService.getSimilarDevices(
    device?.sanitizedName ?? null,
  );

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
      <div class="device-detail">
        <div class="device-detail-header">
          <div style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; align-items: center;">
            <h2 style={{ fontSize: "2rem", color: "var(--pico-primary)" }}>
              {device.name}
            </h2>
            <div style="display: flex; gap: 0.25rem; align-items: center;">
              <p>{device.brand}</p>
              <p
                data-tooltip={device.os.list.join(", ")}
                data-placement="bottom"
              >
                {device.os.icons.map((icon) => <i class={`${icon}`} />)}
              </p>
            </div>
            <div>
              <img
                src={device.image.url}
                alt={device.image.alt}
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
              <span
                style={{ color: "var(--pico-color)" }}
                data-tooltip={`${device.price.pricingCategory}: ${device.price.raw}`}
                data-placement="bottom"
              >
                <CurrencyIcon currencyCode={device.price.priceCurrency} />
                {device.price.priceAverage} {device.price.priceCurrency}
              </span>
              <span style={{ color: "var(--pico-color)" }}>
                <i class="ph ph-calendar"></i>
                <span>
                  &nbsp;{device.released.raw}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="device-detail-performance">
          <h3>Emulation Performance</h3>

          <EmulationPerformance device={device} />
        </div>

        <div style="grid-area: specs; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div class="divider" style="padding: 0.5rem 0;"></div>
            <details class="summary-details">
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
                        <td>{device.os.list.join(", ")}</td>
                        <td>
                          <span
                            data-tooltip={device.os.list.join(", ")}
                            data-placement="bottom"
                          >
                            {device.os.icons.map((icon) => (
                              <i
                                class={`${icon}`}
                              />
                            ))}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>SOC</td>
                        <td>{device.systemOnChip}</td>
                        <td>{device.architecture}</td>
                      </tr>
                      <tr>
                        <td>CPU</td>
                        <td>{device.cpu}</td>
                        <td>
                          {device.cpuCores} cores @ {device.cpuClockSpeed}
                        </td>
                      </tr>
                      <tr>
                        <td>GPU</td>
                        <td>{device.gpu}</td>
                        <td>
                          {device.gpuCores} cores @ {device.gpuClockSpeed}
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
                        <td>{device.screenSize} {device.screenType}</td>
                        <td>{device.resolution} {device.ppi} PPI</td>
                      </tr>
                      <tr>
                        <td>Battery</td>
                        <td>{device.battery}</td>
                        <td>{device.chargePort}</td>
                      </tr>
                      <tr>
                        <td>Connectivity</td>
                        <td>
                          <span
                            style={{
                              backgroundColor: "var(--pico-secondary)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "var(--pico-border-radius)",
                              marginRight: "0.25rem",
                            }}
                          >
                            WiFi {device.connectivity.hasWifi ? "✅" : "❌"}
                          </span>
                          <span
                            style={{
                              backgroundColor: "var(--pico-secondary)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "var(--pico-border-radius)",
                              marginRight: "0.25rem",
                            }}
                          >
                            NFC{" "}
                            {device.connectivity.hasNFC ? "✅" : "❌"}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              backgroundColor: "var(--pico-secondary)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "var(--pico-border-radius)",
                            }}
                          >
                            Bluetooth{" "}
                            {device.connectivity.hasBluetooth ? "✅" : "❌"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                      </tr>
                      <tr>
                        <td>Ports</td>
                        <td colspan={2}>
                          <span
                            style={{
                              backgroundColor: "var(--pico-secondary)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "var(--pico-border-radius)",
                              marginRight: "0.25rem",
                            }}
                          >
                            USB {device.connectivity.hasUSB ? "✅" : "❌"}
                          </span>
                          <span
                            style={{
                              backgroundColor: "var(--pico-secondary)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "var(--pico-border-radius)",
                              marginRight: "0.25rem",
                            }}
                          >
                            DisplayPort{" "}
                            {device.connectivity.hasDisplayPort ? "✅" : "❌"}
                          </span>
                          <span
                            style={{
                              backgroundColor: "var(--pico-secondary)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "var(--pico-border-radius)",
                              marginRight: "0.25rem",
                            }}
                          >
                            VGA {device.connectivity.hasVGA ? "✅" : "❌"}
                          </span>
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
    </div>
  );
}
