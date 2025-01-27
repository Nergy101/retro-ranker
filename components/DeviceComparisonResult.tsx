import { Device } from "../data/models/device.model.ts";
import { CurrencyIcon } from "./CurrencyIcon.tsx";
import { RatingInfo } from "./RatingInfo.tsx";
import { StarRating } from "./StarRating.tsx";

import {
  PiGameController,
  PiGear,
  PiMonitor,
  PiQuestion,
  PiRuler,
  PiWifiHigh,
} from "@preact-icons/pi";
import { DeviceService } from "../services/devices/device.service.ts";
import { Ranking } from "../data/models/ranking.model.ts";

interface DeviceComparisonResultProps {
  device: Device;
  ranking: Ranking;
}

export function DeviceComparisonResult(
  { device, ranking }: DeviceComparisonResultProps,
) {
  const isBest = (categoryName: string) => {
    const betterClass = "better";
    const worseClass = "worse";
    const equalClass = "equal";

    if (categoryName == "all") {
      if (ranking.all[0] == "equal") {
        return equalClass;
      }

      return ranking.all[0] == device.name.sanitized ? betterClass : worseClass;
    }

    if (categoryName == "emuPerformance") {
      if (ranking.emuPerformance[0] == "equal") {
        return equalClass;
      }

      return ranking.emuPerformance[0] == device.name.sanitized
        ? betterClass
        : worseClass;
    }

    if (categoryName == "monitor") {
      if (ranking.monitor[0] == "equal") {
        return equalClass;
      }

      return ranking.monitor[0] == device.name.sanitized
        ? betterClass
        : worseClass;
    }

    if (categoryName == "dimensions") {
      if (ranking.dimensions[0] == "equal") {
        return equalClass;
      }
      return ranking.dimensions[0] == device.name.sanitized
        ? betterClass
        : worseClass;
    }

    if (categoryName == "connectivity") {
      if (ranking.connectivity[0] == "equal") {
        return equalClass;
      }
      return ranking.connectivity[0] == device.name.sanitized
        ? betterClass
        : worseClass;
    }

    if (categoryName == "controls") {
      if (ranking.controls[0] == "equal") {
        return equalClass;
      }
      return ranking.controls[0] == device.name.sanitized
        ? betterClass
        : worseClass;
    }

    if (categoryName == "misc") {
      if (ranking.misc[0] == "equal") {
        return equalClass;
      }
      return ranking.misc[0] == device.name.sanitized
        ? betterClass
        : worseClass;
    }

    return equalClass;
  };

  return (
    <div class="compare-result">
      <div
        class={`compare-result-header ${isBest("all")}`}
        data-placement="right"
        data-tooltip={ranking.all[0] == "equal"
          ? "Equal to other device"
          : ranking.all[0] == device.name.sanitized
          ? "Better"
          : "Worse"}
      >
        <a
          href={`/devices/${device.name.sanitized}`}
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <div>
            <hgroup style={{ textAlign: "center" }}>
              <strong
                title={device.name.sanitized}
              >
                <span style={{ color: "var(--pico-primary)" }}>
                  {device.name.raw}
                </span>
              </strong>
              <p
                style={{
                  fontSize: "0.6rem",
                  color: "var(--pico-contrast)",
                }}
              >
                {device.brand}
              </p>
            </hgroup>
          </div>
          <div>
            {device.image?.originalUrl
              ? (
                <img
                  loading="lazy"
                  src={device.image?.url}
                  width={100}
                  height={100}
                  alt={device.image?.alt ?? "A device image"}
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
          <div style="margin-bottom: .5rem; display: flex; flex-direction: row; justify-content: center; gap: .5rem;">
            {!device.pricing.discontinued
              ? (
                <span
                  style={{ display: "flex", gap: "0.25rem" }}
                  data-tooltip={`${device.pricing.range.min}-${device.pricing.range.max} ${device.pricing.currency}`}
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
              style={{ display: "flex", gap: "0.25rem" }}
              data-tooltip={device.os.list.join(", ") === "?"
                ? "No OS information available"
                : device.os.list.join(", ")}
            >
              {device.os.icons.map((icon) =>
                DeviceService.getOsIconComponent(icon)
              )}
            </span>
          </div>
        </a>
      </div>

      <div class="compare-result-summary overflow-auto">
        <table class="striped">
          <tbody>
            <tr>
              <td>
                <strong>Release Date</strong>
              </td>
              <td>
                {DeviceService.getReleaseDate(device)}
              </td>
            </tr>
            <tr>
              <td>
                <strong>RAM</strong>
              </td>
              <td>
                {device.ram}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Dimensions</strong>
              </td>
              <td>
                <ul style={{ margin: 0, padding: 0 }}>
                  <li style={{ listStyle: "none" }}>
                    Length: {device.dimensions?.length}
                  </li>
                  <li style={{ listStyle: "none" }}>
                    Width: {device.dimensions?.width}
                  </li>
                  <li style={{ listStyle: "none" }}>
                    Height: {device.dimensions?.height}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class={`compare-result-performance ${isBest("emuPerformance")}`}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <strong
            style={{ marginBottom: "1rem" }}
          >
            Emulation Performance
          </strong>
        </div>

        <div class="compare-result-performance-chips">
          {device.consoleRatings.map((rating) => (
            <RatingInfo key={rating.system} rating={rating} />
          ))}
        </div>
      </div>

      <div
        class={`compare-result-screen ${isBest("monitor")}`}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
          }}
        >
          <span>
            <PiMonitor />
          </span>
        </h3>
        <div class="compare-result-display-table">
          <div class="overflow-auto">
            <table class="striped">
              <tbody>
                <tr>
                  <td>
                    Aspect Ratio
                  </td>
                  <td>
                    {device.screen.aspectRatio}
                  </td>
                </tr>{" "}
                <tr>
                  <td>
                    Screen Size
                  </td>
                  <td>
                    {device.screen.size}
                  </td>
                </tr>
                <tr>
                  <td>
                    Resolution
                  </td>
                  <td>
                    {device.screen.resolution}
                  </td>
                </tr>
                <tr>
                  <td>
                    Screen Type
                  </td>
                  <td>
                    {device.screen.type}
                  </td>
                </tr>
                <tr>
                  <td>
                    Pixel Density
                  </td>
                  <td>
                    {device.screen.ppi}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        class={`compare-result-ergonomics ${isBest("dimensions")}`}
      >
        <div class="compare-result-ergonomics-table">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            <span>
              <PiRuler />
            </span>
          </h3>
          <div class="overflow-auto">
            <table class="striped">
              <tbody>
                <tr>
                  <td>
                    <strong>Weight</strong>
                  </td>
                  <td>
                    {device.weight}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Material</strong>
                  </td>
                  <td>
                    {device.shellMaterial}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Dimensions</strong>
                  </td>
                  <td>
                    {device.dimensions}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Charging Port</strong>
                  </td>
                  <td>
                    {device.chargePort}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        class={`compare-result-connectivity ${isBest("connectivity")}`}
      >
        <div class="compare-result-connectivity-table">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            <span>
              <PiWifiHigh />
            </span>
          </h3>
          <div class="overflow-auto">
            <table class="striped">
              <tbody>
                {device.connectivity && (
                  <>
                    <tr>
                      <th>Wifi</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasWifi,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Bluetooth</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasBluetooth,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>NFC</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasNFC,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>USB</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasUSB,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>HDMI</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasHDMI,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>DisplayPort</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasDisplayPort,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>VGA</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasVGA,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>DVI</th>
                      <td>
                        {DeviceService.getPropertyIconByBool(
                          device.connectivity.hasDVI,
                        )}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        class={`compare-result-controls ${isBest("controls")}`}
      >
        <div class="compare-result-controls-table">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            <span>
              <PiGameController />
            </span>
          </h3>

          <div class="overflow-auto">
            <table class="striped">
              <tbody>
                <tr>
                  <th>Face Buttons</th>
                  <td>
                    {device.controls.faceButtons}
                  </td>
                </tr>
                <tr>
                  <th>D-Pad</th>
                  <td>
                    {device.controls.dPad}
                  </td>
                </tr>
                <tr>
                  <th>Analog Stick</th>
                  <td>
                    {device.controls.analogs}
                  </td>
                </tr>
                <tr>
                  <th>Triggers</th>
                  <td>
                    {device.controls.shoulderButtons}
                  </td>
                </tr>
                <tr>
                  <th>Extra Buttons</th>
                  <td>
                    {device.controls.extraButtons}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class={`compare-result-misc ${isBest("misc")}`}>
        <div class="compare-result-misc-table">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            <span>
              <PiGear />
            </span>
          </h3>
          <div class="overflow-auto">
            <table class="striped">
              <tbody>
                <tr>
                  <th>Storage</th>
                  <td>
                    {device.storage}
                  </td>
                </tr>
                <tr>
                  <th>Battery</th>
                  <td>
                    {device.battery}
                  </td>
                </tr>
                <tr>
                  <th>RAM</th>
                  <td>
                    {device.ram}
                  </td>
                </tr>
                <tr>
                  <th>Architecture</th>
                  <td>
                    {device.architecture}
                  </td>
                </tr>
                <tr>
                  <th>SoC</th>
                  <td>
                    {device.systemOnChip}
                  </td>
                </tr>
                <tr>
                  <th>CPU</th>
                  <td>
                    {device.cpu.names.join(", ")}
                  </td>
                </tr>
                <tr>
                  <th>CPU Cores</th>
                  <td>
                    {device.cpu.cores}
                  </td>
                </tr>
                <tr>
                  <th>CPU Clock Speed</th>
                  <td>
                    {device.cpu.clockSpeed}
                  </td>
                </tr>
                <tr>
                  <th>CPU Threads</th>
                  <td>
                    {device.cpu.threads}
                  </td>
                </tr>

                <tr>
                  <th>GPU</th>
                  <td>
                    {device.gpu.name}
                  </td>
                </tr>
                <tr>
                  <th>GPU Cores</th>
                  <td>
                    {device.gpu.cores}
                  </td>
                </tr>
                <tr>
                  <th>GPU Clock Speed</th>
                  <td>
                    {device.gpu.clockSpeed}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
