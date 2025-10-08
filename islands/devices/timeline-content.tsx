import { useEffect, useState } from "preact/hooks";
import { DeviceCardMedium } from "../../components/cards/device-card-medium.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";

interface TimelineContentProps {
  upcomingDevices: Device[];
  devicesGroupedByYearAndMonth: Record<string, Device[]>;
  isLoggedIn: boolean;
  likesCountMap: Record<string, number>;
  userLikedMap: Record<string, boolean>;
  userFavoritedMap: Record<string, boolean>;
  translations: Record<string, string>;
  language: string;
}

export function TimelineContent(
  {
    upcomingDevices,
    devicesGroupedByYearAndMonth,
    // isLoggedIn,
    // likesCountMap,
    // userLikedMap,
    // userFavoritedMap,
    translations: _translations,
    language,
  }: TimelineContentProps,
) {
  const [includeUpcoming, setIncludeUpcoming] = useState(false);

  useEffect(() => {
    const hash = globalThis.location?.hash?.slice(1);
    // Get the hash from the URL (without the #)
    if (hash) {
      // Find the element with the matching ID
      const element = document.getElementById(hash);
      if (element) {
        // Scroll the element into view with a smooth animation
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  const getKeyName = (year: number, month: number) => {
    // Convert language code to locale format (e.g., "en-US" -> "en-US", "de-DE" -> "de-DE")
    const locale = language || "en-US";
    const date = new Date(Date.UTC(year, month));
    const monthName = date.toLocaleString(locale, { month: "long" });
    return (
      <div>
        <span>{monthName}</span>
        <br />
        <span>{year}</span>
      </div>
    );
  };

  return (
    <div class="timeline">
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={includeUpcoming}
            onChange={(
              e,
            ) =>
              setIncludeUpcoming(
                (e.currentTarget as HTMLInputElement).checked,
              )}
          />
          Include upcoming devices
        </label>
      </div>
      {includeUpcoming && (
        <div class="timeline-container">
          <div class="timeline-dot-top"></div>
          <div
            class="timeline-text"
            onClick={() => {
              globalThis.location.hash = "upcoming";
              globalThis.navigator.clipboard.writeText(
                `${globalThis.location.origin}/release-timeline#upcoming`,
              );
            }}
            data-tooltip="Copy link to this section"
            data-placement="bottom"
          >
            <span>Upcoming</span>
            <br />
            <span>devices</span>
          </div>
          <div class="timeline-body">
            <div class="timeline-devices-grid">
              {upcomingDevices.map((device) => {
                return (
                  <a
                    key={device.id}
                    href={`/devices/${device.name.sanitized}`}
                    style={{ textDecoration: "none" }}
                  >
                    <DeviceCardMedium
                      device={device}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {Object.entries(devicesGroupedByYearAndMonth).map(([key, devices]) => {
        const year = parseInt(key.split("-")[0]);
        const month = parseInt(key.split("-")[1]);

        return (
          <div
            key={key}
            class="timeline-container"
            id={key}
          >
            <div class="timeline-dot"></div>
            <div
              class="timeline-text"
              onClick={() => {
                globalThis.location.hash = key;
                globalThis.navigator.clipboard.writeText(
                  `${globalThis.location.origin}/release-timeline#${key}`,
                );
              }}
              data-tooltip="Copy link to this section"
              data-placement="bottom"
            >
              <div>{getKeyName(year, month)}</div>
            </div>
            <div class="timeline-body">
              <div class="timeline-devices-grid">
                {devices.map((device) => {
                  return (
                    <a
                      key={device.id}
                      href={`/devices/${device.name.sanitized}`}
                      style={{ textDecoration: "none" }}
                    >
                      <DeviceCardMedium
                        device={device}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
