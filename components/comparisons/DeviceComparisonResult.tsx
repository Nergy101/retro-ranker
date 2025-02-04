import { Device } from "../../data/device.model.ts";
import { RatingInfo } from "../ratings/RatingInfo.tsx";
import { StarRating } from "../ratings/StarRating.tsx";
import { CurrencyIcon } from "../shared/CurrencyIcon.tsx";
import { DisplaySpecsTable } from "../specifications/tables/DisplaySpecsTable.tsx";

import {
  PiCalendarCheck,
  PiCalendarSlash,
  PiGameController,
  PiGear,
  PiMonitor,
  PiQuestion,
  PiRuler,
  PiWifiHigh,
} from "@preact-icons/pi";
import { VNode } from "https://esm.sh/preact@10.25.4/src/index.js";
import { JSX } from "preact/jsx-runtime";
import { Ranking } from "../../data/models/ranking.model.ts";
import { DeviceService } from "../../services/devices/device.service.ts";
import { ConnectivityTable } from "../specifications/tables/ConnectivityTable.tsx";
import { ControlsTable } from "../specifications/tables/ControlsTable.tsx";
import { MiscellaneousSpecsTable } from "../specifications/tables/MiscellaneousSpecsTable.tsx";
import { PhysicalSpecsTable } from "../specifications/tables/PhysicalSpecsTable.tsx";
import { ProcessingSpecsTable } from "../specifications/tables/ProcessingSpecsTable.tsx";

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

  const releaseDate = getReleaseDate(device.released);

  return (
    <div class="compare-result">
      <div
        class={`compare-result-header ${isBest("all")}`}
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
                  {device.name.normalized}
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
                  src={device.image?.url ?? "/images/placeholder-100x100.svg"}
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
            {!device.pricing.discontinued && device.pricing.average
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
                  style={{ display: "flex" }}
                  data-tooltip="No pricing information available"
                >
                  <CurrencyIcon currencyCode="USD" />
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

          <div>
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
        </a>
      </div>

      <div class={`compare-result-summary overflow-auto ${isBest("all")}`}>
        <ProcessingSpecsTable device={device} />
      </div>

      <div class={`compare-result-performance ${isBest("emuPerformance")}`}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <strong
            style={{ marginBottom: "1rem", textAlign: "center" }}
          >
            Emulation Performance
          </strong>
        </div>

        <div class="compare-result-performance-chips">
          {device.systemRatings.map((rating) => (
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
          <PiMonitor />
          <span>Display</span>
        </h3>
        <DisplaySpecsTable device={device} />
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
            <PiRuler />
            <span>
              Physical
            </span>
          </h3>
          <PhysicalSpecsTable device={device} />
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
            <PiWifiHigh />
            <span>
              Connectivity
            </span>
          </h3>
          <ConnectivityTable device={device} />
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
            <PiGameController />
            <span>
              Controls
            </span>
          </h3>

          <ControlsTable device={device} />
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
            <PiGear />
            <span>
              Miscellaneous
            </span>
          </h3>
          <MiscellaneousSpecsTable device={device} />
        </div>
      </div>
    </div>
  );
}
