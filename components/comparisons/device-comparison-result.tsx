import {
  PiGameController,
  PiGear,
  PiMonitor,
  PiQuestion,
  PiRuler,
  PiSpeakerHigh,
  PiWifiHigh,
} from "@preact-icons/pi";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { Ranking } from "../../data/frontend/models/ranking.model.ts";
import { RatingInfo } from "../../islands/devices/rating-info.tsx";
import { StarRating } from "../ratings/star-rating.tsx";
import { CurrencyIcon } from "../shared/currency-icon.tsx";
import { TagComponent } from "../shared/tag-component.tsx";
import { AudioTable } from "../specifications/tables/audio-table.tsx";
import { ConnectivityTable } from "../specifications/tables/connectivity-table.tsx";
import { ControlsTable } from "../specifications/tables/controls-table.tsx";
import { DisplaySpecsTable } from "../specifications/tables/display-specs-table.tsx";
import { MiscellaneousSpecsTable } from "../specifications/tables/miscellaneous-specs-table.tsx";
import { PhysicalSpecsTable } from "../specifications/tables/physical-specs-table.tsx";
import { ProcessingSpecsTable } from "../specifications/tables/processing-specs-table.tsx";
import {
  DeviceHelpers,
  getDeviceImageUrl,
} from "../../data/frontend/helpers/device.helpers.ts";

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

    if (categoryName == "audio") {
      if (ranking.audio[0] == "equal") {
        return equalClass;
      }
      return ranking.audio[0] == device.name.sanitized
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
      >
        <a
          href={`/devices/${device.name.sanitized}`}
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <div>
            <hgroup style={{ textAlign: "center", margin: 0, padding: 0 }}>
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
                data-tooltip={device.brand.raw === device.brand.normalized
                  ? undefined
                  : device.brand.raw}
              >
                {device.brand.normalized}
              </p>
            </hgroup>
          </div>
          <div
            style={{
              width: "200px",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              loading="lazy"
              src={getDeviceImageUrl(device)}
              width={200}
              height={200}
              alt={device.image?.alt ?? "A device image"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                viewTransitionName: `device-image-${device.name.sanitized}`,
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <StarRating device={device} />
          </div>
          <div
            style={{
              marginBottom: ".5rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: ".5rem",
            }}
          >
            {!device.pricing.discontinued && device.pricing.average
              ? (
                <span
                  style={{ display: "flex", gap: "0.25rem" }}
                  data-tooltip={`${device.pricing.range?.min}-${device.pricing.range?.max} ${device.pricing.currency}`}
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
                  data-tooltip="No pricing available"
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
                DeviceHelpers.getOsIconComponent(icon)
              )}
            </span>
          </div>
        </a>
        <div
          class="compare-result-tags"
          style={{ margin: "1rem 0", textAlign: "center" }}
        >
          <div class="tags">
            {device.tags.map((tag) => (
              <TagComponent
                key={tag.name}
                tag={tag}
              />
            ))}
          </div>
        </div>
      </div>

      <div class={`compare-result-summary overflow-auto ${isBest("all")}`}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <strong
            style={{
              marginBottom: "1rem",
              marginTop: ".5rem",
              textAlign: "center",
            }}
          >
            Summary
          </strong>
        </div>
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
        class={`compare-result-audio ${isBest("audio")}`}
      >
        <div class="compare-result-audio-table">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
            }}
          >
            <PiSpeakerHigh />
            <span>
              Audio
            </span>
          </h3>
          <AudioTable device={device} />
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
